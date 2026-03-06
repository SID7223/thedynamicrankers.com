import React, { useState, useEffect } from 'react';
import {
  Users,
  ChevronLeft,
  UserPlus,
  UserMinus,
  ShieldAlert,
  X,
  Plus
} from 'lucide-react';
import SlackStream from './SlackStream';
import Avatar from './Avatar';
import { motion, AnimatePresence } from 'framer-motion';

interface GlobalChatViewProps {
  currentUser: any;
  operatives: any[];
  onClose: () => void;
  lastMessageTimestamp: number;
}

const GlobalChatView: React.FC<GlobalChatViewProps> = ({
  currentUser,
  operatives,
  onClose,
  lastMessageTimestamp
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  const isAdmin = ['admin', 'superuser'].includes(currentUser.role);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/internal/room_members?roomId=global-room');
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (err) {
      console.error('Fetch Members Failed:', err);
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddMember = async (userId: string) => {
    try {
      await fetch('/api/internal/room_members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: 'global-room', userId })
      });
      fetchMembers();
    } catch (err) {
      console.error('Add Member Failed:', err);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!isAdmin) {
      alert('Removal request sent to admin.');
      return;
    }
    if (!confirm('Are you sure you want to kick this operative from the global comm?')) return;

    try {
      await fetch(`/api/internal/room_members?roomId=global-room&userId=${userId}`, {
        method: 'DELETE'
      });
      fetchMembers();
    } catch (err) {
      console.error('Remove Member Failed:', err);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#06080D] overflow-hidden relative transition-colors duration-300">
      {/* Header */}
      <header className="px-6 lg:px-10 py-6 border-b border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between bg-white/80 dark:bg-[#06080D]/80 backdrop-blur-xl shrink-0 z-20">
        <div className="flex items-center gap-6">
          <button
            onClick={onClose}
            className="p-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight uppercase cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => setIsSidebarOpen(true)}>Global Comm</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Active Operatives: {members.length}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-3 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-500/20 hover:bg-indigo-600/20 transition-all flex items-center gap-2"
        >
          <Users size={20} />
          <span className="text-xs font-bold uppercase tracking-widest hidden md:inline">Operatives</span>
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <SlackStream
          taskId="0"
          currentUser={currentUser}
          operatives={operatives}
          key={`global-stream-${lastMessageTimestamp}`}
        />
      </div>

      {/* Left Sidebar - Member Management (Overlay) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 h-full w-full max-w-sm bg-white dark:bg-[#0B101A] border-r border-zinc-200 dark:border-zinc-800 z-40 flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-tight">Comm Registry</h3>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-10">
                {/* Active Members */}
                <section>
                  <h4 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-6 font-sans">Current Linkage</h4>
                  <div className="space-y-4">
                    {members.map(member => (
                      <div key={member.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <Avatar name={member.name} size="sm" />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-zinc-900 dark:text-white">{member.name}</span>
                            <span className="text-[10px] text-zinc-500 uppercase font-bold">{member.role}</span>
                          </div>
                        </div>
                        {member.id !== currentUser.id && (
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="p-2 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title={isAdmin ? "Kick Operative" : "Request Removal"}
                          >
                            {isAdmin ? <UserMinus size={18} /> : <ShieldAlert size={18} />}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Available Operatives */}
                <section>
                  <h4 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-6 font-sans">Available Uplinks</h4>
                  <div className="space-y-4">
                    {operatives.filter(op => !members.find(m => m.id === op.id)).map(op => (
                      <div key={op.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar name={op.username} size="sm" />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-zinc-900 dark:text-white">{op.username}</span>
                            <span className="text-[10px] text-zinc-500 uppercase font-bold">{op.role}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddMember(op.id)}
                          className="p-2 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-600/20 transition-all border border-indigo-500/10"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalChatView;
