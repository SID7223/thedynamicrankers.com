import React, { useState } from 'react';
import { X as XIcon, Calendar, AlignLeft, Shield, AlertCircle, Users, Check } from 'lucide-react';
import Avatar from './Avatar';
import { motion, AnimatePresence } from 'framer-motion';

interface NewTaskModalProps {
  onClose: () => void;
  operatives: any[];
  onSubmit: (data: any) => void;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ onClose, operatives, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignees, setAssignees] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, priority, assignees, due_date: dueDate });
  };

  const toggleAssignee = (id: string) => {
    setAssignees(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-white/5">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20"><Shield className="text-white" size={24} /></div>
              <div>
                 <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight uppercase">Initialize Directive</h3>
                 <p className="text-xs text-zinc-500 font-medium">Deploy a new operational strategy.</p>
              </div>
           </div>
           <button onClick={onClose} className="p-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl transition-all shadow-sm"><XIcon size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
           <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] block mb-3">Directive Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter mission title..." className="w-full bg-zinc-50 dark:bg-[#161B22] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500/20 transition-all font-sans font-bold" />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] block mb-3">Briefing Description</label>
                <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="Strategic details and objectives..." className="w-full bg-zinc-50 dark:bg-[#161B22] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500/20 transition-all font-sans resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] block mb-3">Threat Level</label>
                    <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full bg-zinc-50 dark:bg-[#161B22] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold">
                       <option value="Low">Low Priority</option>
                       <option value="Medium">Medium Priority</option>
                       <option value="High">High Priority</option>
                    </select>
                 </div>
                 <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] block mb-3">Target Date</label>
                    <div className="relative">
                       <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                       <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full bg-zinc-50 dark:bg-[#161B22] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 pl-12 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold [color-scheme:light] dark:[color-scheme:dark]" />
                    </div>
                 </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] block mb-3">Assigned Operatives</label>
                <div className="flex flex-wrap gap-3">
                   {operatives.map(op => (
                     <button key={op.id} type="button" onClick={() => toggleAssignee(op.id)} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all ${assignees.includes(op.id) ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-indigo-500/30'}`}>
                        <Avatar name={op.username} size="xs" />
                        <span className="text-xs font-bold">{op.username}</span>
                        {assignees.includes(op.id) && <Check size={14} />}
                     </button>
                   ))}
                </div>
              </div>
           </div>

           <div className="flex gap-4 pt-4">
              <button type="button" onClick={onClose} className="flex-1 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-2xl font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all">Abort</button>
              <button type="submit" className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">Deploy Directive</button>
           </div>
        </form>
      </motion.div>
    </div>
  );
};

export default NewTaskModal;
