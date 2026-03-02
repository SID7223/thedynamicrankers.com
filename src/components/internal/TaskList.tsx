import React from 'react';

interface Task {
  id: number;
  title: string;
  status: 'pending' | 'completed';
  assigned_to: string;
}

interface TaskListProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  activeTaskId?: number;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onSelectTask, activeTaskId }) => {
  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800 w-80 text-zinc-400 font-mono">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
        <h2 className="text-emerald-500 font-bold tracking-widest uppercase text-xs">The Ledger / Tasks</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {tasks.map((task) => (
          <button
            key={task.id}
            onClick={() => onSelectTask(task)}
            className={`w-full text-left p-4 border-b border-zinc-900 transition-colors hover:bg-zinc-900 ${activeTaskId === task.id ? 'bg-zinc-900 border-l-2 border-l-emerald-500' : ''}`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="text-zinc-200 text-sm font-bold truncate pr-2">{task.title}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-500'}`}>
                {task.status.toUpperCase()}
              </span>
            </div>
            <div className="text-[10px] text-zinc-600 flex justify-between">
              <span>ASSIGNED: {task.assigned_to}</span>
              <span>ID: {task.id.toString().padStart(3, '0')}</span>
            </div>
          </button>
        ))}
      </div>
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
        <button className="w-full py-2 bg-zinc-900 border border-zinc-800 text-xs hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all uppercase tracking-tighter">
          + New Command
        </button>
      </div>
    </div>
  );
};

export default TaskList;
