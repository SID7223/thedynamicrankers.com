import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Users2,
  Receipt,
  CalendarCheck,
  Menu,
  X,
  LogOut,
  Sun,
  Moon,
  MessageSquare,
  ClipboardList
} from 'lucide-react';
import TaskListView from '../components/internal/TaskListView';
import TaskDetailView from '../components/internal/TaskDetailView';
import GlobalChatView from '../components/internal/GlobalChatView';
import NewTaskModal from '../components/internal/NewTaskModal';
import Avatar from '../components/internal/Avatar';
import CRMCustomers from '../components/internal/CRMCustomers';
import CRMInvoices from '../components/internal/CRMInvoices';
import CRMAppointments from '../components/internal/CRMAppointments';
import CustomerProfile from '../components/internal/CustomerProfile';
import DashboardOverview from '../components/internal/DashboardOverview';

const InternalDashboard: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeView = (searchParams.get('view') as any) || 'dashboard';
  const activeTaskId = searchParams.get('task');
  const selectedCustomerId = searchParams.get('customer');

  const updateNavigation = useCallback((params: { view?: string; task?: string | null; customer?: string | null }) => {
    const newParams = new URLSearchParams(searchParams);
    if (params.view !== undefined) newParams.set('view', params.view);

    if (params.task === null) newParams.delete('task');
    else if (params.task !== undefined) newParams.set('task', params.task);

    if (params.customer === null) newParams.delete('customer');
    else if (params.customer !== undefined) newParams.set('customer', params.customer);

    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const setActiveView = (view: any) => updateNavigation({ view, task: null, customer: null });
  const setActiveTaskId = (task: string | null) => updateNavigation({ task });
  const setSelectedCustomerId = (customer: string | null) => updateNavigation({ customer });
  const [tasks, setTasks] = useState<any[]>([]);
  const [operatives, setOperatives] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState(Date.now());
  const [isDark, setIsDark] = useState(true);

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
      console.error('Data Fetch Failed:', err);
    }
  }, []);

  useEffect(() => {
    const savedSession = sessionStorage.getItem('dr_internal_session');
    if (savedSession) setSession(JSON.parse(savedSession));

    const theme = localStorage.getItem('theme') || 'dark';
    setIsDark(theme === 'dark');
    if (theme === 'dark') document.documentElement.classList.add('dark');

    setLoading(false);
  }, []);

  useEffect(() => {
    if (session) {
      fetchInitialData();
      const eventSource = new EventSource('/api/internal/stream');
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'SYNC_TASKS') fetchInitialData();
        if (data.type === 'CHAT_MSG') setLastMessageTimestamp(Date.now());
      };
      return () => eventSource.close();
    }
  }, [session, fetchInitialData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/internal/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const user = await res.json();
        sessionStorage.setItem('dr_internal_session', JSON.stringify(user));
        setSession(user);
      } else {
        const err = await res.json();
        setAuthError(err.message || 'Login Failed');
      }
    } catch {
      setAuthError('Authentication Server Offline');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('dr_internal_session');
    setSession(null);
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      const res = await fetch('/api/internal/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...taskData, created_by: session.id })
      });
      if (res.ok) {
        setIsNewTaskModalOpen(false);
        fetchInitialData();
      }
    } catch (err) {
      console.error('Create Task Failed:', err);
    }
  };

  const handleUpdateTask = async (id: string, updates: any) => {
    try {
      const res = await fetch(`/api/internal/tasks?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) fetchInitialData();
    } catch (err) {
      console.error('Update Task Failed:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to terminate this directive?')) return;
    try {
      const res = await fetch(`/api/internal/tasks?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setActiveTaskId(null);
        fetchInitialData();
      }
    } catch (err) {
      console.error('Delete Task Failed:', err);
    }
  };

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
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
      <div className="min-h-screen bg-white dark:bg-[#06080D] flex items-center justify-center p-6 font-sans transition-colors duration-300">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-10 shadow-2xl">
          <div className="flex justify-center mb-10"><Shield className="w-16 h-16 text-indigo-500" /></div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white text-center mb-2 tracking-tight">Operations Hub</h1>
          <p className="text-zinc-500 dark:text-zinc-500 text-center mb-10 text-sm">Secure terminal access required.</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2 block">Operative ID (Email)</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-zinc-50 dark:bg-[#161B22] border border-zinc-200 dark:border-zinc-800 rounded-xl px-5 py-4 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all" required />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2 block">Security Clearence (Password)</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-zinc-50 dark:bg-[#161B22] border border-zinc-200 dark:border-zinc-800 rounded-xl px-5 py-4 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all" required />
            </div>
            {authError && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs font-bold text-center uppercase tracking-widest">{authError}</div>}
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-5 rounded-xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] uppercase tracking-[0.2em] text-xs">Initialize Session</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white dark:bg-[#06080D] text-zinc-900 dark:text-zinc-300 font-sans overflow-hidden no-zoom transition-colors duration-300">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} className="fixed inset-y-0 left-0 z-50 w-[280px] bg-zinc-50 dark:bg-[#0B101A] border-r border-zinc-200 dark:border-zinc-800/50 flex flex-col lg:relative lg:translate-x-0 transition-colors duration-300">
            <div className="p-8 flex flex-col gap-10 h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20"><Shield className="w-5 h-5 text-white" /></div>
                  <span className="font-bold text-zinc-900 dark:text-white tracking-tight">OPERATIONS</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"><X size={20} /></button>
              </div>

              <nav className="flex-1 space-y-2">
                <button onClick={() => { setActiveView('dashboard'); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeView === 'dashboard' ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-white/5'}`}>
                  <LayoutDashboard size={20} /><span className="text-sm">Dashboard</span>
                </button>
                <button onClick={() => { setActiveView('tasks'); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeView === 'tasks' ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-white/5'}`}>
                  <ClipboardList size={20} /><span className="text-sm">Tasks</span>
                </button>
                <button onClick={() => { setActiveView('global-chat'); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeView === 'global-chat' ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-white/5'}`}>
                  <MessageSquare size={20} /><span className="text-sm">Global Command</span>
                </button>
                <button onClick={() => { setActiveView('customers'); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeView === 'customers' ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-white/5'}`}>
                  <Users2 size={20} /><span className="text-sm">Customers</span>
                </button>
                <button onClick={() => { setActiveView('invoices'); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeView === 'invoices' ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-white/5'}`}>
                  <Receipt size={20} /><span className="text-sm">Invoices</span>
                </button>
                <button onClick={() => { setActiveView('appointments'); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeView === 'appointments' ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-white/5'}`}>
                  <CalendarCheck size={20} /><span className="text-sm">Appointments</span>
                </button>
              </nav>

              <div className="mt-auto space-y-6">
                <div className="p-5 bg-zinc-200/50 dark:bg-[#11161D] rounded-3xl border border-zinc-300/50 dark:border-zinc-800/50 flex flex-col gap-5 transition-colors duration-300">
                   <div className="flex items-center gap-4">
                     <Avatar name={session.username} isOnline={true} />
                     <div className="flex flex-col min-w-0">
                       <span className="text-sm font-bold text-zinc-900 dark:text-white truncate">{session.username}</span>
                       <span className="text-[10px] text-zinc-500 dark:text-zinc-600 uppercase tracking-widest font-bold">{session.role}</span>
                     </div>
                   </div>
                   <div className="flex items-center justify-between pt-2 border-t border-zinc-300/30 dark:border-zinc-800/30">
                     <button onClick={toggleDarkMode} className="p-2 text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                       {isDark ? <Sun size={20} /> : <Moon size={20} />}
                     </button>
                     <button onClick={handleLogout} className="p-2 text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition-colors">
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
          <button onClick={() => setIsSidebarOpen(true)} className="absolute top-8 left-8 z-40 p-3 bg-white dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white lg:hidden shadow-lg transition-colors">
            <Menu size={20} />
          </button>
        )}

        <div className="flex-1 h-full overflow-hidden flex flex-col">
          {activeView === 'dashboard' && <DashboardOverview />}
          {activeView === 'global-chat' && (
             <GlobalChatView
                currentUser={session}
                operatives={operatives}
                onClose={() => setActiveView('dashboard')}
                lastMessageTimestamp={lastMessageTimestamp}
             />
          )}
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
            <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden bg-white dark:bg-[#0B101A] p-6 lg:p-10 transition-colors duration-300">
              {selectedCustomerId ? (
                <CustomerProfile customerId={selectedCustomerId} onBack={() => setSelectedCustomerId(null)} onUpdate={fetchInitialData} />
              ) : (
                <div className="flex-1 overflow-y-auto custom-scrollbar h-full"><CRMCustomers onSelectCustomer={(c) => setSelectedCustomerId(c.id.toString())} /></div>
              )}
            </div>
          )}
          {activeView === 'invoices' && <div className="flex-1 overflow-y-auto custom-scrollbar h-full bg-white dark:bg-[#0B101A] p-6 lg:p-10 transition-colors duration-300"><CRMInvoices /></div>}
          {activeView === 'appointments' && <div className="flex-1 overflow-y-auto custom-scrollbar h-full bg-white dark:bg-[#0B101A] p-6 lg:p-10 transition-colors duration-300"><CRMAppointments /></div>}
        </div>
      </div>
      <AnimatePresence>{isNewTaskModalOpen && <NewTaskModal onClose={() => setIsNewTaskModalOpen(false)} operatives={operatives} onSubmit={handleCreateTask} />}</AnimatePresence>
    </div>
  );
};

export default InternalDashboard;
