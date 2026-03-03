import React, { useState, useEffect } from 'react';
import TaskManager from '../components/internal/TaskManager';
import SlackStream from '../components/internal/SlackStream';
import NewTaskModal from '../components/internal/NewTaskModal';

interface Task {
  id: number;
  title: string;
  status: 'pending' | 'completed';
  assigned_to: number;
  assigned_name: string;
  due_date?: string;
}

interface Message {
  id: number;
  content: string;
  sender_id: number;
  sender_name: string;
  timestamp: string;
  reactions?: Array<{ emoji: string; user_name: string; user_id: number }>;
}

const InternalDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [operatives, setOperatives] = useState<{id: number, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTyping, setIsTyping] = useState<string[]>([]);

  const currentUser = { id: 1, name: 'SID' };

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/internal/tasks');
      const data = (await response.json()) as unknown as { results: Task[] };
      const fetchedTasks = data.results || [];
      setTasks(fetchedTasks);

      // Keep selected task in sync if it exists
      if (selectedTask) {
          const updated = fetchedTasks.find(t => t.id === selectedTask.id);
          if (updated) setSelectedTask(updated);
      }
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  };

  const fetchMessages = async (taskId: number) => {
    try {
      const response = await fetch(`/api/internal/chat?taskId=${taskId}`);
      const data = (await response.json()) as unknown as { results: Message[] };
      setMessages(data.results || []);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const fetchOperatives = async () => {
    try {
      const response = await fetch('/api/internal/users');
      const data = (await response.json()) as unknown as { results: {id: number, name: string}[] };
      setOperatives(data.results || []);
    } catch (err) {
      console.error('Failed to fetch operatives', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchTasks(), fetchOperatives()]);
      setLoading(false);
    };
    init();

    const eventSource = new EventSource('/api/internal/stream');
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data) as { type: string; payload: Record<string, unknown> };
      if (data.type === 'TASK_TOGGLE' || data.type === 'TASK_CREATED') {
        fetchTasks();
      } else if (data.type === 'CHAT_MSG' && selectedTask?.id === data.payload.task_id) {
        fetchMessages(selectedTask.id);
      } else if (data.type === 'TYPING_INDICATOR') {
        const { user, isTyping: typingStatus } = data.payload as { user: string; isTyping: boolean };
        if (user !== currentUser.name) {
          setIsTyping(prev =>
            typingStatus ? [...new Set([...prev, user])] : prev.filter(u => u !== user)
          );
        }
      }
    };

    return () => eventSource.close();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTask?.id]);

  useEffect(() => {
    if (selectedTask) {
      fetchMessages(selectedTask.id);
    } else {
      setMessages([]);
    }
  }, [selectedTask]);

  const handleToggleTask = async (task: Task) => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));

    try {
      await fetch('/api/internal/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'TOGGLE', id: task.id, status: newStatus })
      });
    } catch {
      fetchTasks();
    }
  };

  const handleCreateTask = async (taskData: { title: string; description: string; assigned_to: number; due_date: string }) => {
    try {
      const response = await fetch('/api/internal/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CREATE', ...taskData, created_by: currentUser.id })
      });
      const data = (await response.json()) as unknown as { success: boolean; id: number };

      if (data.success) {
          await fetchTasks();
          // After creation, automatically select the new task to open the chat thread
          const newTask = tasks.find(t => t.id === data.id);
          if (newTask) {
              setSelectedTask(newTask);
          } else {
              // Fallback: wait a bit for state update or re-fetch logic
              setTimeout(async () => {
                  const response2 = await fetch('/api/internal/tasks');
                  const data2 = (await response2.json()) as unknown as { results: Task[] };
                  const createdTask = data2.results.find(t => t.id === data.id);
                  if (createdTask) setSelectedTask(createdTask);
              }, 500);
          }
      }
    } catch (err) {
      console.error('Failed to create task', err);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedTask) return;

    try {
      await fetch('/api/internal/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SEND', taskId: selectedTask.id, senderId: currentUser.id, content })
      });
      fetchMessages(selectedTask.id);
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const handleReact = async (messageId: number, emoji: string) => {
    const message = messages.find(m => m.id === messageId);
    const hasReacted = message?.reactions?.some(r => r.user_id === currentUser.id && r.emoji === emoji);

    try {
      await fetch('/api/internal/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: hasReacted ? 'DELETE_REACTION' : 'REACT',
          messageId,
          userId: currentUser.id,
          emoji
        })
      });
      if (selectedTask) fetchMessages(selectedTask.id);
    } catch (err) {
      console.error('Failed to react', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06080D] flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-12 h-1 bg-white/5 overflow-hidden relative rounded-full">
          <div className="absolute inset-0 bg-indigo-500 w-1/3 animate-[shimmer_2s_infinite]"></div>
        </div>
        <p className="text-zinc-500 text-[10px] uppercase tracking-widest animate-pulse">
          Establishing Sovereign Link...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#06080D] text-zinc-400 overflow-hidden font-sans">
      <TaskManager
        tasks={tasks}
        activeTaskId={selectedTask?.id}
        onSelectTask={setSelectedTask}
        onToggleTask={handleToggleTask}
        onAddNew={() => setIsModalOpen(true)}
      />

      {selectedTask ? (
        <SlackStream
          messages={messages}
          currentUserId={currentUser.id}
          onSend={handleSendMessage}
          onReact={handleReact}
          isTyping={isTyping}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6">
          <div className="w-24 h-24 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-600/40" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-white font-bold text-xl">Command Center Ready</h2>
            <p className="text-zinc-500 text-sm max-w-xs">Select a task from the ledger to initialize operational oversight.</p>
          </div>
        </div>
      )}

      <NewTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
        operatives={operatives}
      />

      <div className="fixed bottom-0 right-0 p-3 flex items-center gap-6 bg-[#0B101A]/80 backdrop-blur-md border-t border-l border-white/5 rounded-tl-2xl z-50">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Link: Stable</span>
        </div>
        <div className="h-3 w-px bg-white/10" />
        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Node: Edge_D1</span>
      </div>
    </div>
  );
};

export default InternalDashboard;
