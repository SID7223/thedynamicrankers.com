import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  X as XIcon,
  ChevronDown,
  AlertCircle,
  Plus,
  Check,
  Share2,
  Archive,
  Circle,
  Clock,
  CheckCircle2,
  Edit2,
  Save,
  Undo2
} from 'lucide-react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
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

const TaskDetailView: React.FC<TaskDetailViewProps> = ({
  task,
  operatives,
  currentUser,
  onUpdate,
  onDelete,
  onClose,
  lastMessageTimestamp
}) => {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);
  const [leftWidth, setLeftWidth] = useState(60);
  const [isResizing, setIsResizing] = useState(false);

  // Edit state
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editDescriptionValue, setEditDescriptionValue] = useState(task?.description || '');

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

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.style.userSelect = "none";
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    document.body.style.userSelect = "auto";
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      if (newWidth > 20 && newWidth < 80) {
        setLeftWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  const toggleAssignee = (userId: string) => {
    const current = task?.assignees || [];
    const exists = current.find((a: any) => a.id === userId);
    let next;
    if (exists) {
      next = current.filter((a: any) => a.id !== userId).map((a: any) => a.id);
    } else {
      next = [...current.map((a: any) => a.id), userId];
    }
    onUpdate(task.id, { assignees: next });
  };

  const statusWorkflow = [
    { label: 'Backlog', value: 'backlog', color: 'text-zinc-500', icon: Circle },
    { label: 'To Do', value: 'todo', color: 'text-blue-500', icon: Circle },
    { label: 'In Progress', value: 'in_progress', color: 'text-indigo-500', icon: Clock },
    { label: 'In Review', value: 'review', color: 'text-purple-500', icon: AlertCircle },
    { label: 'Done', value: 'done', color: 'text-emerald-500', icon: CheckCircle2 },
  ];

  if (!task) return (
      <div className="flex-1 flex items-center justify-center bg-zinc-50 dark:bg-[#06080D]">
          <div className="text-center">
              <AlertCircle size={48} className="mx-auto text-zinc-300 mb-4" />
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Directive Context Lost</p>
          </div>
      </div>
  );

  const currentStatus = statusWorkflow.find(s => s.value === task.status) || statusWorkflow[1];
  const isCreator = currentUser?.id === task?.created_by;

  const handleSaveDescription = () => {
    onUpdate(task.id, { description: editDescriptionValue });
    setIsEditingDescription(false);
  };

  const handleCancelDescription = () => {
    setEditDescriptionValue(task?.description || '');
    setIsEditingDescription(false);
  };

  return (
    <motion.div
      ref={containerRef}
      style={{ x: isDesktop ? 0 : x, opacity: isDesktop ? 1 : opacity }}
      drag={isDesktop ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.x < -100) onClose();
      }}
      className="flex-1 flex flex-col lg:flex-row h-full bg-white dark:bg-[#06080D] overflow-hidden relative transition-colors duration-300"
    >
      {isResizing && <div className="fixed inset-0 z-[100] cursor-col-resize" />}

      <div ref={leftColRef} className="flex-1 flex flex-col min-h-0 border-r border-zinc-100 dark:border-zinc-800/50" style={isDesktop ? { width: `${leftWidth}%`, flexBasis: `${leftWidth}%` } : { width: '100%' }}>
        <header className="px-6 lg:px-10 py-6 border-b border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between shrink-0 bg-white/80 dark:bg-[#06080D]/80 backdrop-blur-xl z-20">
           <div className="flex items-center gap-4">
             <button onClick={onClose} className="p-2 -ml-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors lg:hidden"><XIcon size={20} /></button>
             <div className="flex flex-col">
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-1">{task.task_number}</span>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">{task.title}</h2>
             </div>
           </div>
           <div className="flex items-center gap-2">
             <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link Copied'); }} className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" title="Share Directive"><Share2 size={18} /></button>
             <button onClick={() => { if(confirm('Archive directive?')) onDelete(task.id); }} className="p-2 text-zinc-400 hover:text-red-500 transition-colors" title="Archive Strategy"><Archive size={18} /></button>
             <button onClick={onClose} className="hidden lg:flex p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"><XIcon size={20} /></button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 space-y-8">
           <section>
              <div className="flex items-center justify-between mb-4">
                 <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Briefing</h4>
                 {isCreator && !isEditingDescription && (
                    <button onClick={() => setIsEditingDescription(true)} className="p-2 text-zinc-400 hover:text-indigo-600 transition-colors group">
                       <Edit2 size={14} className="group-hover:scale-110 transition-transform" />
                    </button>
                 )}
              </div>

              {isEditingDescription ? (
                <div className="space-y-4">
                  <textarea
                    value={editDescriptionValue}
                    onChange={(e) => setEditDescriptionValue(e.target.value)}
                    className="w-full min-h-[200px] bg-zinc-50 dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 font-sans leading-relaxed transition-all"
                    placeholder="Wording, instructions, and mission objectives..."
                  />
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={handleCancelDescription} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                       <Undo2 size={14} /> Cancel
                    </button>
                    <button onClick={handleSaveDescription} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-600/20">
                       <Save size={14} /> Commit Changes
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans text-sm whitespace-pre-wrap">{task.description || 'No detailed briefing provided for this directive.'}</p>
              )}
           </section>

           <section>
              <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">Uplink Activity</h4>
              <div className="space-y-4">
                 <div className="flex gap-4 p-4 bg-zinc-50 dark:bg-white/5 rounded-2xl border border-zinc-100 dark:border-white/5">
                    <Avatar name={task.creator_name || 'S'} size="sm" />
                    <div>
                       <p className="text-xs text-zinc-600 dark:text-zinc-300"><span className="font-bold text-zinc-900 dark:text-white">{task.creator_name}</span> initialized this directive.</p>
                       <span className="text-[10px] text-zinc-400 mt-1 block">{task.created_at ? new Date(task.created_at).toLocaleString() : 'Date Unknown'}</span>
                    </div>
                 </div>
              </div>
           </section>
        </div>
      </div>

      <div
        onMouseDown={startResizing}
        className={`hidden lg:flex w-1 hover:w-1.5 bg-zinc-100 dark:bg-zinc-800/50 cursor-col-resize items-center justify-center transition-all group active:bg-indigo-500 ${isResizing ? 'bg-indigo-500' : ''}`}
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
