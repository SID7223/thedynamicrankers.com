import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import Avatar from './Avatar';

interface Task {
  id: number;
  title: string;
  status: 'pending' | 'completed';
  assigned_to: string | number;
  hasUnread?: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  activeTaskId?: number;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onSelectTask, activeTaskId }) => {
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const TaskRow = ({ index }: { index: number }) => {
    const task = safeTasks[index];
    if (!task) return null;

    return (
      <button
        key={task.id}
        onClick={() => onSelectTask(task)}
        className={`w-full text-left p-4 border-b border-zinc-800 transition-all hover:bg-[#353739]/50 flex items-center gap-4 ${activeTaskId === task.id ? 'bg-[#353739] border-l-2 border-l-indigo-500' : ''}`}
      >
        <Avatar name={task.assigned_to.toString()} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <span className={`text-[13px] truncate pr-2 font-sans ${task.hasUnread ? 'font-bold text-white' : 'text-zinc-200'}`}>
              {task.title}
            </span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest ${task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-500'}`}>
              {task.status}
            </span>
          </div>
          <div className="text-[10px] text-zinc-600 flex justify-between font-bold tracking-widest uppercase font-sans">
            <span>ID: {task.id.toString().padStart(3, '0')}</span>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#2d2e30] border-r border-zinc-800 w-80 text-zinc-400 font-sans shadow-xl">
      <div className="p-6 border-b border-zinc-800 bg-[#2d2e30] flex items-center justify-between shadow-sm">
        <h2 className="text-white font-bold tracking-[0.2em] uppercase text-xs">The Ledger</h2>
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
      </div>
      <div className="flex-1">
        <Virtuoso
          style={{ height: '100%' }}
          data={safeTasks}
          itemContent={(index) => <TaskRow index={index} />}
          className="custom-scrollbar"
        />
      </div>
      <div className="p-6 border-t border-zinc-800 bg-[#262728] shadow-inner">
        <button className="w-full py-3 bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-all uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-indigo-600/20">
          + New Command
        </button>
      </div>
    </div>
  );
};

export default TaskList;
