import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Save,

  Calendar,
  Clock,
  AlertCircle,
  Users,
  CheckCircle2,
  PlayCircle,

  Archive,
  Layout
} from 'lucide-react';
import Avatar from './Avatar';
import SlackStream from './SlackStream';

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assigned_to: number | null;
  assigned_name?: string;
  due_date: string | null;
  created_at: string;
  created_by: number;
}

interface User {
  id: number;
  username: string;
  role: string;
}

interface TaskDetailViewProps {
  task: Task;
  operatives: User[];
  currentUser: User;
  onUpdate: (id: number, data: Partial<Task>) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
  lastMessageTimestamp: string;
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
  const [isEditing, setIsEditing] = useState(false);
  const [editBuffer, setEditBuffer] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    assigned_to: task.assigned_to,
    due_date: task.due_date || ''
  });

  useEffect(() => {
    setEditBuffer({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      assigned_to: task.assigned_to,
      due_date: task.due_date || ''
    });
  }, [task]);

  const handleSave = () => {
    onUpdate(task.id, editBuffer);
    setIsEditing(false);
  };

  const statusWorkflow = [
    { label: 'Backlog', value: 'backlog' },
    { label: 'To Do', value: 'todo' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Review', value: 'review' },
    { label: 'Done', value: 'done' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle2 size={16} />;
      case 'review': return <Layout size={16} />;
      case 'in_progress': return <PlayCircle size={16} />;
      case 'todo': return <Clock size={16} />;
      case 'backlog': return <Archive size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-white dark:bg-[#06080D] transition-colors duration-300">
      {/* Left Column: Details */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar border-r border-zinc-200 dark:border-zinc-800/50">
        {/* Header */}
        <div className="p-6 lg:p-10 border-b border-zinc-100 dark:border-zinc-800/30 bg-white/80 dark:bg-[#11161D]/50 backdrop-blur-md sticky top-0 z-10 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <button onClick={onClose} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-widest">Back to Ledger</span>
            </button>
            <div className="flex items-center gap-3">
              {currentUser.id === task.created_by && (
                <>
                  {isEditing ? (
                    <button onClick={handleSave} className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-all"><Save size={18} /></button>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="p-2.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-xl hover:bg-indigo-500/20 transition-all"><Edit2 size={18} /></button>
                  )}
                  <button onClick={() => onDelete(task.id)} className="p-2.5 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all"><Trash2 size={18} /></button>
                </>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800/50 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700/50">DIRECTIVE-{task.id.toString().padStart(3, '0')}</span>
              <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                {getStatusIcon(task.status)}
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{task.status.replace('_', ' ')}</span>
              </div>
            </div>
            {isEditing ? (
              <input
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 text-2xl font-bold text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                value={editBuffer.title}
                onChange={e => setEditBuffer({...editBuffer, title: e.target.value})}
              />
            ) : (
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight leading-tight">{task.title}</h1>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-10 space-y-12 pb-24">
          <section>
            <h3 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4">Description</h3>
            {isEditing ? (
              <textarea
                rows={6}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-zinc-800 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none font-sans"
                value={editBuffer.description}
                onChange={e => setEditBuffer({...editBuffer, description: e.target.value})}
              />
            ) : (
              <p className="text-zinc-700 dark:text-zinc-300 text-lg leading-relaxed font-sans font-medium whitespace-pre-wrap">{task.description || 'No strategic overview provided.'}</p>
            )}
          </section>

          <section className="bg-zinc-50 dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800/50 rounded-3xl p-8">
            <h3 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-8">Metadata & Intelligence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-white dark:bg-zinc-800/80 rounded-2xl flex items-center justify-center border border-zinc-200 dark:border-zinc-700/30 shadow-sm dark:shadow-xl"><Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] font-bold mb-1 font-sans">Assignee</span>
                  {isEditing ? (
                    <select value={editBuffer.assigned_to || ''} onChange={(e) => setEditBuffer({...editBuffer, assigned_to: e.target.value ? parseInt(e.target.value) : null})} className="bg-transparent text-zinc-900 dark:text-zinc-100 text-sm font-bold font-sans outline-none">
                      <option value="" className="bg-white dark:bg-zinc-900 text-zinc-500">Unassigned</option>
                      {operatives.map(op => <option key={op.id} value={op.id} className="bg-white dark:bg-zinc-900">{op.username}</option>)}
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Avatar name={task.assigned_name || '?'} size="xs" />
                      <span className="text-zinc-900 dark:text-zinc-100 text-sm font-bold font-sans">{task.assigned_name || 'Unassigned'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-white dark:bg-zinc-800/80 rounded-2xl flex items-center justify-center border border-zinc-200 dark:border-zinc-700/30 shadow-sm dark:shadow-xl"><Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] font-bold mb-1 font-sans">Target Date</span>
                  {isEditing ? (
                    <input
                      type="date"
                      className="bg-transparent text-zinc-900 dark:text-zinc-100 text-sm font-bold font-sans outline-none [color-scheme:light] dark:[color-scheme:dark]"
                      value={editBuffer.due_date}
                      onChange={e => setEditBuffer({...editBuffer, due_date: e.target.value})}
                    />
                  ) : (
                    <span className="text-zinc-900 dark:text-zinc-100 text-sm font-bold font-sans">{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'TBD'}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-white dark:bg-zinc-800/80 rounded-2xl flex items-center justify-center border border-zinc-200 dark:border-zinc-700/30 shadow-sm dark:shadow-xl"><AlertCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] font-bold mb-1 font-sans">Priority</span>
                  {isEditing ? (
                    <select value={editBuffer.priority} onChange={(e) => setEditBuffer({...editBuffer, priority: e.target.value})} className="bg-transparent text-zinc-900 dark:text-zinc-100 text-sm font-bold font-sans outline-none">
                      <option value="Low" className="bg-white dark:bg-zinc-900">Low Priority</option>
                      <option value="Medium" className="bg-white dark:bg-zinc-900">Medium Priority</option>
                      <option value="High" className="bg-white dark:bg-zinc-900">High Priority</option>
                    </select>
                  ) : (
                    <span className="text-zinc-900 dark:text-zinc-100 text-sm font-bold font-sans uppercase tracking-widest">{task.priority} Priority</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-white dark:bg-zinc-800/80 rounded-2xl flex items-center justify-center border border-zinc-200 dark:border-zinc-700/30 shadow-sm dark:shadow-xl"><Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] font-bold mb-1 font-sans">Strategic Birth</span>
                  <span className="text-zinc-900 dark:text-zinc-100 text-sm font-bold font-sans">{new Date(task.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </section>

          <section>
             <h3 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-8">Status Evolution</h3>
             <div className="flex flex-wrap gap-4">
               {statusWorkflow.map((status) => (
                 <button
                  key={status.value}
                  onClick={() => onUpdate(task.id, { status: status.value })}
                  className={`px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border flex items-center gap-3 ${
                    task.status === status.value
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-zinc-100 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-500 hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                  }`}
                 >
                   {getStatusIcon(status.value)}
                   {status.label}
                 </button>
               ))}
             </div>
          </section>
        </div>
      </div>

      {/* Comment Stream */}
      <div className="w-full lg:w-[450px] bg-white dark:bg-[#06080D] flex flex-col h-full lg:h-[calc(100vh-0px)] overflow-hidden lg:sticky lg:top-0 transition-colors duration-300">
         <div className="p-6 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/80 dark:bg-[#0B101A]/80 backdrop-blur-xl flex items-center justify-between">
           <h3 className="text-[11px] font-bold text-zinc-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-3">
             Strategic Comms
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           </h3>
         </div>
         <div className="flex-1 flex flex-col min-h-0">
           <SlackStream taskId={task.id} currentUser={currentUser} operatives={operatives} key={`stream-${task.id}-${lastMessageTimestamp}`} />
         </div>
      </div>
    </div>
  );
};

export default TaskDetailView;
