/**
 * Internal SDK for The Dynamic Rankers Command Center
 * Centralized API handler for all internal operations.
 */

class InternalSdk {
  private static instance: InternalSdk;

  private constructor() {}

  public static getInstance(): InternalSdk {
    if (!InternalSdk.instance) {
      InternalSdk.instance = new InternalSdk();
    }
    return InternalSdk.instance;
  }

  private async fetchJson(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    if (response.status === 204) return null;
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  // Auth
  async login(credentials: any) {
    return this.fetchJson('/api/internal/auth', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.fetchJson('/api/internal/logout', { method: 'POST' });
  }

  // Users
  async getUsers() {
    return this.fetchJson('/api/internal/users');
  }

  // Tasks
  async getTasks(userId: string) {
    return this.fetchJson(`/api/internal/tasks?userId=${userId}`);
  }

  async createTask(taskData: any) {
    return this.fetchJson('/api/internal/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(id: string, taskData: any) {
    return this.fetchJson(`/api/internal/tasks?id=${id}`, {
      method: 'PATCH',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(id: string) {
    return this.fetchJson(`/api/internal/tasks?id=${id}`, {
      method: 'DELETE',
    });
  }

  // Chat
  async getChatHistory(taskId: string, userId: string) {
    return this.fetchJson(`/api/internal/chat?taskId=${taskId}&userId=${userId}`);
  }

  async sendMessage(messageData: any) {
    return this.fetchJson('/api/internal/chat', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async editMessage(messageId: string, content: string) {
    return this.fetchJson(`/api/internal/chat?id=${messageId}`, {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    });
  }

  async deleteMessage(messageId: string, userId: string) {
    return this.fetchJson(`/api/internal/chat?id=${messageId}&userId=${userId}`, {
      method: 'DELETE',
    });
  }

  // Reactions
  async getFavorites(userId: string) {
    return this.fetchJson(`/api/internal/reactions?userId=${userId}`);
  }

  async toggleReaction(messageId: string, emoji: string) {
    return this.fetchJson('/api/internal/reactions', {
      method: 'POST',
      body: JSON.stringify({ messageId, emoji }),
    });
  }

  // Room Members
  async getRoomMembers(roomId: string) {
    return this.fetchJson(`/api/internal/room_members?roomId=${roomId}`);
  }

  async joinRoom(roomId: string, userId: string) {
    return this.fetchJson('/api/internal/room_members', {
      method: 'POST',
      body: JSON.stringify({ roomId, userId }),
    });
  }

  async leaveRoom(roomId: string, userId: string) {
    return this.fetchJson(`/api/internal/room_members?roomId=${roomId}&userId=${userId}`, {
      method: 'DELETE',
    });
  }

  // CRM
  async getCustomers() {
    return this.fetchJson('/api/internal/crm_customers');
  }

  async createCustomer(customerData: any) {
    return this.fetchJson('/api/internal/crm_customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  }

  async getCustomerProfile(id: string) {
    return this.fetchJson(`/api/internal/crm_customers?id=${id}`);
  }

  async updateCustomer(id: string, customerData: any) {
    return this.fetchJson(`/api/internal/crm_customers?id=${id}`, {
      method: 'PATCH',
      body: JSON.stringify(customerData),
    });
  }

  async getInvoices() {
    return this.fetchJson('/api/internal/crm_invoices');
  }

  async createInvoice(invoiceData: any) {
    return this.fetchJson('/api/internal/crm_invoices', {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    });
  }

  async getAppointments() {
    return this.fetchJson('/api/internal/crm_appointments');
  }

  async createAppointment(appointmentData: any) {
    return this.fetchJson('/api/internal/crm_appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  async updateAppointmentStatus(id: string, status: string) {
      return this.fetchJson(`/api/internal/crm_appointments?id=${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status })
      });
  }

  async deleteAppointment(id: string) {
    return this.fetchJson(`/api/internal/crm_appointments?id=${id}`, {
      method: 'DELETE',
    });
  }

  // Analytics
  async getAnalytics() {
    return this.fetchJson('/api/internal/analytics');
  }

  // Presence/Typing
  async updateTypingStatus(taskId: string, isTyping: boolean) {
    return this.fetchJson('/api/internal/typing', {
      method: 'POST',
      body: JSON.stringify({ taskId, isTyping }),
    });
  }

  async updateReadReceipt(taskId: string) {
    return this.fetchJson('/api/internal/read_receipts', {
      method: 'POST',
      body: JSON.stringify({ taskId }),
    });
  }
}

export const internalSdk = InternalSdk.getInstance();
