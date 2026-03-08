import { create } from 'zustand';
import { internalSdk } from '../services/internalSdk';

interface TaskState {
  tasks: any[];
  operatives: any[];
  isLoading: boolean;
  error: string | null;
  fetchTasksAndOperatives: (userId: string) => Promise<void>;
  createTask: (taskData: any) => Promise<void>;
  updateTask: (id: string, taskData: any) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setUnread: (taskId: string, hasUnread: boolean) => void;
  clearUnreads: (taskId: string) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  operatives: [],
  isLoading: false,
  error: null,
  fetchTasksAndOperatives: async (userId) => {
    set({ isLoading: true });
    try {
      const [tasks, users] = await Promise.all([
        internalSdk.getTasks(userId),
        internalSdk.getUsers()
      ]);
      set({
        tasks: Array.isArray(tasks) ? tasks : [],
        operatives: Array.isArray(users) ? users : [],
        isLoading: false
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
  createTask: async (taskData) => {
    await internalSdk.createTask(taskData);
    // Refresh will be handled by SSE or manual call
  },
  updateTask: async (id, taskData) => {
    await internalSdk.updateTask(id, taskData);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...taskData } : t)),
    }));
  },
  deleteTask: async (id) => {
    await internalSdk.deleteTask(id);
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
  },
  setUnread: (taskId, hasUnread) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, hasUnread } : t)),
    }));
  },
  clearUnreads: (taskId) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, hasUnread: false } : t)),
    }));
  },
}));
