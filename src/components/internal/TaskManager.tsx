import React from 'react';

interface Task {
  id: number;
  title: string;
  status: 'pending' | 'completed';
  created_at: string;
  assigned_to: number | null;
}

interface User {
  id: number;
  username: string;
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

  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2">Active Tasks</h3>
      {safeTasks.length === 0 ? (
        <div className="px-3 py-4 bg-zinc-800/20 rounded-xl border border-zinc-800/50 text-center">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest">No Active Commands</p>
        </div>
      ) : (
        safeTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => setActiveTaskId(task.id)}
            className={`w-full text-left px-3 py-3 rounded-xl transition-all cursor-pointer border ${activeTaskId === task.id ? 'bg-indigo-600/10 border-indigo-500/30' : 'bg-zinc-800/30 border-zinc-800/50 hover:bg-zinc-800/50'}`}
          >
            <div className="flex items-center gap-3 mb-2">
               <div className={`w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-indigo-500 animate-pulse'}`} />
               <span className="text-xs font-bold text-white truncate">{task.title}</span>
            </div>

            <div className="flex items-center justify-between">
              <select
                value={task.assigned_to || ''}
                onChange={(e) => {
                  e.stopPropagation();
                  onAssignTask(task.id, e.target.value ? parseInt(e.target.value) : null);
                }}
                onClick={(e) => e.stopPropagation()}
                className="bg-transparent text-[10px] text-zinc-500 uppercase tracking-widest outline-none cursor-pointer hover:text-indigo-400 transition-colors"
              >
                <option value="" className="bg-zinc-900">Unassigned</option>
                {safeOperatives.map((op) => (
                  <option key={op.id} value={op.id} className="bg-zinc-900">{op.username}</option>
                ))}
              </select>
              <span className="text-[9px] text-zinc-600">{new Date(task.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TaskManager;
