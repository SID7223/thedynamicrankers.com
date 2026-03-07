import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  X,
  Send,
  MoreVertical,
  Share2,
  Archive,
  ChevronDown,
  Circle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Check,
  Paperclip
} from 'lucide-react';
import SlackStream from './SlackStream';
import Avatar from './Avatar';

interface TaskDetailViewProps {
  task: any;
  operatives: any[];
  currentUser: any;
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  lastMessageTimestamp: number;
}

const statusWorkflow = [
  { value: 'backlog', label: 'Backlog', icon: Circle, color: 'text-zinc-400' },
  { value: 'todo', label: 'To Do', icon: Clock, color: 'text-blue-500' },
  { value: 'in_progress', label: 'In Progress', icon: Circle, color: 'text-amber-500' },
  { value: 'review', label: 'Review', icon: AlertCircle, color: 'text-purple-500' },
  { value: 'done', label: 'Completed', icon: CheckCircle2, color: 'text-emerald-500' }
];

const TaskDetailView: React.FC<TaskDetailViewProps> = ({
  task,
  operatives,
  currentUser,
  onUpdate,
  onDelete,
  onClose,
  lastMessageTimestamp
}) => {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const [leftWidth, setLeftWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const resizerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Swipe gesture for mobile
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0], [0, 1]);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isResizing) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      if (newWidth > 15 && newWidth < 85) setLeftWidth(newWidth);
    };
    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.userSelect = 'none';
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const currentStatus = statusWorkflow.find(s => s.value === task.status) || statusWorkflow[0];

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Directive Link Copied to Clipboard');
  };

  const toggleAssignee = (opId: string) => {
    const currentAssignees = task.assignees || [];
    const isAssigned = currentAssignees.some((a: any) => a.id === opId);
    let newAssignees;
    if (isAssigned) {
      newAssignees = currentAssignees.filter((a: any) => a.id !== opId).map((a: any) => a.id);
    } else {
      newAssignees = [...currentAssignees.map((a: any) => a.id), opId];
    }
    onUpdate(task.id, { assignees: newAssignees });
  };

  const closeAllPopovers = () => {
    setIsStatusOpen(false);
    setIsAssigneeOpen(false);
    setIsPriorityOpen(false);
    setIsMoreOpen(false);
  };

  const anyPopoverOpen = isStatusOpen || isAssigneeOpen || isPriorityOpen || isMoreOpen;

  return (
    <motion.div
      ref={containerRef}
      style={{ x, opacity }}
      drag={isDesktop ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.x < -100) onClose();
      }}
      className="flex-1 flex flex-col lg:flex-row h-full min-h-0 overflow-hidden bg-white dark:bg-[#06080D] transition-colors duration-300 relative"
    >
      {/* Popover Backdrop */}
      {anyPopoverOpen && (
        <div
          onClick={closeAllPopovers}
          className="fixed inset-0 z-40 bg-transparent"
        />
      )}

      {/* Left Column - Metadata & Assets */}
      <div ref={leftColRef} className="flex-none flex flex-col border-b lg:border-b-0 lg:border-r border-zinc-100 dark:border-zinc-800/50 lg:h-full lg:overflow-hidden" style={isDesktop ? { width: `${leftWidth}%`, flexBasis: `${leftWidth}%` } : { width: '100%' }}>
        {/* Header */}
        <div className="px-6 lg:px-8 py-6 border-b border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between bg-zinc-50/50 dark:bg-[#0B101A]/30">
          <div className="flex items-center gap-4">
             <button onClick={onClose} className="p-2 -ml-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors lg:hidden"><X size={20} /></button>
             <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                   <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">{task.task_number}</span>
                   <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                   <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Priority: {task.priority}</span>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-zinc-900 dark:text-white tracking-tight">{task.title}</h3>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <button onClick={handleShare} className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" title="Share Link"><Share2 size={18} /></button>
             <div className="relative">
                <button onClick={() => setIsMoreOpen(!isMoreOpen)} className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"><MoreVertical size={18} /></button>
                {isMoreOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                     <button onClick={() => { onDelete(task.id); setIsMoreOpen(false); }} className="w-full px-4 py-2.5 text-left text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2">
                        <Archive size={14} />
                        Terminate Directive
                     </button>
                  </div>
                )}
             </div>
             <button onClick={onClose} className="hidden lg:flex p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"><X size={20} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 space-y-8">
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <h4 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Target Status</h4>
                 <div className="relative">
                    <button onClick={() => setIsStatusOpen(!isStatusOpen)} className={`flex items-center justify-between gap-3 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all ${currentStatus.color}`}>
                      <span className="uppercase tracking-widest">{currentStatus.label}</span>
                      <ChevronDown size={14} className={`transition-transform ${isStatusOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isStatusOpen && (
                      <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                         {statusWorkflow.map((status) => (
                           <button key={status.value} onClick={() => { onUpdate(task.id, { status: status.value }); setIsStatusOpen(false); }} className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors ${status.value === task.status ? 'bg-indigo-50/50 dark:bg-indigo-500/10' : ''}`}>
                              <status.icon size={14} className={status.color} />
                              <span className={`text-xs font-bold uppercase tracking-widest ${status.value === task.status ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-600 dark:text-zinc-400'}`}>{status.label}</span>
                           </button>
                         ))}
                      </div>
                    )}
                 </div>
              </div>

              <div className="bg-zinc-50/50 dark:bg-white/5 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 lg:p-8">
                 <h4 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4">Strategic Mission</h4>
                 <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed font-sans">{task.description || 'No specific parameters defined for this mission.'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 lg:gap-6">
                 <div className="bg-white dark:bg-[#11161D] border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 lg:p-5">
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3 block">Tactical Lead</span>
                    <div className="flex items-center gap-3">
                       <Avatar name={task.creator_name} size="sm" />
                       <span className="text-sm font-bold text-zinc-900 dark:text-white">{task.creator_name}</span>
                    </div>
                 </div>
                 <div className="bg-white dark:bg-[#11161D] border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 lg:p-5 relative">
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3 block">Deploy To</span>
                    <div onClick={() => setIsAssigneeOpen(!isAssigneeOpen)} className="flex flex-wrap items-center gap-2 cursor-pointer group">
                       {(task.assignees || []).length > 0 ? (
                          task.assignees?.map((a: any) => <Avatar key={a.id} name={a.name} size="xs" />)
                       ) : (
                          <div className="w-8 h-8 rounded-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400"><Plus size={14} /></div>
                       )}
                       {isAssigneeOpen && (
                          <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                             {operatives.map(op => {
                                const isSelected = (task.assignees || []).some((a: any) => a.id === op.id);
                                return (
                                   <button key={op.id} onClick={() => toggleAssignee(op.id)} className="w-full px-4 py-2.5 text-left text-xs font-bold flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800">
                                      <span className={isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-600 dark:text-zinc-400'}>{op.username}</span>
                                      {isSelected && <Check size={14} className="text-indigo-600" />}
                                   </button>
                                );
                             })}
                          </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <h4 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">Mission Assets <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[8px]">0</span></h4>
                 <button className="text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-2 hover:opacity-80 transition-opacity"><Plus size={14} /> Attach</button>
              </div>
              <div className="p-8 border-2 border-dashed border-zinc-100 dark:border-zinc-800/50 rounded-3xl flex flex-col items-center justify-center text-center">
                 <Paperclip size={24} className="text-zinc-300 dark:text-zinc-700 mb-3" />
                 <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">No assets deployed.</p>
              </div>
           </div>
        </div>
      </div>

      {/* Resizer */}
      <div
        ref={resizerRef}
        onMouseDown={() => setIsResizing(true)}
        className="hidden lg:flex w-[10px] h-full cursor-col-resize items-center justify-center z-20 hover:scale-x-150 transition-transform group -mx-[5px]"
      >
        <div className="w-[1px] h-full bg-zinc-100 dark:bg-zinc-800/50 group-hover:bg-indigo-500/50 transition-colors" />
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
                     <button key={status.value} onClick={() => { onUpdate(task.id, { status: status.value }); setIsStatusOpen(false); }} className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors ${status.value === task.status ? 'bg-indigo-50/50 dark:bg-indigo-500/10' : ''}`}>
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
                         <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{task.creator_name || 'System'}</span>
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
                                        <span className={isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-600 dark:text-zinc-400'}>{op.username}</span>
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
                         <div onClick={() => setIsPriorityOpen(!isPriorityOpen)} className="flex items-center gap-2 p-1 -m-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-zinc-900 dark:text-zinc-100 font-bold">
                            <AlertCircle size={14} className={task.priority === 'High' ? 'text-red-500' : task.priority === 'Medium' ? 'text-amber-500' : 'text-blue-500'} />
                            <span className="text-sm">{task.priority}</span>
                         </div>
                         {isPriorityOpen && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                               {['High', 'Medium', 'Low'].map(p => (
                                  <button key={p} onClick={() => { onUpdate(task.id, { priority: p }); setIsPriorityOpen(false); }} className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800">
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
                            className="bg-transparent border-none p-0 text-sm font-bold text-zinc-900 dark:text-zinc-100 focus:ring-0 cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                            value={task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : ''}
                            onChange={(e) => onUpdate(task.id, { due_date: e.target.value })}
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
                 <SlackStream taskId={task.id} currentUser={currentUser} operatives={operatives} key={`stream-${task.id}-${lastMessageTimestamp}`} />
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskDetailView;
