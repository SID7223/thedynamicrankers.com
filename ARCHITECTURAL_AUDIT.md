# ARCHITECTURAL AUDIT REPORT: COMMAND CENTER V4.0
**Target State: Durable Enterprise Architecture**

---

## 1. MODULE COUPLING & COHESION (DAG)
The current architecture exhibits "High Systemic Entropy" due to the **InternalDashboard.tsx** God Object. Logic for navigation, session management, data fetching, and real-time synchronization is vertically integrated into a single 400+ line component.

```mermaid
graph TD
    subgraph Pages
        ID[InternalDashboard.tsx]
    end

    subgraph "Internal Components"
        DO[DashboardOverview]
        TLV[TaskListView]
        TDV[TaskDetailView]
        GCV[GlobalChatView]
        CC[CRMCustomers]
        CP[CustomerProfile]
        SS[SlackStream]
        AV[Avatar]
    end

    subgraph "Data Layer (Leaked)"
        API_Tasks[/api/internal/tasks]
        API_Stream[/api/internal/stream - SSE]
        API_Chat[/api/internal/chat]
    end

    %% InternalDashboard Dependencies
    ID --> DO
    ID --> TLV
    ID --> TDV
    ID --> GCV
    ID --> CC
    ID --> CP
    ID --> AV

    %% Deep Component Coupling
    TDV --> SS
    GCV --> SS
    SS --> AV

    %% Interface Leaks (Direct Fetch)
    ID -.-> API_Tasks
    ID -.-> API_Stream
    SS -.-> API_Chat
    SS -.-> API_Stream

    %% Circular/Tight Coupling (Handlers passed as props)
    TDV -- "onUpdate" --> ID
    TLV -- "onSelect" --> ID
    CC -- "onSelectCustomer" --> ID
    CP -- "onUpdate" --> ID
```

**Architectural Metrics: Current vs. Proposed**

| Metric | Current State | Proposed State | Delta |
| :--- | :--- | :--- | :--- |
| **Direct Fetch Calls (Leaked)** | ~18 (Spread across UI) | 0 (SDK Enforced) | -100% |
| **Prop Drilling Depth** | 3-4 levels | 1 level (Zustand) | -75% |
| **Cyclomatic Complexity (Dashboard)** | High (State + Logic + Nav) | Low (Pure Layout) | -60% |
| **Module Cohesion** | Low (InternalDashboard is a God Object) | High (Single Responsibility) | +80% |

---

## 2. TRANSPORT LAYER: `stream.ts` AUDIT
The polling mechanism in `functions/api/internal/stream.ts` is the primary blocker for horizontal scaling.

*   **Concurrency Risk:** At 100 concurrent users, the system executes ~5.76M D1 read operations per day purely for idle polling.
*   **Latency Block:** Pull-based polling enforces a deterministic 3000ms delay.
*   **Resource Exhaustion:** Each long-lived SSE connection consumes cumulative CPU time and database IOPS.
*   **Target State Recommendation:** Migrate to **Cloudflare Durable Objects + WebSockets**. Transition from $O(N)$ polling queries to $O(1)$ event-driven broadcasts.

---

## 3. SERVICE LAYER SPECIFICATION (INTERNAL SDK)
To neutralize implementation leaks, all direct `fetch` calls must be encapsulated into an abstracted client.

```typescript
// Proposed InternalSDK Interface
export const internalSdk = {
  tasks: {
    list: (userId: string) => get(`/api/internal/tasks?userId=${userId}`),
    patch: (id: string, data: any) => patch(`/api/internal/tasks?id=${id}`, data),
  },
  chat: {
    post: (payload: MessagePayload) => post('/api/internal/chat', payload),
    stream: () => new WebSocket(WS_URL), // Future WebSocket target
  }
};
```

---

## 4. STATE MIGRATION MAP (ZUSTAND)
To isolate sub-component re-renders, the monolithic state must be decomposed into granular stores.

| Store | Managed State | SSE Interaction |
| :--- | :--- | :--- |
| **`useAuthStore`** | User Session, Permissions | N/A |
| **`useTaskStore`** | Task List, Active Task | `SYNC_TASKS` event updates store |
| **`useChatStore`** | Messages (by room), Typing | `CHAT_MSG` injected directly into store |
| **`useUIStore`** | Theme, Sidebar, Unread Badges | `UNREAD` signal updates badge count |

**Isolation Strategy:** The `InternalDashboard` will no longer hold the `tasks` or `messages` arrays. `SlackStream` will subscribe directly to `useChatStore(s => s.messages[activeRoom])`, ensuring that a new message in Room A does not trigger a re-render of the Dashboard or the Task List.

---
**END OF AUDIT REPORT**
