# Chat Mentions & Task Tagging Guide

The internal chat system now supports real-time mentions and task tagging to streamline communication.

## 1. User Mentions (@Operative)
- **How to use**: Type the `@` symbol followed by any part of an operative's name.
- **Suggestions**: A popover will appear showing matching operatives. Click a suggestion to insert the full tag.
- **Result**: The mentioned user's name will be highlighted in **Indigo** in the message.

## 2. Task Tagging (#TASK-XXX)
- **How to use**: Type the `#` symbol followed by the task number (e.g., `#TASK-101`).
- **Suggestions**: A popover will appear showing matching tasks. You can search by task number or title.
- **Result**:
  - The task tag will be highlighted in **Emerald** with a hash (\#) icon.
  - Clicking the tag will automatically navigate you to that task's detail view.

## 3. Global Chat Integration
- Task tagging is especially useful in the **Global Command** center to reference specific directives without leaving the chat.

## 4. Tech Specs
- Mentions are parsed on both the frontend (for UI highlighting) and the backend (for analytics and notification triggers).
