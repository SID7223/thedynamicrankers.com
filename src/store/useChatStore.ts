import { create } from 'zustand';
import { internalSdk } from '../services/internalSdk';

interface ChatState {
  messages: Record<string, any[]>;
  roomMembers: Record<string, any[]>;
  unreads: Record<string, boolean>;
  favorites: string[];
  lastMessageTimestamp: number;
  fetchChatHistory: (taskId: string, userId: string) => Promise<void>;
  fetchRoomMembers: (roomId: string) => Promise<void>;
  fetchFavorites: (userId: string) => Promise<void>;
  sendMessage: (messageData: any) => Promise<void>;
  addMessage: (roomId: string, message: any) => void;
  setUnread: (roomId: string, hasUnread: boolean) => void;
  setLastMessageTimestamp: (ts: number) => void;
  toggleReaction: (messageId: string, emoji: string, userId: string) => Promise<void>;
  editMessage: (messageId: string, content: string, userId: string) => Promise<void>;
  deleteMessage: (messageId: string, userId: string) => Promise<void>;
  updateReadReceipt: (taskId: string, userId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: {},
  roomMembers: {},
  unreads: {},
  favorites: [],
  lastMessageTimestamp: 0,
  fetchChatHistory: async (taskId, userId) => {
    const history = await internalSdk.getChatHistory(taskId, userId);
    set((state) => ({
      messages: { ...state.messages, [taskId]: history.messages || [] },
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
  setUnread: (roomId, hasUnread) => {
    set((state) => ({
      unreads: { ...state.unreads, [roomId]: hasUnread },
    }));
  },
  setLastMessageTimestamp: (ts) => set({ lastMessageTimestamp: ts }),
  toggleReaction: async (messageId, emoji, userId) => {
    await internalSdk.toggleReaction(messageId, emoji, userId);
  },
  editMessage: async (messageId, content, userId) => {
    await internalSdk.editMessage(messageId, content);
  },
  deleteMessage: async (messageId, userId) => {
    await internalSdk.deleteMessage(messageId, userId);
  },
  updateReadReceipt: async (taskId, userId) => {
    await internalSdk.updateReadReceipt(taskId, userId);
  }
}));
