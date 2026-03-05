import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, AlignLeft, Shield, AlertCircle, Users } from 'lucide-react';

interface NewTaskModalProps {
  onClose: () => void;
  operatives: { id: number; username: string }[];
  onSubmit: (data: {
    title: string;
    description: string;
    due_date: string;
    priority: string;
    assigned_to: number | null;
  }) => void;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ onClose, operatives, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignedTo, setAssignedTo] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, description, due_date: dueDate, priority, assigned_to: assignedTo });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-[#11161D] border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-zinc-800/50 flex items-center justify-between bg-[#161B22]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Issue Command</h2>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Command Title</label>
            <input
              autoFocus
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full bg-[#161B22] border border-zinc-800 rounded-xl px-5 py-3.5 text-white placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Strategic Overview</label>
            <div className="relative">
              <AlignLeft className="absolute left-4 top-4 text-zinc-700" size={18} />
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more tactical details..."
                className="w-full bg-[#161B22] border border-zinc-800 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all resize-none font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Target Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
                <input
                  required
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-[#161B22] border border-zinc-800 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Priority</label>
              <div className="relative">
                <AlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-[#161B22] border border-zinc-800 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all appearance-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Primary Operative</label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
              <select
                value={assignedTo || ''}
                onChange={(e) => setAssignedTo(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full bg-[#161B22] border border-zinc-800 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all appearance-none"
              >
                <option value="">Unassigned</option>
                {operatives.map(op => <option key={op.id} value={op.id}>{op.username}</option>)}
              </select>
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-4 rounded-xl border border-zinc-800 text-zinc-500 font-bold text-xs hover:bg-white/5 transition-colors uppercase tracking-widest"
            >
              Abord Command
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-4 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 uppercase tracking-widest"
            >
              Deploy Directive
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default NewTaskModal;
