import { create } from 'zustand';
import { internalSdk } from '../services/internalSdk';

interface ChatState {
  messages: Record<string, any[]>;
  roomMembers: Record<string, any[]>;
  favorites: string[];
  lastMessageTimestamp: number;
  fetchChatHistory: (taskId: string, userId: string) => Promise<void>;
  fetchRoomMembers: (roomId: string) => Promise<void>;
  fetchFavorites: (userId: string) => Promise<void>;
  sendMessage: (messageData: any) => Promise<void>;
  addMessage: (roomId: string, message: any) => void;
  setLastMessageTimestamp: (ts: number) => void;
  toggleReaction: (messageId: string, emoji: string) => Promise<void>;
  editMessage: (messageId: string, content: string) => Promise<void>;
  deleteMessage: (messageId: string, userId: string) => Promise<void>;
  updateReadReceipt: (taskId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: {},
  roomMembers: {},
  favorites: [],
  lastMessageTimestamp: 0,
  fetchChatHistory: async (taskId, userId) => {
    const history = await internalSdk.getChatHistory(taskId, userId);
    set((state) => ({
      messages: { ...state.messages, [taskId]: history },
    }));
  },
  fetchRoomMembers: async (roomId) => {
    const members = await internalSdk.getRoomMembers(roomId);
    set((state) => ({
      roomMembers: { ...state.roomMembers, [roomId]: members },
    }));
  },
  fetchFavorites: async (userId) => {
    const favorites = await internalSdk.getFavorites(userId);
    set({ favorites });
  },
  sendMessage: async (messageData) => {
    await internalSdk.sendMessage(messageData);
  },
  addMessage: (roomId, message) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: [...(state.messages[roomId] || []), message],
      },
      lastMessageTimestamp: Date.now(),
    }));
  },
  setLastMessageTimestamp: (ts) => set({ lastMessageTimestamp: ts }),
  toggleReaction: async (messageId, emoji) => {
    await internalSdk.toggleReaction(messageId, emoji);
  },
  editMessage: async (messageId, content) => {
    await internalSdk.editMessage(messageId, content);
  },
  deleteMessage: async (messageId, userId) => {
    await internalSdk.deleteMessage(messageId, userId);
  },
  updateReadReceipt: async (taskId) => {
    await internalSdk.updateReadReceipt(taskId);
  }
}));
