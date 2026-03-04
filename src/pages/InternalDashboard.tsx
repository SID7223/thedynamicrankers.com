import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  Clock,
  X,
  User as UserIcon,
  FileText,
  ChevronLeft,
  Menu,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskManager from '../components/internal/TaskManager';
import SlackStream from '../components/internal/SlackStream';
import NewTaskModal from '../components/internal/NewTaskModal';
import PresenceIndicator from '../components/internal/PresenceIndicator';
import Avatar from '../components/internal/Avatar';

// CRM Components
import CRMCustomers from '../components/internal/CRMCustomers';
import CustomerProfile from '../components/internal/CustomerProfile';
import CRMInvoices from '../components/internal/CRMInvoices';
import CRMAppointments from '../components/internal/CRMAppointments';

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

type DashboardView = 'tasks' | 'customers' | 'invoices' | 'appointments';

const InternalDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [session, setSession] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<InternalTask[]>([]);
  const [operatives, setOperatives] = useState<User[]>([]);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [showDirectiveDetails, setShowDirectiveDetails] = useState(false);
  const [streamStatus, setStreamStatus] = useState<'connected' | 'reconnecting' | 'disconnected'>('disconnected');
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<number>(Date.now());

  // URL-synced State
  const activeView = (searchParams.get('view') as DashboardView) || 'tasks';
  const activeTaskId = searchParams.get('taskId') ? parseInt(searchParams.get('taskId')!) : null;
  const selectedCustomerId = searchParams.get('customerId') || null;

  // Mobile State
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

  const setActiveView = useCallback((view: DashboardView) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('view', view);
      next.delete('taskId');
      next.delete('customerId');
      return next;
    });
  }, [setSearchParams]);

  const setActiveTaskId = useCallback((id: number | null) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (id === null) next.delete('taskId');
      else next.set('taskId', id.toString());
      return next;
    });
  }, [setSearchParams]);

  const setSelectedCustomerId = useCallback((id: string | null) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (!id) next.delete('customerId');
      else next.set('customerId', id);
      return next;
    });
  }, [setSearchParams]);

  const checkAuth = useCallback(async () => {
    try {
      const savedUser = sessionStorage.getItem('dr_internal_session');
      if (savedUser) {
        setSession(JSON.parse(savedUser));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const fetchInitialData = useCallback(async () => {
    try {
      const [tasksRes, usersRes] = await Promise.all([
        fetch('/api/internal/tasks'),
        fetch('/api/internal/users')
      ]);
      const tasksData = await tasksRes.json();
      const usersData = await usersRes.json();
      setTasks(tasksData);
      setOperatives(usersData);
    } catch (err: unknown) {
      console.error('Failed to load operations data:', err);
    }
  }, []);

  useEffect(() => {
    if (!session) return;
    fetchInitialData();

    // SSE Stream
    const eventSource = new EventSource('/api/internal/stream');
    eventSource.onopen = () => setStreamStatus('connected');
    eventSource.onerror = () => setStreamStatus('reconnecting');

    eventSource.addEventListener('message', (e) => {
      const data = JSON.parse(e.data) as { type: string; payload?: { task_id?: number } };
      if (data.type === 'SYNC_TASKS') {
        fetchInitialData();
      } else if (data.type === 'CHAT_MSG') {
        if (data.payload.task_id !== activeTaskId) {
          setTasks(prev => prev.map(t => t.id === (data.payload.task_id || 0) ? { ...t, hasUnread: true } : t));
        }
        setLastMessageTimestamp(Date.now());
      }
    });

    return () => eventSource.close();
  }, [session, activeTaskId, fetchInitialData]);

  // Mark as read when entering a thread
  useEffect(() => {
    if (session && activeTaskId !== null) {
      fetch('/api/internal/read_receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.id, taskId: activeTaskId })
      });
      // Clear local unread status
      setTasks(prev => prev.map(t => (t.id === activeTaskId || (activeTaskId === 0 && t.id === 0)) ? { ...t, hasUnread: false } : t));
    }
  }, [activeTaskId, session]);

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
        sessionStorage.setItem('dr_internal_session', JSON.stringify(user));
      } else {
        setAuthError('Access Denied: Credentials Rejected');
      }
    } catch (err: unknown) {
      setAuthError('Connection Failed: Intelligence Link Offline');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('dr_internal_session');
    setSession(null);
  };

  const handleCreateTask = async (data: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/internal/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, created_by: session?.id })
      });
      if (res.ok) {
        setIsNewTaskModalOpen(false);
        fetchInitialData();
      }
    } catch (err: unknown) {
      console.error('Task creation failed:', err);
    }
  };

  const handleToggleTaskStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    // Optimistic UI
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus as 'pending' | 'completed' } : t));
    try {
      await fetch(`/api/internal/tasks?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err: unknown) {
      console.error('Task update failed:', err);
      fetchInitialData(); // Rollback
    }
  };

  const handleAssignTask = async (taskId: number, userId: number | null) => {
    // Optimistic UI
    const assignedUser = operatives.find(u => u.id === userId);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, assigned_to: userId, assigned_username: assignedUser?.username } : t));

    try {
      await fetch(`/api/internal/tasks?id=${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assigned_to: userId })
      });
    } catch (err: unknown) {
      console.error('Assignment failed:', err);
      fetchInitialData(); // Rollback
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm('Permanent deletion of directive?')) return;
    setTasks(prev => prev.filter(t => t.id !== id));
    if (activeTaskId === id) setActiveTaskId(null);
    try {
      await fetch(`/api/internal/tasks?id=${id}`, { method: 'DELETE' });
    } catch (err: unknown) {
      console.error('Delete failed:', err);
      fetchInitialData();
    }
  };

  const activeTask = useMemo(() => tasks.find(t => t.id === activeTaskId), [tasks, activeTaskId]);
  const activeTasksCount = useMemo(() => tasks.filter(t => t.status === 'pending').length, [tasks]);

  if (loading) {
    return (
      <div className="h-screen bg-[#06080D] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Zap className="w-8 h-8 text-indigo-500 animate-pulse" />
          <span className="text-indigo-500/50 text-[10px] font-bold uppercase tracking-[0.3em]">Establishing Secure Link</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="h-screen bg-[#06080D] flex items-center justify-center p-6 overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="bg-[#111111] border border-zinc-800 rounded-3xl p-10 shadow-2xl">
            <div className="flex justify-center mb-10">
              <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                <Shield className="w-8 h-8 text-indigo-500" />
              </div>
            </div>
            <div className="text-center mb-10">
              <h1 className="text-2xl font-bold text-white mb-2">Command Center</h1>
              <p className="text-zinc-500 text-sm">Authorized Personnel Only</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Member Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" placeholder="name@domain.com" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Security Key</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" placeholder="••••••••" required />
              </div>
              {authError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <span className="text-red-500 text-xs font-bold uppercase tracking-wide">{authError}</span>
                </div>
              )}
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 group active:scale-[0.98]">
                <span>Initialize Session</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#06080D] flex overflow-hidden font-sans relative">
      <AnimatePresence>
        {isSidebarOpen && window.innerWidth < 1024 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" />
        )}
      </AnimatePresence>

      <motion.div
        animate={{ x: isSidebarOpen || window.innerWidth >= 1024 ? 0 : -320, opacity: isSidebarOpen || window.innerWidth >= 1024 ? 1 : 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`w-80 flex flex-col border-r border-zinc-800/50 bg-[#111111] z-50 absolute lg:relative h-full shadow-2xl lg:shadow-none ${!isSidebarOpen && window.innerWidth < 1024 ? 'pointer-events-none' : ''}`}
      >
        <div className="h-20 px-6 flex items-center justify-between border-b border-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-bold text-white tracking-tight text-lg">The Ledger</h2>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-zinc-500 hover:text-white"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pt-6">
          <div className="px-6 mb-8 space-y-1">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4 font-sans">Navigation</h3>
            {[
              { id: 'tasks', label: 'Operations Hub', icon: MessageSquare, badge: activeTasksCount },
              { id: 'customers', label: 'Customers', icon: UserIcon },
              { id: 'invoices', label: 'Invoices', icon: FileText },
              { id: 'appointments', label: 'Appointments', icon: Calendar },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveView(item.id as DashboardView); if (window.innerWidth < 1024) setIsSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${activeView === item.id ? 'bg-[#353739] text-white border border-zinc-700/50 shadow-sm' : 'hover:bg-[#353739]/30 text-zinc-400'}`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-4 h-4 ${activeView === item.id ? 'text-indigo-400' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
                  <span className="text-[13px] font-bold tracking-tight font-sans">{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="bg-zinc-800 text-zinc-400 text-[10px] px-2 py-0.5 rounded-full border border-zinc-700 font-bold">{item.badge}</span>
                ) : null}
              </button>
            ))}
          </div>

          {activeView === 'tasks' && (
            <div className="px-6 mb-8 border-t border-zinc-800/50 pt-8 hidden lg:block">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4 font-sans">Active Directives</h3>
              <button
                onClick={() => { setActiveTaskId(0); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${activeTaskId === 0 ? 'bg-[#353739] text-white border border-zinc-700/50 shadow-sm' : 'hover:bg-[#353739]/30 text-zinc-400'}`}
              >
                <Hash className={`w-4 h-4 ${activeTaskId === 0 ? 'text-indigo-400' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
                <span className="text-[13px] font-bold tracking-tight font-sans">global-command</span>
              </button>
              <TaskManager tasks={tasks} activeTaskId={activeTaskId || -1} setActiveTaskId={setActiveTaskId} onAssignTask={handleAssignTask} operatives={operatives} onToggleStatus={handleToggleTaskStatus} />
            </div>
          )}
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
            <button onClick={handleLogout} className="p-2.5 text-zinc-600 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all border border-transparent hover:border-red-400/20"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 flex flex-col relative overflow-hidden bg-[#1f1f1f] h-full">
        <div className="lg:hidden h-20 px-6 flex items-center justify-between border-b border-zinc-800/50 bg-[#111111] shrink-0 z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"><Menu size={24} /></button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center"><Shield size={18} className="text-white" /></div>
            <span className="text-white font-bold text-lg tracking-tight font-sans">The Ledger</span>
          </div>
          <button onClick={() => setIsNewTaskModalOpen(true)} className="p-2 -mr-2 text-indigo-400 hover:text-indigo-300 transition-colors"><Plus size={24} /></button>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          {activeView === 'tasks' && (
            activeTaskId === null ? (
              <div className="flex-1 flex flex-col p-6 lg:p-10 overflow-y-auto custom-scrollbar h-full">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 font-sans tracking-tight">Active Directives</h2>
                    <p className="text-zinc-500 text-sm font-sans">Strategic threads and tactical operations.</p>
                  </div>
                </div>
                <div className="grid gap-4">
                  <button onClick={() => { setActiveTaskId(0); }} className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all group bg-[#262728] border border-zinc-800/50 hover:border-indigo-500/30`}>
                    <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/10 transition-colors"><Hash size={24} /></div>
                    <div className="text-left"><span className="text-lg font-bold text-white block">Global Command Feed</span><span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Encrypted Channel</span></div>
                  </button>
                  <TaskManager tasks={tasks} activeTaskId={-1} setActiveTaskId={setActiveTaskId} onAssignTask={handleAssignTask} operatives={operatives} onToggleStatus={handleToggleTaskStatus} />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0 h-full">
                <div className="h-20 px-6 lg:px-10 flex items-center justify-between border-b border-zinc-800/50 bg-[#1f1f1f]/80 backdrop-blur-xl z-10 shadow-sm shrink-0">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <button onClick={() => setActiveTaskId(null)} className="p-2.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl transition-all border border-transparent lg:border-zinc-800/50" title="Return to Directives"><ChevronLeft size={20} /></button>
                    <div className="w-10 h-10 bg-zinc-800/50 rounded-xl flex items-center justify-center border border-zinc-700/30"><Hash className="w-5 h-5 text-indigo-500" /></div>
                    <h2 className="font-bold text-white tracking-tight text-base lg:text-xl font-sans truncate max-w-[120px] sm:max-w-none">{activeTaskId === 0 ? 'global-command' : (activeTask?.title || 'active-command').toLowerCase().replace(/\\s+/g, '-')}</h2>
                  </div>
                  <div className="flex items-center gap-2 lg:gap-4">
                    <div className="hidden sm:block"><PresenceIndicator operatives={operatives} status={streamStatus} /></div>
                    {activeTaskId !== 0 && (
                      <>
                        <button onClick={() => handleDeleteTask(activeTaskId!)} className="p-2 rounded-xl text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-all"><Trash2 size={20} /></button>
                        <button onClick={() => setShowDirectiveDetails(!showDirectiveDetails)} className={`p-2 rounded-xl transition-all ${showDirectiveDetails ? 'bg-indigo-600 text-white' : 'text-zinc-500 hover:bg-zinc-800'}`}><Zap size={20} /></button>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex-1 flex overflow-hidden min-h-0">
                  <div className="flex-1 flex flex-col min-w-0 h-full">
                    <SlackStream taskId={activeTaskId} currentUser={session!} operatives={operatives} key={`stream-${activeTaskId}-${lastMessageTimestamp}`} />
                  </div>
                  <AnimatePresence>
                    {activeTask && showDirectiveDetails && (
                      <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: window.innerWidth < 1024 ? '100%' : 360 }} exit={{ opacity: 0, width: 0 }} className="border-l border-zinc-800/50 bg-[#2d2e30] backdrop-blur-xl shrink-0 flex flex-col overflow-hidden absolute inset-0 z-40 lg:relative lg:inset-auto h-full">
                        <div className="p-8 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-10"><h3 className="font-bold text-white tracking-tight text-2xl font-sans">Directive</h3><button onClick={() => setShowDirectiveDetails(false)} className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-500 transition-colors"><X size={18} /></button></div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 -mr-4">
                                <p className="text-[15px] text-zinc-300 leading-relaxed mb-12 font-sans opacity-90">{activeTask.description || 'No supplementary data provided for this command.'}</p>
                                <div className="space-y-10">
                                    <div className="flex items-center gap-5"><div className="w-11 h-11 bg-zinc-800/80 rounded-2xl flex items-center justify-center border border-zinc-700/30 shadow-sm"><Calendar className="w-5 h-5 text-indigo-400" /></div><div className="flex flex-col"><span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold mb-1 font-sans">Target Date</span><span className="text-zinc-100 text-[14px] font-bold font-sans">{activeTask.due_date ? new Date(activeTask.due_date).toLocaleDateString() : '02/03/3333'}</span></div></div>
                                    <div className="flex items-center gap-5"><div className="w-11 h-11 bg-zinc-800/80 rounded-2xl flex items-center justify-center border border-zinc-700/30 shadow-sm"><Users className="w-5 h-5 text-indigo-400" /></div><div className="flex flex-col"><span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold mb-1 font-sans">Assigned To</span>
                                      <select value={activeTask.assigned_to || ''} onChange={(e) => handleAssignTask(activeTask.id, e.target.value ? parseInt(e.target.value) : null)} className="bg-transparent text-zinc-100 text-[14px] font-bold font-sans outline-none">
                                        <option value="" className="bg-zinc-900 text-zinc-500">Unassigned</option>
                                        {operatives.map(op => <option key={op.id} value={op.id} className="bg-zinc-900">{op.username}</option>)}
                                      </select>
                                    </div></div>
                                    <div className="flex items-center gap-5"><div className="w-11 h-11 bg-zinc-800/80 rounded-2xl flex items-center justify-center border border-zinc-700/30 shadow-sm"><Clock className="w-5 h-5 text-indigo-400" /></div><div className="flex flex-col"><span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold mb-1 font-sans">Established</span><span className="text-zinc-100 text-[14px] font-bold font-sans">{new Date(activeTask.created_at).toLocaleDateString()}</span></div></div>
                                </div>
                            </div>
                            <div className="pt-8 mt-auto"><button onClick={() => handleToggleTaskStatus(activeTask.id, activeTask.status)} className="w-full py-4.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] transition-all border border-zinc-700/50 shadow-xl active:scale-[0.98] font-sans h-14">{activeTask.status === 'completed' ? 'Re-Open Directive' : 'Finalize Handshake'}</button></div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )
          )}
          {activeView === 'customers' && (
            <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden">
              {selectedCustomerId ? (
                <CustomerProfile customerId={selectedCustomerId} onBack={() => setSelectedCustomerId(null)} onUpdate={fetchInitialData} />
              ) : (
                <div className="flex-1 overflow-y-auto custom-scrollbar h-full"><CRMCustomers onSelectCustomer={(c) => setSelectedCustomerId(c.id)} /></div>
              )}
            </div>
          )}
          {activeView === 'invoices' && <div className="flex-1 overflow-y-auto custom-scrollbar h-full"><CRMInvoices /></div>}
          {activeView === 'appointments' && <div className="flex-1 overflow-y-auto custom-scrollbar h-full"><CRMAppointments /></div>}
        </div>
      </div>
      <AnimatePresence>{isNewTaskModalOpen && <NewTaskModal onClose={() => setIsNewTaskModalOpen(false)} onSubmit={handleCreateTask} />}</AnimatePresence>
    </div>
  );
};

export default InternalDashboard;
