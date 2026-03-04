import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import Avatar from './Avatar';

interface Task {
  id: number;
  title: string;
  status: 'pending' | 'completed';
  created_at: string;
  assigned_to: number | null;
  hasUnread?: boolean;
}

interface User {
  id: number;
  username: string;
  is_online?: boolean;
}

interface TaskManagerProps {
  tasks: Task[];
  activeTaskId: number;
  setActiveTaskId: (id: number) => void;
  onToggleStatus: (id: number, status: 'pending' | 'completed') => void;
  onAssignTask: (id: number, assignedTo: number | null) => void;
  operatives: User[];
}

const TaskManager: React.FC<TaskManagerProps> = ({
  tasks = [],
  activeTaskId,
  setActiveTaskId,
  onAssignTask,
  operatives = []
}) => {
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeOperatives = Array.isArray(operatives) ? operatives : [];

  const TaskRow = ({ index }: { index: number }) => {
    const task = safeTasks[index];
    if (!task) return null;

    const assignedUser = safeOperatives.find(op => op.id === task.assigned_to);

    return (
      <div className="px-4 py-0.5">
        <div
          onClick={() => setActiveTaskId(task.id)}
          className={`w-full text-left px-4 py-4 rounded-xl transition-all cursor-pointer border shadow-sm ${activeTaskId === task.id ? 'bg-[#353739] border-zinc-700/50' : 'bg-[#2d2e30]/50 border-transparent hover:bg-[#353739]/50'}`}
        >
          <div className="flex items-center gap-4 mb-3">
             <Avatar name={assignedUser?.username || '?'} size="sm" isOnline={assignedUser?.is_online} />
             <div className="flex-1 min-w-0">
               <span className={`text-[13px] tracking-tight block truncate font-sans ${task.hasUnread ? 'font-bold text-white' : 'font-medium text-zinc-300'}`}>
                 {task.title}
               </span>
               <div className="flex items-center gap-2 mt-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${task.status === 'completed' ? 'bg-emerald-500/60' : 'bg-indigo-500/60 shadow-[0_0_8px_rgba(99,102,241,0.3)]'}`} />
                  <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold font-sans">
                    {task.status}
                  </span>
               </div>
             </div>
          </div>

          <div className="flex items-center justify-between pl-1">
            <select
              value={task.assigned_to || ''}
              onChange={(e) => {
                e.stopPropagation();
                onAssignTask(task.id, e.target.value ? parseInt(e.target.value) : null);
              }}
              onClick={(e) => e.stopPropagation()}
              className="bg-transparent text-[10px] text-zinc-500 uppercase tracking-[0.1em] outline-none cursor-pointer hover:text-indigo-400 transition-colors font-sans font-bold"
            >
              <option value="" className="bg-zinc-900">Unassigned</option>
              {safeOperatives.map((op) => (
                <option key={op.id} value={op.id} className="bg-zinc-900">{op.username}</option>
              ))}
            </select>
            <span className="text-[9px] text-zinc-600 font-sans font-medium uppercase">{new Date(task.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 flex flex-col h-full bg-[#2d2e30] border-r border-zinc-800/50">
      <div className="px-6 pt-6 flex items-center justify-between mb-2">
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] font-sans">Active Directives</h3>
        <div className="px-2 py-0.5 bg-zinc-800/60 rounded text-[9px] text-zinc-500 font-bold border border-zinc-700/50 select-none">
          {safeTasks.length}
        </div>
      </div>
      <div className="flex-1">
        {safeTasks.length === 0 ? (
          <div className="px-6 mt-4">
            <div className="py-8 bg-zinc-800/20 rounded-2xl border border-dashed border-zinc-800/50 text-center">
              <p className="text-[10px] text-zinc-700 uppercase tracking-[0.2em] font-bold font-sans">No Orders Logged</p>
            </div>
          </div>
        ) : (
          <Virtuoso
            style={{ height: '100%' }}
            data={safeTasks}
            itemContent={(index) => <TaskRow index={index} />}
            className="custom-scrollbar"
          />
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }
      `}</style>
    </div>
  );
};

export default TaskManager;
