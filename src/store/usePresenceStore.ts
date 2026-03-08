import { create } from 'zustand';
import { internalSdk } from '../services/internalSdk';

interface PresenceState {
  typingUsers: Record<string, Record<string, string>>; // roomId -> { userId: name }
  setTypingStatus: (roomId: string, userId: string, name: string | null) => void;
  updateMyTypingStatus: (taskId: string, userId: string, username: string, isTyping: boolean) => Promise<void>;
}

export const usePresenceStore = create<PresenceState>((set) => ({
  typingUsers: {},
  setTypingStatus: (roomId, userId, name) => {
    set((state) => {
      const roomTyping = { ...(state.typingUsers[roomId] || {}) };
      if (name) {
        roomTyping[userId] = name;
      } else {
        delete roomTyping[userId];
      }
      return {
        typingUsers: { ...state.typingUsers, [roomId]: roomTyping },
      };
    });
  },
  updateMyTypingStatus: async (taskId, userId, username, isTyping) => {
    await internalSdk.updateTypingStatus(taskId, userId, username, isTyping);
  },
}));
