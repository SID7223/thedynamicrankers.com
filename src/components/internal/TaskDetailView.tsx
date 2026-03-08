import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X as XIcon,
  MoreVertical,
  Paperclip,
  Share2,
  ChevronDown,
  Clock,
  Layout,
  User,
  AlertCircle,
  Check,
  Plus,
  Trash2,
  FileText,
  File,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './Avatar';
import SlackStream from './SlackStream';
import { useTaskStore } from '../../store/useTaskStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';

interface TaskDetailViewProps {
  task: any;
  onClose: () => void;
}

const TaskDetailView: React.FC<TaskDetailViewProps> = ({ task, onClose }) => {
  const { session: currentUser } = useAuthStore();
  const { operatives, updateTask, deleteTask } = useTaskStore();
  const { lastMessageTimestamp } = useChatStore();

  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  const [description, setDescription] = useState(task.description || '');
  const [isDragging, setIsDragging] = useState(false);
  const [leftWidth, setLeftWidth] = useState(50);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const newWidth = (e.clientX / containerWidth) * 100;
    if (newWidth >= 15 && newWidth <= 85) {
      setLeftWidth(newWidth);
      document.body.style.userSelect = "none";
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const toggleAssignee = async (userId: string) => {
    const currentAssignees = task.assignees || [];
    const isSelected = currentAssignees.some((a: any) => a.id === userId);
    const newAssignees = isSelected
      ? currentAssignees.filter((a: any) => a.id !== userId)
      : [...currentAssignees, operatives.find(op => op.id === userId)];

    try {
      await updateTask(task.id, { assignee_ids: newAssignees.map((a: any) => a.id) });
    } catch (err) {
      console.error('Update assignee failed:', err);
    }
  };

  const statusWorkflow = [
    { value: 'backlog', label: 'Backlog', icon: Clock, color: 'text-zinc-500' },
    { value: 'todo', label: 'Todo', icon: Clock, color: 'text-blue-500' },
    { value: 'in_progress', label: 'In Progress', icon: Activity, color: 'text-indigo-500' },
    { value: 'review', label: 'Review', icon: AlertCircle, color: 'text-purple-500' },
    { value: 'done', label: 'Done', icon: Check, color: 'text-emerald-500' }
  ];

  const currentStatus = statusWorkflow.find(s => s.value === task.status) || statusWorkflow[0];
  const canEditBriefing = currentUser.id === task.created_by;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-white dark:bg-[#06080D] relative" ref={containerRef}>
      {isDragging && <div className="fixed inset-0 z-[60] cursor-col-resize" />}

      <div ref={leftColRef} className="flex-none flex flex-col h-full border-r border-zinc-100 dark:border-zinc-800/50 overflow-y-auto custom-scrollbar" style={isDesktop ? { width: `${leftWidth}%`, flexBasis: `${leftWidth}%` } : { width: '100%' }}>
        <div className="p-6 lg:p-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{task.task_number}</span>
              </div>
              <Share2 size={16} className="text-zinc-400 cursor-pointer hover:text-indigo-500 transition-colors" />
            </div>
            <div className="flex items-center gap-2">
               <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  <XIcon size={20} />
               </button>
            </div>
          </div>

          <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-10 leading-[1.1]">{task.title}</h2>

          <div className="space-y-10">
             <div>
                <div className="flex items-center justify-between mb-4">
                   <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                     Directive Briefing
                     {canEditBriefing && <Edit2 size={12} className="text-zinc-400 hover:text-indigo-500 cursor-pointer" onClick={() => setIsDescriptionEditing(true)} />}
                   </h4>
                </div>
                {isDescriptionEditing ? (
                  <div className="space-y-4">
                     <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-indigo-500 rounded-2xl p-6 text-sm leading-relaxed min-h-[200px] focus:ring-0"
                     />
                     <div className="flex gap-3">
                        <button onClick={() => { updateTask(task.id, { description }); setIsDescriptionEditing(false); }} className="px-6 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl uppercase tracking-widest">Update</button>
                        <button onClick={() => { setIsDescriptionEditing(false); setDescription(task.description); }} className="px-6 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-xs font-bold rounded-xl uppercase tracking-widest">Cancel</button>
                     </div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium whitespace-pre-wrap">{task.description || 'No detailed briefing provided for this directive.'}</p>
                )}
             </div>

             <div>
                <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">Tactical Attachments</h4>
                <div className="grid grid-cols-2 gap-4">
                   {(task.attachments || []).map((at: any, i: number) => (
                     <div key={i} className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 group hover:border-indigo-500/30 transition-all cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-black/20 flex items-center justify-center text-zinc-400 group-hover:text-indigo-500"><File size={18} /></div>
                        <div className="flex-1 min-w-0">
                           <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate">{at.file_name}</p>
                           <p className="text-[10px] font-bold text-zinc-400 uppercase">{(at.file_size / 1024).toFixed(1)} KB</p>
                        </div>
                        <Download size={14} className="text-zinc-300 group-hover:text-zinc-500" />
                     </div>
                   ))}
                   <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl hover:border-indigo-500/30 transition-all cursor-pointer group">
                      <Plus size={24} className="text-zinc-300 group-hover:text-indigo-500 mb-2" />
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Upload Intel</span>
                      <input type="file" className="hidden" />
                   </label>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div
        className="hidden lg:flex w-2.5 h-full hover:bg-indigo-500/10 cursor-col-resize items-center justify-center group relative z-50 flex-none"
        onMouseDown={(e) => { e.preventDefault(); setIsDragging(true); }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 w-1.5 h-16 bg-indigo-500/50 dark:bg-indigo-500/30 rounded-full group-hover:bg-indigo-600 transition-all flex flex-col items-center justify-center gap-1">
           <div className="w-0.5 h-0.5 rounded-full bg-white/40" />
           <div className="w-0.5 h-0.5 rounded-full bg-white/40" />
           <div className="w-0.5 h-0.5 rounded-full bg-white/40" />
        </div>
      </div>

      <div ref={rightColRef} className="flex-none flex flex-col bg-zinc-50/20 dark:bg-[#06080D]/40 backdrop-blur-sm lg:h-full lg:overflow-hidden" style={isDesktop ? { width: `${100 - leftWidth}%`, flexBasis: `${100 - leftWidth}%` } : { width: '100%' }}>
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800/50">
           <div className="relative">
              <button onClick={() => setIsStatusOpen(!isStatusOpen)} className={`flex items-center justify-between gap-3 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all ${currentStatus.color}`}>
                <span className="uppercase tracking-widest">{currentStatus.label}</span>
                <ChevronDown size={14} className={`transition-transform ${isStatusOpen ? 'rotate-180' : ''}`} />
              </button>
              {isStatusOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                   {statusWorkflow.map((status) => (
                     <button key={status.value} onClick={() => { updateTask(task.id, { status: status.value }); setIsStatusOpen(false); }} className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors ${status.value === task.status ? 'bg-indigo-50/50 dark:bg-indigo-500/10' : ''}`}>
                        <status.icon size={14} className={status.color} />
                        <span className={`text-xs font-bold uppercase tracking-widest ${status.value === task.status ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-600 dark:text-zinc-400'}`}>{status.label}</span>
                     </button>
                   ))}
                </div>
              )}
           </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
           <div className="border-b border-zinc-100 dark:border-zinc-800/50">
              <button onClick={() => setIsDetailsExpanded(!isDetailsExpanded)} className="w-full px-6 py-4 flex items-center justify-between group">
                 <div className="flex items-center gap-2">
                    <ChevronDown size={16} className={`text-zinc-400 transition-transform ${!isDetailsExpanded ? '-rotate-90' : ''}`} />
                    <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Details</h4>
                 </div>
              </button>
              {isDetailsExpanded && (
                <div className="px-6 pb-8 space-y-6">
                   {/* Assigned By */}
                   <div className="grid grid-cols-12 items-start gap-4">
                      <label className="col-span-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-1">Assigned by</label>
                      <div className="col-span-8 flex items-center gap-2">
                         <Avatar name={task.creator_name || 'System'} size="xs" />
                         <span className="text-sm font-bold text-zinc-900 dark:text-white">{task.creator_name || 'System'}</span>
                      </div>
                   </div>

                   {/* Assignee */}
                   <div className="grid grid-cols-12 items-start gap-4">
                      <label className="col-span-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-1">Assignee</label>
                      <div className="col-span-8 relative">
                         <div onClick={() => setIsAssigneeOpen(!isAssigneeOpen)} className="flex flex-wrap items-center gap-2 group/field cursor-pointer p-1 -m-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                            {(task.assignees || []).length > 0 ? (
                               task.assignees?.map((a: any) => <Avatar key={a.id} name={a.name} size="xs" />)
                            ) : (
                               <Avatar name="?" size="xs" />
                            )}
                            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                               {(task.assignees || []).length > 0 ? task.assignees?.map((a: any) => a.name).join(', ') : 'Unassigned'}
                            </span>
                            <Plus size={12} className="text-zinc-400" />
                         </div>
                         {isAssigneeOpen && (
                            <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                               {operatives.map(op => {
                                  const isSelected = (task.assignees || []).some((a: any) => a.id === op.id);
                                  return (
                                     <button key={op.id} onClick={() => toggleAssignee(op.id)} className="w-full px-4 py-2.5 text-left text-xs font-bold flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800">
                                        <span className={isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-600 dark:text-zinc-400'}>{op.name}</span>
                                        {isSelected && <Check size={14} className="text-indigo-600" />}
                                     </button>
                                  );
                               })}
                            </div>
                         )}
                      </div>
                   </div>

                   {/* Priority */}
                   <div className="grid grid-cols-12 items-start gap-4">
                      <label className="col-span-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-1">Priority</label>
                      <div className="col-span-8 relative">
                         <div onClick={() => setIsPriorityOpen(!isPriorityOpen)} className="flex items-center gap-2 p-1 -m-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-zinc-900 dark:text-white font-bold">
                            <AlertCircle size={14} className={task.priority === 'High' ? 'text-red-500' : task.priority === 'Medium' ? 'text-amber-500' : 'text-blue-500'} />
                            <span className="text-sm">{task.priority}</span>
                         </div>
                         {isPriorityOpen && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                               {['High', 'Medium', 'Low'].map(p => (
                                  <button key={p} onClick={() => { updateTask(task.id, { priority: p }); setIsPriorityOpen(false); }} className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                                     {p}
                                  </button>
                               ))}
                            </div>
                         )}
                      </div>
                   </div>

                   {/* Due Date */}
                   <div className="grid grid-cols-12 items-start gap-4">
                      <label className="col-span-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-1">Due date</label>
                      <div className="col-span-8">
                         <input
                            type="date"
                            className="bg-transparent border-none p-0 text-sm font-bold text-zinc-900 dark:text-white focus:ring-0 cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                            value={task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : ''}
                            onChange={(e) => updateTask(task.id, { due_date: e.target.value })}
                         />
                      </div>
                   </div>

                   {/* Labels */}
                   <div className="grid grid-cols-12 items-start gap-4">
                      <label className="col-span-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-1">Labels</label>
                      <div className="col-span-8"><div className="flex flex-wrap gap-1.5"><span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-400 rounded">STRATEGY</span></div></div>
                   </div>
                </div>
              )}
           </div>

           <div className="flex flex-col h-[600px] lg:h-full border-b border-zinc-100 dark:border-zinc-800/50">
              <div className="px-6 py-4 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/20">
                 <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">Strategic Comms <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /></h4>
              </div>
              <div className="flex-1 min-h-[400px] bg-white dark:bg-[#06080D]">
                 <SlackStream taskId={task.id} lastMessageTimestamp={lastMessageTimestamp} />
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskDetailView;
