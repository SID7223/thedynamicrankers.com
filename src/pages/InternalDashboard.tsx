import React, { useState, useEffect } from 'react';
import {
  Shield,
  Zap,
  Plus,
  ArrowRight,
  MessageSquare,
  LogOut,
  Calendar,
  AlertCircle,
  Hash,
  Users,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskManager from '../components/internal/TaskManager';
import SlackStream from '../components/internal/SlackStream';
import NewTaskModal from '../components/internal/NewTaskModal';
import PresenceIndicator from '../components/internal/PresenceIndicator';

interface User {
  id: number;
  username: string;
  role: string;
  is_online?: boolean;
}

interface InternalTask {
  id: number;
  title: string;
  description: string | null;
  status: 'pending' | 'completed';
  created_at: string;
  due_date: string | null;
  assigned_to: number | null;
  assigned_username?: string;
}

const InternalDashboard = () => {
  const [session, setSession] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<number>(0);
  const [tasks, setTasks] = useState<InternalTask[]>([]);
  const [operatives, setOperatives] = useState<User[]>([]);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [streamStatus, setStreamStatus] = useState<'connecting' | 'stable' | 'failed'>('connecting');

  useEffect(() => {
    const savedSession = sessionStorage.getItem('internal_session');
    if (savedSession) {
      setSession(JSON.parse(savedSession));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!session) return;

    const fetchData = async () => {
      try {
        const [tasksRes, usersRes] = await Promise.all([
          fetch('/api/internal/tasks'),
          fetch('/api/internal/users')
        ]);

        if (tasksRes.ok && usersRes.ok) {
          const tasksData = await tasksRes.json();
          const usersData = await usersRes.json();
          setTasks(tasksData);
          setOperatives(usersData.results || usersData);
          setStreamStatus('stable');
        }
      } catch {
        setStreamStatus('failed');
      }
    };

    fetchData();

    const eventSource = new EventSource('/api/internal/stream');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'task_update') {
          setTasks(prev => {
            const index = prev.findIndex(t => t.id === data.task.id);
            if (index > -1) {
              const newTasks = [...prev];
              newTasks[index] = data.task;
              return newTasks;
            }
            return [data.task, ...prev];
          });
        } else if (data.type === 'presence_update') {
          setOperatives(prev => prev.map(u =>
            u.id === data.userId ? { ...u, is_online: data.isOnline } : u
          ));
        }
      } catch (err) {
        console.error('SSE Error:', err);
      }
    };

    eventSource.onerror = () => setStreamStatus('failed');

    const heartbeat = setInterval(() => {
      fetch('/api/internal/presence', { method: 'POST' });
    }, 30000);

    return () => {
      eventSource.close();
      clearInterval(heartbeat);
    };
  }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/internal/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const user = await res.json();
        setSession(user);
        sessionStorage.setItem('internal_session', JSON.stringify(user));
      } else {
        const err = await res.json();
        setAuthError(err.message || 'Access Denied');
      }
    } catch {
      setAuthError('Network Failure');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('internal_session');
    setSession(null);
  };

  const handleCreateTask = async (data: { title: string; description: string; due_date: string }) => {
    try {
      const res = await fetch('/api/internal/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const newTask = await res.json();
        setTasks(prev => [newTask, ...prev]);
        setIsNewTaskModalOpen(false);
        setActiveTaskId(newTask.id);
      }
    } catch (err) {
      console.error('Task creation failed:', err);
    }
  };

  const handleToggleTaskStatus = async (taskId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      const res = await fetch(`/api/internal/tasks?id=${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus as "pending" | "completed" } : t));
      }
    } catch (err) {
      console.error('Task update failed:', err);
    }
  };

  const handleAssignTask = async (taskId: number, assignedTo: number | null) => {
    try {
      const res = await fetch(`/api/internal/tasks?id=${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assigned_to: assignedTo })
      });
      if (res.ok) {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, assigned_to: assignedTo } : t));
      }
    } catch (err) {
      console.error('Task assignment failed:', err);
    }
  };

  if (loading && !session) {
    return (
      <div className="min-h-screen bg-[#06080D] flex items-center justify-center">
        <div className="w-8 h-8 border-t-2 border-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#06080D] flex flex-col items-center justify-center p-8 font-sans selection:bg-indigo-500/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="flex justify-center mb-12">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse" />
              <div className="relative bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                <Shield className="w-12 h-12 text-indigo-500" />
              </div>
            </div>
          </div>

          <div className="text-center mb-10 space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">Command Center</h1>
            <p className="text-zinc-500 text-sm">Authorized Personnel Only — Secure Node ID: 2024-DR</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                {authError}
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800 px-5 py-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all rounded-2xl"
                  placeholder="Email Address"
                  required
                />
              </div>
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800 px-5 py-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all rounded-2xl"
                  placeholder="Crypto Key"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              Initiate Handshake
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[10px] text-zinc-700 uppercase tracking-[0.2em] font-medium">
              Encrypted via DR Sovereign Security Protocols
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  const activeTask = activeTaskId === 0 ? null : tasks.find(t => t.id === activeTaskId);

  return (
    <div className="flex h-screen bg-[#06080D] text-zinc-300 font-sans selection:bg-indigo-500/30 overflow-hidden">
      <div className="w-80 bg-[#0B101A] border-r border-zinc-800/50 flex flex-col">
        <div className="p-6 flex items-center justify-between border-b border-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-bold text-white tracking-tight">The Ledger</h2>
          </div>
          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="w-8 h-8 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-lg transition-all flex items-center justify-center group"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:scale-110" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-8">
          <div>
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 px-2">Channels</h3>
            <button
              onClick={() => setActiveTaskId(0)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${activeTaskId === 0 ? 'bg-indigo-600/10 text-white border border-indigo-500/20' : 'hover:bg-zinc-800/50'}`}
            >
              <MessageSquare className={`w-4 h-4 ${activeTaskId === 0 ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
              <span className="text-sm font-medium">Global Command</span>
            </button>
          </div>

          <TaskManager
            tasks={tasks}
            activeTaskId={activeTaskId}
            setActiveTaskId={setActiveTaskId}
            onToggleStatus={handleToggleTaskStatus}
            onAssignTask={handleAssignTask}
            operatives={operatives}
          />
        </div>

        <div className="p-4 bg-[#080C14] border-t border-zinc-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 bg-zinc-800 rounded-xl flex items-center justify-center font-bold text-indigo-400 border border-zinc-700">
                  {session.username[0].toUpperCase()}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#080C14] rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white tracking-wide">{session.username}</span>
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest">{session.role}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className="h-16 px-6 flex items-center justify-between border-b border-zinc-800/50 bg-[#06080D]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <Hash className="w-5 h-5 text-zinc-600" />
            <h2 className="font-bold text-white tracking-tight">
              {activeTaskId === 0 ? 'global-command' : activeTask?.title.toLowerCase().replace(/\s+/g, '-')}
            </h2>
          </div>

          <PresenceIndicator operatives={operatives} status={streamStatus} />
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <SlackStream taskId={activeTaskId} currentUser={session} operatives={operatives} />
        </div>

        {activeTask && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-16 right-6 bottom-6 w-80 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 hidden xl:block overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-white">Directive Details</h3>
              <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${activeTask.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                {activeTask.status}
              </div>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed mb-8">
              {activeTask.description || 'No supplementary data provided for this command.'}
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-xs">
                <Calendar className="w-4 h-4 text-zinc-500" />
                <span className="text-zinc-500 uppercase tracking-widest">Target Date:</span>
                <span className="text-zinc-200 font-medium">{activeTask.due_date ? new Date(activeTask.due_date).toLocaleDateString() : 'ASAP'}</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <Users className="w-4 h-4 text-zinc-500" />
                <span className="text-zinc-500 uppercase tracking-widest">Assigned To:</span>
                <span className="text-zinc-200 font-medium">{activeTask.assigned_username || 'Awaiting Resource'}</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <Clock className="w-4 h-4 text-zinc-500" />
                <span className="text-zinc-500 uppercase tracking-widest">Established:</span>
                <span className="text-zinc-200 font-medium">{new Date(activeTask.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isNewTaskModalOpen && (
          <NewTaskModal
            onClose={() => setIsNewTaskModalOpen(false)}
            onSubmit={handleCreateTask}
          />
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1f2937;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #374151;
        }
      `}</style>
    </div>
  );
};

export default InternalDashboard;
