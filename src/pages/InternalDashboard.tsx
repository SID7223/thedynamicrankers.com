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
  Trash2,
  Edit2,
  Save,
  LayoutDashboard,
  Users2,
  Receipt,
  CalendarCheck,
  Moon,
  Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskListView from '../components/internal/TaskListView';
import TaskDetailView from '../components/internal/TaskDetailView';
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
  status: string;
  priority: string;
  created_at: string;
  due_date: string | null;
  assigned_to: number | null;
  assigned_username?: string;
  assigned_name?: string;
  created_by: number;
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
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<number>(Date.now());
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

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
      else {
        next.set('view', 'tasks');
        next.set('taskId', id.toString());
      }
      return next;
    });
  }, [setSearchParams]);

  const setSelectedCustomerId = useCallback((id: string | null) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (id === null) next.delete('customerId');
      else {
        next.set('view', 'customers');
        next.set('customerId', id);
      }
      return next;
    });
  }, [setSearchParams]);

  const fetchInitialData = useCallback(async () => {
    try {
      const [tasksRes, usersRes] = await Promise.all([
        fetch('/api/internal/tasks'),
        fetch('/api/internal/users')
      ]);
      const tasksData = await tasksRes.json();
      const usersData = await usersRes.json();

      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setOperatives(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      console.error('Data acquisition failure:', err);
    }
  }, []);

  useEffect(() => {
    const savedUser = sessionStorage.getItem('dr_internal_session');
    if (savedUser) {
      setSession(JSON.parse(savedUser));
      fetchInitialData();
    }
    setLoading(false);
  }, [fetchInitialData]);

  useEffect(() => {
    if (!session) return;
    const eventSource = new EventSource('/api/internal/stream');
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'presence_update') {
        setOperatives(prev => prev.map(op => op.id === data.userId ? { ...op, is_online: data.isOnline } : op));
      } else if (data.type === 'new_message') {
        setTasks(prev => prev.map(t => (t.id === data.taskId && data.senderId !== session.id) ? { ...t, hasUnread: true } : t));
        setLastMessageTimestamp(Date.now());
      } else if (data.type === 'task_update' || data.type === 'new_task' || data.type === 'task_deleted') {
        fetchInitialData();
      }
    };
    return () => eventSource.close();
  }, [session, fetchInitialData]);

  useEffect(() => {
    if (session && activeTaskId !== null) {
      setTasks(prev => prev.map(t => t.id === activeTaskId ? { ...t, hasUnread: false } : t));
      fetch('/api/internal/read_receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.id, taskId: activeTaskId })
      }).catch(console.error);
    }
  }, [activeTaskId, session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
        fetchInitialData();
      } else {
        setAuthError('INVALID_CREDENTIALS');
      }
    } catch (err) {
      setAuthError('NETWORK_ERROR');
    }
  };

  const handleLogout = () => {
    setSession(null);
    sessionStorage.removeItem('dr_internal_session');
  };

  const handleCreateTask = async (data: any) => {
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
    } catch (err) {
      console.error('Task deployment failure:', err);
    }
  };

  const handleUpdateTask = async (id: number, data: Partial<InternalTask>) => {
    try {
      const res = await fetch(`/api/internal/tasks?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) fetchInitialData();
    } catch (err) {
      console.error('Directive update failure:', err);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!window.confirm('Terminate this directive permanently?')) return;
    try {
      const res = await fetch(`/api/internal/tasks?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setActiveTaskId(null);
        fetchInitialData();
      }
    } catch (err) {
      console.error('Directive termination failure:', err);
    }
  };

  const toggleDarkMode = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const activeTask = useMemo(() => tasks.find(t => t.id === activeTaskId), [tasks, activeTaskId]);

  if (loading) return null;

  if (!session) {
    return (
      <div className="min-h-screen bg-[#06080D] flex items-center justify-center p-6 font-sans">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-[#11161D] border border-zinc-800 rounded-3xl p-10 shadow-2xl">
          <div className="flex justify-center mb-10"><Shield className="w-16 h-16 text-indigo-500" /></div>
          <h1 className="text-3xl font-bold text-white text-center mb-2 tracking-tight">Operations Hub</h1>
          <p className="text-zinc-500 text-center mb-10 text-sm">Secure terminal access required.</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2 block">Operative ID (Email)</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#161B22] border border-zinc-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all" required />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2 block">Security Clearence (Password)</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[#161B22] border border-zinc-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all" required />
            </div>
            {authError && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold text-center uppercase tracking-widest">{authError}</div>}
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-5 rounded-xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] uppercase tracking-[0.2em] text-xs">Initialize Session</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#06080D] text-zinc-300 font-sans overflow-hidden no-zoom">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} className="fixed inset-y-0 left-0 z-50 w-[280px] bg-[#0B101A] border-r border-zinc-800/50 flex flex-col lg:relative lg:translate-x-0">
            <div className="p-8 flex flex-col gap-10 h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20"><Shield className="w-5 h-5 text-white" /></div>
                  <span className="font-bold text-white tracking-tight">OPERATIONS</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-zinc-500 hover:text-white"><X size={20} /></button>
              </div>

              <nav className="flex-1 space-y-2">
                <button onClick={() => setActiveView('tasks')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeView === 'tasks' ? 'bg-indigo-600/10 text-indigo-400 font-bold border border-indigo-500/20' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}>
                  <LayoutDashboard size={20} /><span className="text-sm">Dashboard</span>
                </button>
                <button onClick={() => setActiveView('customers')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeView === 'customers' ? 'bg-indigo-600/10 text-indigo-400 font-bold border border-indigo-500/20' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}>
                  <Users2 size={20} /><span className="text-sm">Customers</span>
                </button>
                <button onClick={() => setActiveView('invoices')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeView === 'invoices' ? 'bg-indigo-600/10 text-indigo-400 font-bold border border-indigo-500/20' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}>
                  <Receipt size={20} /><span className="text-sm">Invoices</span>
                </button>
                <button onClick={() => setActiveView('appointments')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeView === 'appointments' ? 'bg-indigo-600/10 text-indigo-400 font-bold border border-indigo-500/20' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}>
                  <CalendarCheck size={20} /><span className="text-sm">Appointments</span>
                </button>
              </nav>

              <div className="mt-auto space-y-6">
                <div className="p-5 bg-[#11161D] rounded-3xl border border-zinc-800/50 flex flex-col gap-5">
                   <div className="flex items-center gap-4">
                     <Avatar name={session.username} isOnline={true} />
                     <div className="flex flex-col min-w-0">
                       <span className="text-sm font-bold text-white truncate">{session.username}</span>
                       <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">{session.role}</span>
                     </div>
                   </div>
                   <div className="flex items-center justify-between pt-2 border-t border-zinc-800/30">
                     <button onClick={toggleDarkMode} className="p-2 text-zinc-500 hover:text-indigo-400 transition-colors">
                       {isDark ? <Sun size={20} /> : <Moon size={20} />}
                     </button>
                     <button onClick={handleLogout} className="p-2 text-zinc-500 hover:text-red-400 transition-colors">
                       <LogOut size={20} />
                     </button>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {!isSidebarOpen && (
          <button onClick={() => setIsSidebarOpen(true)} className="absolute top-8 left-8 z-40 p-3 bg-[#11161D] border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white lg:hidden">
            <Menu size={20} />
          </button>
        )}

        <div className="flex-1 h-full overflow-hidden flex flex-col">
          {activeView === 'tasks' && (
            activeTask ? (
              <TaskDetailView
                task={activeTask}
                operatives={operatives}
                currentUser={session}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
                onClose={() => setActiveTaskId(null)}
                lastMessageTimestamp={lastMessageTimestamp}
              />
            ) : (
              <TaskListView
                tasks={tasks}
                operatives={operatives}
                onSelectTask={setActiveTaskId}
                onCreateTask={() => setIsNewTaskModalOpen(true)}
              />
            )
          )}
          {activeView === 'customers' && (
            <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden bg-[#0B101A] p-6 lg:p-10">
              {selectedCustomerId ? (
                <CustomerProfile customerId={selectedCustomerId} onBack={() => setSelectedCustomerId(null)} onUpdate={fetchInitialData} />
              ) : (
                <div className="flex-1 overflow-y-auto custom-scrollbar h-full"><CRMCustomers onSelectCustomer={(c) => setSelectedCustomerId(c.id.toString())} /></div>
              )}
            </div>
          )}
          {activeView === 'invoices' && <div className="flex-1 overflow-y-auto custom-scrollbar h-full bg-[#0B101A] p-6 lg:p-10"><CRMInvoices /></div>}
          {activeView === 'appointments' && <div className="flex-1 overflow-y-auto custom-scrollbar h-full bg-[#0B101A] p-6 lg:p-10"><CRMAppointments /></div>}
        </div>
      </div>
      <AnimatePresence>{isNewTaskModalOpen && <NewTaskModal onClose={() => setIsNewTaskModalOpen(false)} operatives={operatives} onSubmit={handleCreateTask} />}</AnimatePresence>
    </div>
  );
};

export default InternalDashboard;
