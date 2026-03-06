import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  X,
  Trash2,
  Edit2,
  Check,
  Users,
  Calendar,
  AlertCircle,
  Clock,
  ChevronLeft,
  Circle,
  PlayCircle,
  Eye,
  CheckCircle2,
  ChevronDown,
  MoreHorizontal,
  ChevronRight,
  Paperclip,
  Share2,
  Eye as EyeIcon,
  Plus,
  Shield,
  LayoutDashboard,
  MessageSquare,
  Users2,
  Receipt,
  CalendarCheck,
  LogOut,
  Sun,
  Moon,
  Menu
} from 'lucide-react';
import Avatar from './Avatar';
import SlackStream from './SlackStream';

interface Task {
  id: string;
  task_number: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assigned_to: string | null;
  assigned_name?: string;
  due_date: string | null;
  created_at: string;
}

interface TaskDetailViewProps {
  task: Task;
  operatives: any[];
  currentUser: any;
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  lastMessageTimestamp: number;
  isGlobal?: boolean;
}

const TaskDetailView: React.FC<TaskDetailViewProps> = ({
  task,
  operatives,
  currentUser,
  onUpdate,
  onDelete,
  onClose,
  lastMessageTimestamp,
  isGlobal = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editBuffer, setEditBuffer] = useState({...task});
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);

  // Resizable state
  const [leftWidth, setLeftWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current || !leftColRef.current || !rightColRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

    // Constrain between 15% and 85%
    if (newLeftWidth >= 15 && newLeftWidth <= 85) {
      const roundedWidth = Math.round(newLeftWidth * 100) / 100;

      // Update DOM directly for max performance
      leftColRef.current.style.width = `${roundedWidth}%`;
      leftColRef.current.style.flexBasis = `${roundedWidth}%`;
      rightColRef.current.style.width = `${100 - roundedWidth}%`;
      rightColRef.current.style.flexBasis = `${100 - roundedWidth}%`;

      // Also update state for persistence on re-renders
      setLeftWidth(roundedWidth);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove, handleMouseUp]);

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [handleMouseMove, handleMouseUp]);

  const statusWorkflow = [
    { value: 'backlog', label: 'Backlog', icon: Circle, color: 'text-zinc-500', bg: 'bg-zinc-100 dark:bg-zinc-800' },
    { value: 'todo', label: 'To Do', icon: Circle, color: 'text-zinc-500', bg: 'bg-zinc-100 dark:bg-zinc-800' },
    { value: 'in_progress', label: 'In Progress', icon: PlayCircle, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { value: 'review', label: 'In Review', icon: Eye, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    { value: 'done', label: 'Done', icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' }
  ];

  const currentStatus = statusWorkflow.find(s => s.value === task.status) || statusWorkflow[0];

  const handleSave = () => {
    onUpdate(task.id, editBuffer);
    setIsEditing(false);
  };

  if (isGlobal) {
    return (
      <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#06080D]">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-tight">Global Command Center</h2>
        </div>
        <div className="flex-1 overflow-hidden">
           <SlackStream taskId="0" currentUser={currentUser} operatives={operatives} key="global-stream" />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-white dark:bg-[#0B101A] relative">

      {/* Resizing Overlay (to catch mouse events over iframes/complex components) */}
      {isResizing && (
        <div className="fixed inset-0 z-[100] cursor-col-resize bg-transparent" />
      )}

      {/* Left Column: Task Content (Main) */}
      <div
        ref={leftColRef}
        className="flex-none overflow-y-auto custom-scrollbar"
        style={{ width: `${leftWidth}%`, flexBasis: `${leftWidth}%` }}
      >
        <div className="p-6 lg:p-10 max-w-6xl mx-auto">

          {/* Top Header Navigation */}
          <div className="flex items-center justify-between mb-10">
            <nav className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2 text-zinc-500 hover:text-indigo-600 cursor-pointer transition-colors" onClick={onClose}>
                <span className="font-medium">Directives</span>
              </div>
              <ChevronRight size={14} className="text-zinc-300" />
              <div className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                {task.task_number || `DIR-${task.id.slice(0, 4).toUpperCase()}`}
              </div>
            </nav>

            <div className="flex items-center gap-2">
              <button className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"><Share2 size={18} /></button>
              <button className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"><MoreHorizontal size={18} /></button>
              <button onClick={onClose} className="p-2 text-zinc-400 hover:text-red-500 transition-colors ml-2"><X size={20} /></button>
            </div>
          </div>

          {/* Title Area */}
          <div className="mb-10">
            {isEditing ? (
              <input
                autoFocus
                type="text"
                value={editBuffer.title}
                onChange={(e) => setEditBuffer({ ...editBuffer, title: e.target.value })}
                className="text-4xl lg:text-5xl font-black text-zinc-900 dark:text-white bg-transparent border-b-2 border-indigo-500 focus:outline-none w-full pb-2"
              />
            ) : (
              <div className="group relative">
                <h1 className="text-4xl lg:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-4 leading-none">
                  {task.title}
                </h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute -right-10 top-2 p-2 text-zinc-300 opacity-0 group-hover:opacity-100 transition-all hover:text-indigo-500"
                >
                  <Edit2 size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Description Area */}
          <div className="space-y-6 mb-12">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">Description</h3>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase hover:underline">Edit</button>
              )}
            </div>
            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={editBuffer.description || ''}
                  onChange={(e) => setEditBuffer({ ...editBuffer, description: e.target.value })}
                  className="w-full min-h-[200px] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-lg leading-relaxed"
                  placeholder="Describe the directive objectives..."
                />
                <div className="flex justify-end gap-3">
                   <button onClick={() => setIsEditing(false)} className="px-5 py-2 text-xs font-bold text-zinc-500 uppercase">Cancel</button>
                   <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Check size={14} /> Save</button>
                </div>
              </div>
            ) : (
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                {task.description || 'No description provided for this directive.'}
              </p>
            )}
          </div>

          {/* Attachments Placeholder (Jira Style) */}
          <div className="space-y-6 border-t border-zinc-100 dark:border-zinc-800/50 pt-10">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                 Attachments
                 <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] text-zinc-500">0</span>
              </h3>
              <button className="p-1.5 text-zinc-400 hover:text-indigo-600 transition-colors"><Plus size={18} /></button>
            </div>
            <div className="border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-2xl p-10 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-indigo-500/30 transition-all">
                <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Paperclip className="w-6 h-6 text-zinc-400" />
                </div>
                <p className="text-sm font-medium text-zinc-500">Drop files here to attach, or <span className="text-indigo-600 dark:text-indigo-400">browse</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Draggable Divider (Styled exactly like image.png) */}
      <div
        onMouseDown={handleMouseDown}
        className="hidden lg:flex w-4 h-full -mx-2 cursor-col-resize group items-center justify-center relative z-50 hover:bg-indigo-500/10 transition-colors"
      >
        <div className="w-[1px] h-full bg-zinc-100 dark:bg-zinc-800/50 group-hover:bg-indigo-500/50 transition-colors" />
        <div className="absolute top-1/2 -translate-y-1/2 w-1.5 h-16 bg-indigo-500/50 dark:bg-indigo-500/30 rounded-full group-hover:bg-indigo-600 transition-all flex flex-col items-center justify-center gap-1">
           <div className="w-0.5 h-0.5 rounded-full bg-white/40" />
           <div className="w-0.5 h-0.5 rounded-full bg-white/40" />
           <div className="w-0.5 h-0.5 rounded-full bg-white/40" />
        </div>
      </div>

      {/* Right Column: Metadata & Comms (Aside) */}
      <div
        ref={rightColRef}
        className="flex-none border-l border-zinc-100 dark:border-zinc-800/50 flex flex-col bg-zinc-50/20 dark:bg-[#06080D]/40 backdrop-blur-sm"
        style={{ width: `${100 - leftWidth}%`, flexBasis: `${100 - leftWidth}%` }}
      >

        {/* Status Dropdown (Jira Style) */}
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800/50">
           <div className="relative">
              <button
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                className={`flex items-center justify-between gap-3 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all ${currentStatus.color}`}
              >
                <span className="uppercase tracking-widest">{currentStatus.label}</span>
                <ChevronDown size={14} className={`transition-transform ${isStatusOpen ? 'rotate-180' : ''}`} />
              </button>

              {isStatusOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                   {statusWorkflow.map((status) => (
                     <button
                        key={status.value}
                        onClick={() => {
                          onUpdate(task.id, { status: status.value });
                          setIsStatusOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors ${status.value === task.status ? 'bg-indigo-50/50 dark:bg-indigo-500/10' : ''}`}
                     >
                        <status.icon size={14} className={status.color} />
                        <span className={`text-xs font-bold uppercase tracking-widest ${status.value === task.status ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-600 dark:text-zinc-400'}`}>
                          {status.label}
                        </span>
                     </button>
                   ))}
                </div>
              )}
           </div>
        </div>

        {/* Details & Metadata Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">

           {/* Details Accordion */}
           <div className="border-b border-zinc-100 dark:border-zinc-800/50">
              <button
                onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between group"
              >
                 <div className="flex items-center gap-2">
                    <ChevronDown size={16} className={`text-zinc-400 transition-transform ${!isDetailsExpanded ? '-rotate-90' : ''}`} />
                    <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Details</h4>
                 </div>
              </button>

              {isDetailsExpanded && (
                <div className="px-6 pb-8 space-y-6">
                   {/* Assignee Row */}
                   <div className="grid grid-cols-12 items-start gap-4">
                      <label className="col-span-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-1">Assignee</label>
                      <div className="col-span-8">
                         <div className="flex items-center gap-3 group/field cursor-pointer p-1 -m-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                            <Avatar name={task.assigned_name || '?'} size="xs" />
                            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{task.assigned_name || 'Unassigned'}</span>
                         </div>
                      </div>
                   </div>

                   {/* Priority Row */}
                   <div className="grid grid-cols-12 items-start gap-4">
                      <label className="col-span-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-1">Priority</label>
                      <div className="col-span-8">
                         <div className="flex items-center gap-2 p-1 -m-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-zinc-900 dark:text-zinc-100 font-bold">
                            <AlertCircle size={14} className={task.priority === 'High' ? 'text-red-500' : task.priority === 'Medium' ? 'text-amber-500' : 'text-blue-500'} />
                            <span className="text-sm">{task.priority}</span>
                         </div>
                      </div>
                   </div>

                   {/* Due Date Row */}
                   <div className="grid grid-cols-12 items-start gap-4">
                      <label className="col-span-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-1">Due date</label>
                      <div className="col-span-8">
                         <div className="p-1 -m-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            {task.due_date ? new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'None'}
                         </div>
                      </div>
                   </div>

                   {/* Labels Placeholder */}
                   <div className="grid grid-cols-12 items-start gap-4">
                      <label className="col-span-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-1">Labels</label>
                      <div className="col-span-8">
                         <div className="flex flex-wrap gap-1.5 p-1 -m-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                            <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-400 rounded">STRATEGY</span>
                            <span className="text-zinc-300 text-[10px] font-bold uppercase tracking-wider">None</span>
                         </div>
                      </div>
                   </div>

                   {/* Strategic Birth */}
                   <div className="grid grid-cols-12 items-start gap-4">
                      <label className="col-span-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-1">Birth</label>
                      <div className="col-span-8 text-sm font-bold text-zinc-400 px-1">
                        {new Date(task.created_at).toLocaleDateString()}
                      </div>
                   </div>
                </div>
              )}
           </div>

           {/* Comms (Thread) Section - Integrated into Sidebar */}
           <div className="flex flex-col h-[600px] border-b border-zinc-100 dark:border-zinc-800/50">
              <div className="px-6 py-4 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/20">
                 <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    Strategic Comms
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 </h4>
                 <div className="flex items-center gap-2">
                   <Users size={14} className="text-zinc-400" />
                   <span className="text-[10px] font-bold text-zinc-400 uppercase">Live</span>
                 </div>
              </div>
              <div className="flex-1 min-h-0 bg-white dark:bg-[#06080D]">
                 <SlackStream
                    taskId={task.id}
                    currentUser={currentUser}
                    operatives={operatives}
                    key={`stream-${task.id}-${lastMessageTimestamp}`}
                 />
              </div>
           </div>

           {/* Danger Zone */}
           <div className="p-8">
              <button
                onClick={() => { if(confirm('Delete directive?')) onDelete(task.id); }}
                className="w-full py-3 flex items-center justify-center gap-2 text-zinc-400 hover:text-red-500 transition-all text-xs font-bold uppercase tracking-widest border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-red-500/50"
              >
                 <Trash2 size={14} />
                 Archive Directive
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailView;
