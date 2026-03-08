import React from 'react';
import Avatar from './Avatar';
import { useTaskStore } from '../../store/useTaskStore';

interface Task {
  id: string;
  title: string;
  status: string;
  created_at: string;
  assigned_to: string | null;
  hasUnread?: boolean;
}

interface TaskListProps {
  activeTaskId: string | null;
  onSelectTask: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  activeTaskId,
  onSelectTask
}) => {
  const { tasks, operatives, updateTask } = useTaskStore();

  const TaskRow = ({ task }: { task: Task }) => {
    const assignedUser = operatives.find(op => op.id === task.assigned_to);

    return (
      <div className="px-0 py-0.5">
        <div
          onClick={() => onSelectTask(task.id)}
          className={`w-full text-left px-4 py-4 rounded-xl transition-all cursor-pointer border shadow-sm ${activeTaskId === task.id ? 'bg-[#353739] border-zinc-700/50' : 'bg-[#2d2e30]/50 border-transparent hover:bg-[#353739]/50'}`}
        >
          <div className="flex items-center gap-4 mb-3">
             <Avatar name={assignedUser?.username || '?'} size="sm" isOnline={assignedUser?.is_online} />
             <div className="flex-1 min-w-0">
               <span className={`text-[13px] tracking-tight block truncate font-sans ${task.hasUnread ? 'font-bold text-white' : 'font-medium text-zinc-300'}`}>
                 {task.title}
               </span>
               <div className="flex items-center gap-2 mt-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${task.status === 'done' ? 'bg-emerald-500/60' : 'bg-indigo-500/60 shadow-[0_0_8px_rgba(99,102,241,0.3)]'}`} />
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
                updateTask(task.id, { assignee_ids: e.target.value ? [e.target.value] : [] });
              }}
              onClick={(e) => e.stopPropagation()}
              className="bg-transparent text-[10px] text-zinc-500 uppercase tracking-[0.1em] outline-none cursor-pointer hover:text-indigo-400 transition-colors font-sans font-bold"
            >
              <option value="" className="bg-zinc-900">Unassigned</option>
              {operatives.map((op) => (
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
    <div className="space-y-1">
      {tasks.length === 0 ? (
        <div className="py-8 bg-zinc-800/20 rounded-2xl border border-dashed border-zinc-800/50 text-center">
          <p className="text-[10px] text-zinc-700 uppercase tracking-[0.2em] font-bold font-sans">No Orders Logged</p>
        </div>
      ) : (
        tasks.map((task) => <TaskRow key={task.id} task={task} />)
      )}
    </div>
  );
};

export default TaskList;
