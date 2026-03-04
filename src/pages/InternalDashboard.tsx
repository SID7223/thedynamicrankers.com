import React, { useState, useEffect, useCallback } from 'react';
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
import Avatar from '../components/internal/Avatar';

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
  hasUnread?: boolean;
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
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<string>(new Date().toISOString());

  useEffect(() => {
    const savedSession = sessionStorage.getItem('internal_session');
    if (savedSession) {
      setSession(JSON.parse(savedSession));
    }
    setLoading(false);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [tasksRes, usersRes] = await Promise.all([
        fetch('/api/internal/tasks'),
        fetch('/api/internal/users')
      ]);

      if (tasksRes.ok && usersRes.ok) {
        const tasksData = await tasksRes.json();
        const usersData = await usersRes.json();
        setTasks(Array.isArray(tasksData) ? tasksData : (tasksData.results || []));
        setOperatives(Array.isArray(usersData) ? usersData : (usersData.results || []));
        setStreamStatus('stable');
      }
    } catch {
      setStreamStatus('failed');
    }
  }, []);

  useEffect(() => {
    if (!session) return;
    fetchData();

    let eventSource: EventSource | null = null;
    try {
        eventSource = new EventSource('/api/internal/stream');
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'TASK_CREATED') {
               setTasks(prev => {
                 const exists = prev.some(t => t.id === data.payload.id);
                 if (exists) return prev;
                 return [data.payload, ...prev];
               });
            } else if (data.type === 'TASK_TOGGLE') {
               setTasks(prev => prev.map(t => t.id === data.payload.id ? { ...t, status: data.payload.status } : t));
            } else if (data.type === 'CHAT_MSG') {
               // Update global message state to trigger re-renders in children if needed
               setLastMessageTimestamp(new Date().toISOString());

               // Mark as unread if it's not the active task
               if (activeTaskId !== data.payload.task_id) {
                 setTasks(prev => prev.map(t => t.id === data.payload.task_id ? { ...t, hasUnread: true } : t));
               }
            } else if (data.type === 'PRESENCE_UPDATE') {
              setOperatives(prev => prev.map(u =>
                data.active_users.includes(u.username) ? { ...u, is_online: true } : { ...u, is_online: false }
              ));
            }
          } catch (err) {
            console.error('SSE Error:', err);
          }
        };
        eventSource.onerror = () => {
          setStreamStatus('failed');
          // Reconnect logic
          setTimeout(() => {
            if (session) setStreamStatus('connecting');
          }, 5000);
        };
    } catch {
        console.warn('SSE not available');
    }

    const heartbeat = setInterval(() => {
      fetch('/api/internal/presence', { method: 'POST' }).catch(() => {});
    }, 30000);

    return () => {
      eventSource?.close();
      clearInterval(heartbeat);
    };
  }, [session, activeTaskId, fetchData]);

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
        body: JSON.stringify({ ...data, created_by: session?.id })
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
      <div className="min-h-screen bg-[#1f1f1f] flex items-center justify-center">
        <div className="w-8 h-8 border-t-2 border-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#1f1f1f] flex flex-col items-center justify-center p-8 font-sans selection:bg-indigo-500/30">
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
            <h1 className="text-3xl font-bold text-white tracking-tight">Sovereign Node</h1>
            <p className="text-zinc-500 text-sm font-sans uppercase tracking-[0.2em] font-bold">Authorized Members Only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-xs flex items-center gap-2 font-bold font-sans uppercase tracking-widest"
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
                  className="w-full bg-[#2d2e30] border border-zinc-700/50 px-5 py-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all rounded-2xl shadow-inner font-sans"
                  placeholder="Organization Email"
                  required
                />
              </div>
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#2d2e30] border border-zinc-700/50 px-5 py-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all rounded-2xl shadow-inner font-sans"
                  placeholder="Security Key"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 group disabled:opacity-50 uppercase tracking-widest text-xs font-sans"
            >
              Authorize Handshake
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[10px] text-zinc-700 uppercase tracking-[0.2em] font-bold font-sans">
              Encrypted via DR Sovereign Security Protocols
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  const activeTask = activeTaskId === 0 ? null : (Array.isArray(tasks) ? tasks.find(t => t.id === activeTaskId) : null);

  return (
    <div className="flex h-screen bg-[#1f1f1f] text-zinc-300 font-sans selection:bg-indigo-500/30 overflow-hidden">
      <div className="w-80 bg-[#2d2e30] flex flex-col shadow-2xl z-20">
        <div className="p-6 flex items-center justify-between border-b border-zinc-800/50 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-bold text-white tracking-tight text-lg">The Ledger</h2>
          </div>
          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="w-9 h-9 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-xl transition-all flex items-center justify-center group border border-indigo-500/20"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:scale-110" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pt-6">
          <div className="px-6 mb-8">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4 font-sans">Operations</h3>
            <button
              onClick={() => {
                setActiveTaskId(0);
                setTasks(prev => prev.map(t => t.id === 0 ? { ...t, hasUnread: false } : t));
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${activeTaskId === 0 ? 'bg-[#353739] text-white border border-zinc-700/50 shadow-sm' : 'hover:bg-[#353739]/30 text-zinc-400'}`}
            >
              <MessageSquare className={`w-4 h-4 ${activeTaskId === 0 ? 'text-indigo-400' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
              <span className="text-[13px] font-bold tracking-tight font-sans">Global Command</span>
            </button>
          </div>

          <TaskManager
            tasks={tasks}
            activeTaskId={activeTaskId}
            setActiveTaskId={(id) => {
              setActiveTaskId(id);
              setTasks(prev => prev.map(t => t.id === id ? { ...t, hasUnread: false } : t));
            }}
            onToggleStatus={handleToggleTaskStatus}
            onAssignTask={handleAssignTask}
            operatives={operatives}
          />
        </div>

        <div className="p-6 bg-[#262728] border-t border-zinc-800/50 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar name={session.username} isOnline={true} />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white tracking-wide font-sans">{session.username}</span>
                <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold font-sans">{session.role}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2.5 text-zinc-600 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all border border-transparent hover:border-red-400/20"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden bg-[#1f1f1f]">
        <div className="h-20 px-10 flex items-center justify-between border-b border-zinc-800/50 bg-[#1f1f1f]/80 backdrop-blur-xl z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-zinc-800/50 rounded-xl flex items-center justify-center border border-zinc-700/30">
              <Hash className="w-5 h-5 text-indigo-500" />
            </div>
            <h2 className="font-bold text-white tracking-tight text-xl font-sans">
              {activeTaskId === 0 ? 'global-command' : (activeTask?.title || 'active-command').toLowerCase().replace(/\s+/g, '-')}
            </h2>
          </div>

          <PresenceIndicator operatives={operatives} status={streamStatus} />
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <SlackStream taskId={activeTaskId} currentUser={session} operatives={operatives} key={`stream-${activeTaskId}-${lastMessageTimestamp}`} />
        </div>

        {activeTask && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-24 right-10 bottom-10 w-80 bg-[#2d2e30]/80 backdrop-blur-2xl border border-zinc-700/30 rounded-3xl p-8 hidden xl:flex flex-col shadow-2xl z-30 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-white tracking-tight text-lg font-sans">Directive</h3>
              <div className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] border font-sans ${activeTask.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500'}`}>
                {activeTask.status}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              <p className="text-[14px] text-zinc-400 leading-relaxed mb-10 font-sans">
                {activeTask.description || 'No supplementary data provided for this command.'}
              </p>

              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-zinc-800/50 rounded-xl flex items-center justify-center border border-zinc-700/30">
                    <Calendar className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-600 uppercase tracking-[0.2em] font-bold mb-0.5 font-sans">Target Date</span>
                    <span className="text-zinc-200 text-[13px] font-bold font-sans">{activeTask.due_date ? new Date(activeTask.due_date).toLocaleDateString() : 'ASAP'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-zinc-800/50 rounded-xl flex items-center justify-center border border-zinc-700/30">
                    <Users className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-600 uppercase tracking-[0.2em] font-bold mb-0.5 font-sans">Assigned To</span>
                    <span className="text-zinc-200 text-[13px] font-bold font-sans">{activeTask.assigned_username || 'Awaiting Resource'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-zinc-800/50 rounded-xl flex items-center justify-center border border-zinc-700/30">
                    <Clock className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-600 uppercase tracking-[0.2em] font-bold mb-0.5 font-sans">Established</span>
                    <span className="text-zinc-200 text-[13px] font-bold font-sans">{new Date(activeTask.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleToggleTaskStatus(activeTask.id, activeTask.status)}
              className="mt-10 w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl text-xs font-bold uppercase tracking-[0.2em] transition-all border border-zinc-700/50 shadow-lg font-sans"
            >
              {activeTask.status === 'completed' ? 'Re-Open Directive' : 'Finalize Handshake'}
            </button>
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
          background: #374151;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }
      `}</style>
    </div>
  );
};

export default InternalDashboard;
