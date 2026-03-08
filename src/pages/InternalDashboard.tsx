import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  Users2,
  Receipt,
  CalendarCheck,
  Shield,
  ChevronLeft,
  LogOut,
  Sun,
  Moon,
  Menu,
  X as XIcon,
  Mail,
  Lock,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import DashboardOverview from '../components/internal/DashboardOverview';
import TaskListView from '../components/internal/TaskListView';
import TaskDetailView from '../components/internal/TaskDetailView';
import GlobalChatView from '../components/internal/GlobalChatView';
import CRMCustomers from '../components/internal/CRMCustomers';
import CRMInvoices from '../components/internal/CRMInvoices';
import CRMAppointments from '../components/internal/CRMAppointments';
import CustomerProfile from '../components/internal/CustomerProfile';
import NewTaskModal from '../components/internal/NewTaskModal';
import Avatar from '../components/internal/Avatar';

// Zustand Stores
import { useAuthStore } from '../store/useAuthStore';
import { useTaskStore } from '../store/useTaskStore';
import { useChatStore } from '../store/useChatStore';
import { usePresenceStore } from '../store/usePresenceStore';

const InternalDashboard: React.FC = () => {
  const { session, isLoggingIn, loginError, login, logout } = useAuthStore();
  const { tasks, fetchTasksAndOperatives, createTask, setUnread, clearUnreads } = useTaskStore();
  const { setLastMessageTimestamp, unreads, setUnread: setChatUnread } = useChatStore();
  const { setTypingStatus } = usePresenceStore();

  const [isDark, setIsDark] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const activeView = (searchParams.get('view') as any) || 'dashboard';
  const activeTaskId = searchParams.get('task');

  useEffect(() => {
    if (activeTaskId) {
        clearUnreads(activeTaskId);
    }
  }, [activeTaskId, clearUnreads]);

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

  const setActiveView = (view: string) => {
      if (view === 'global-chat') setChatUnread('0', false);
      updateNavigation({ view, task: null, customer: null });
  };

  const setActiveTaskId = (id: string | null) => {
      if (id) {
          clearUnreads(id);
      }
      updateNavigation({ task: id });
  };

  const setSelectedCustomerId = (id: string | null) => updateNavigation({ customer: id });

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'dark';
    setIsDark(theme === 'dark');
    document.documentElement.classList.toggle('dark', theme === 'dark');

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
        setIsSidebarCollapsed(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (session) {
      fetchTasksAndOperatives(session.id);
      const eventSource = new EventSource('/api/internal/stream');
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'SYNC_TASKS') fetchTasksAndOperatives(session.id);
        if (data.type === 'CHAT_MSG') {
            setLastMessageTimestamp(Date.now());
            const room = data.room || '0';
            if (room === '0' && activeView !== 'global-chat') {
                setChatUnread('0', true);
            } else if (room !== '0' && room !== activeTaskId) {
                setUnread(room, true);
                setChatUnread('tasks', true);
            }
        }
        if (data.type === 'TYPING_STATUS') {
          setTypingStatus(data.room, data.userId, data.message ? data.userId : null);
        }
      };
      return () => eventSource.close();
    }
  }, [session, fetchTasksAndOperatives, activeTaskId, activeView, setLastMessageTimestamp, setChatUnread, setUnread, setTypingStatus]);

  const handleLoginFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (err) {
      // Error handled by store
    }
  };

  const toggleDarkMode = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  };

  const toggleSidebarCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const activeTask = useMemo(() => tasks.find(t => t.id === activeTaskId), [tasks, activeTaskId]);
  const hasUnreadTasks = useMemo(() => tasks.some(t => t.hasUnread), [tasks]);

  if (!session) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-[#06080D] transition-colors duration-500 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.05),transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }} />

        <div className="w-full max-w-md p-10 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-indigo-600 shadow-2xl shadow-indigo-600/20 mb-6 group">
              <Shield className="w-10 h-10 text-white transition-transform group-hover:scale-110" />
            </div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-2">Command Center</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-[0.3em]">Operational Protocol v4.0</p>
          </motion.div>

          <form onSubmit={handleLoginFormSubmit} className="space-y-6 relative z-10">
            <div className="space-y-4">
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-zinc-600 group-focus-within/input:text-indigo-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Operative Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-[#11161D] border border-zinc-800 text-white rounded-[1.5rem] placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 focus:border-indigo-600 transition-all text-sm font-medium"
                />
              </div>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-zinc-600 group-focus-within/input:text-indigo-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Access Code"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-[#11161D] border border-zinc-800 text-white rounded-[1.5rem] placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 focus:border-indigo-600 transition-all text-sm font-medium"
                />
              </div>
            </div>

            {loginError && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">{loginError}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 group/btn"
            >
              {isLoggingIn ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Initialize Session
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center relative z-10">
            <span className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest">Sovereign Node v4.0 • Authorized Access Only</span>
          </div>
        </div>
      </div>
    );
  }

  const effectiveCollapsed = isSidebarCollapsed && window.innerWidth >= 1024;

  const NavItem = ({ view, icon: Icon, label, roomKey, hasDot }: { view: string, icon: any, label: string, roomKey?: string, hasDot?: boolean }) => {
    const isActive = activeView === view;
    const isUnread = (roomKey && unreads[roomKey]) || (view === 'tasks' && hasUnreadTasks);
    return (
      <button
        onClick={() => setActiveView(view)}
        className={`w-full flex items-center ${effectiveCollapsed ? 'justify-center px-0' : 'px-5'} py-4 rounded-2xl transition-all relative ${
          isActive
            ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20'
            : isUnread
                ? 'bg-indigo-500/5 text-indigo-500 dark:text-indigo-400 border border-indigo-500/10'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-white/5'
        }`}
      >
        <div className="flex-shrink-0 relative">
            <Icon size={20} />
            {isUnread && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white dark:border-[#0B101A] animate-pulse" />}
        </div>
        {!effectiveCollapsed && <span className="text-sm whitespace-nowrap ml-4">{label}</span>}
      </button>
    );
  };

  return (
    <div style={{ zoom: 0.9 }} className="fixed inset-0 w-[111.11vw] h-[111.11vh] flex bg-white dark:bg-[#06080D] text-zinc-900 dark:text-zinc-300 font-sans overflow-hidden transition-colors duration-300">
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 lg:hidden"
            />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} className={`fixed inset-y-0 left-0 z-50 bg-zinc-50 dark:bg-[#0B101A] border-r border-zinc-200 dark:border-zinc-800/50 flex flex-col lg:relative lg:translate-x-0 transition-[width] duration-300 ease-in-out ${effectiveCollapsed ? "w-[84px]" : "w-[280px]"}`}>
              <div className={`flex flex-col gap-6 h-full overflow-hidden ${effectiveCollapsed ? "p-4" : "p-6"}`}>
                <div className={`flex items-center ${effectiveCollapsed ? "flex-col gap-4" : "justify-between"}`}>
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg"><Shield className="w-5 h-5 text-white" /></div>
                    {!effectiveCollapsed && <span className="font-bold text-zinc-900 dark:text-white uppercase">Operations</span>}
                  </div>
                  <div className={`flex items-center gap-1 ${effectiveCollapsed ? "flex-col" : ""}`}>
                      <button onClick={(e) => { e.stopPropagation(); toggleSidebarCollapse(); }} className="hidden lg:flex p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"><ChevronLeft size={20} className={effectiveCollapsed ? "rotate-180" : ""} /></button>
                      <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"><XIcon size={20} /></button>
                  </div>
                </div>
                <nav className="flex-1 space-y-2">
                  <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
                  <NavItem view="tasks" icon={ClipboardList} label="Tasks" />
                  <NavItem view="global-chat" icon={MessageSquare} label="Global Command" roomKey="0" />
                  <NavItem view="customers" icon={Users2} label="Customers" />
                  <NavItem view="invoices" icon={Receipt} label="Invoices" />
                  <NavItem view="appointments" icon={CalendarCheck} label="Appointments" />
                </nav>
                <div className="mt-auto pb-4">
                  <div className={`bg-zinc-200/50 dark:bg-[#11161D] border border-zinc-300/50 dark:border-zinc-800 flex flex-col shadow-2xl ${effectiveCollapsed ? "w-14 py-4 rounded-full items-center gap-4" : "w-full p-4 rounded-[2.5rem] gap-4"}`}>
                     <div className={`flex items-center gap-4 ${effectiveCollapsed ? "justify-center" : ""}`}><Avatar name={session.username} isOnline={true} />{!effectiveCollapsed && <div className="flex flex-col min-w-0"><span className="text-sm font-bold text-zinc-900 dark:text-white truncate">{session.username}</span><span className="text-[10px] text-zinc-500 uppercase font-bold">{session.role}</span></div>}</div>
                     <div className={`flex items-center justify-between ${effectiveCollapsed ? "flex-col gap-4" : "w-full pt-3 border-t border-zinc-200 dark:border-zinc-800/50"}`}><button onClick={toggleDarkMode} className="p-2 text-zinc-500 hover:text-indigo-600 transition-all">{isDark ? <Sun size={20} /> : <Moon size={20} />}</button><button onClick={logout} className="p-2 text-zinc-500 hover:text-red-600 transition-all"><LogOut size={20} /></button></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div onClick={() => { if (window.innerWidth < 1024) setIsSidebarOpen(false); else setIsSidebarCollapsed(true); }} className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {!isSidebarOpen && <button onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(true); }} className="absolute top-8 left-8 z-40 p-3 bg-white dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-500 lg:hidden shadow-lg"><Menu size={20} /></button>}
        <div className="flex-1 h-full overflow-hidden flex flex-col pt-24 lg:pt-0">
          {activeView === 'dashboard' && <DashboardOverview />}
          {activeView === 'global-chat' && <GlobalChatView onClose={() => setActiveView('dashboard')} />}
          {activeView === 'tasks' && (activeTask ? <TaskDetailView task={activeTask} onClose={() => setActiveTaskId(null)} /> : <TaskListView onSelectTask={setActiveTaskId} onCreateTask={() => setIsNewTaskModalOpen(true)} />)}
          {activeView === 'customers' && (selectedCustomerId ? <CustomerProfile customerId={selectedCustomerId} onBack={() => setSelectedCustomerId(null)} /> : <div className="flex-1 overflow-y-auto custom-scrollbar h-full bg-white dark:bg-[#0B101A] p-6 lg:p-10"><CRMCustomers onSelectCustomer={(c) => setSelectedCustomerId(c.id.toString())} /></div>)}
          {activeView === 'invoices' && <div className="flex-1 overflow-y-auto custom-scrollbar h-full bg-white dark:bg-[#0B101A] p-6 lg:p-10"><CRMInvoices /></div>}
          {activeView === 'appointments' && <div className="flex-1 overflow-y-auto custom-scrollbar h-full bg-white dark:bg-[#0B101A] p-6 lg:p-10"><CRMAppointments /></div>}
        </div>
      </div>
      <AnimatePresence>{isNewTaskModalOpen && <NewTaskModal onClose={() => setIsNewTaskModalOpen(false)} onSubmit={createTask} />}</AnimatePresence>
    </div>
  );
};

export default InternalDashboard;
