import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';

interface PresenceIndicatorProps {
  activeUsers: string[];
}

const PresenceIndicator: React.FC<PresenceIndicatorProps> = ({ activeUsers }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-8 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-16 right-0 w-48 bg-[#111827] border border-white/10 rounded-2xl shadow-2xl p-4 space-y-3"
          >
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2">
              Who's Online ({activeUsers.length})
            </h4>
            <div className="space-y-2">
              {activeUsers.map(user => (
                <div key={user} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-xs text-zinc-200 font-medium">{user}</span>
                  <span className="text-[10px] text-zinc-600 ml-auto">Active</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 rounded-full transition-all group"
      >
        <div className="relative">
          <Users size={16} className="text-indigo-400" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#06080D]" />
        </div>
        <span className="text-xs font-bold text-indigo-400 tracking-tight">
          {activeUsers.length} Online
        </span>
      </button>
    </div>
  );
};

export default PresenceIndicator;
