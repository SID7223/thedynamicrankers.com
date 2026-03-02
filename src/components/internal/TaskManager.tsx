import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  status: 'pending' | 'completed';
  assigned_to: number;
  assigned_name: string;
  due_date?: string;
}

interface TaskManagerProps {
  tasks: Task[];
  activeTaskId?: number;
  onSelectTask: (task: Task) => void;
  onToggleTask: (task: Task) => void;
  onAddNew: () => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  activeTaskId,
  onSelectTask,
  onToggleTask,
  onAddNew
}) => {
  const activeTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const TaskItem = ({ task }: { task: Task }) => (
    <motion.button
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={() => onSelectTask(task)}
      className={`w-full text-left p-4 rounded-xl transition-all mb-2 group border ${
        activeTaskId === task.id
          ? 'bg-indigo-600/10 border-indigo-500 shadow-lg shadow-indigo-500/10'
          : 'bg-white/5 border-white/10 hover:bg-white/10'
      } ${task.status === 'completed' ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleTask(task);
          }}
          className={`mt-1 transition-colors ${task.status === 'completed' ? 'text-emerald-500' : 'text-zinc-500 hover:text-indigo-400'}`}
        >
          {task.status === 'completed' ? <CheckCircle2 size={18} /> : <Circle size={18} />}
        </button>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-sm truncate ${task.status === 'completed' ? 'line-through text-zinc-500' : 'text-zinc-100'}`}>
            {task.title}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[10px] text-indigo-400 font-medium uppercase tracking-wider">
              {task.assigned_name}
            </span>
            {task.due_date && (
              <span className="flex items-center gap-1 text-[10px] text-zinc-500">
                <Clock size={10} />
                {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );

  return (
    <div className="flex flex-col h-full bg-[#0B101A] border-r border-white/5 w-80">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-lg tracking-tight">The Ledger</h2>
          <button
            onClick={onAddNew}
            className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20"
          >
            +
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Active Tasks</h4>
            <div className="max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {activeTasks.map(task => <TaskItem key={task.id} task={task} />)}
              </AnimatePresence>
            </div>
          </div>

          {completedTasks.length > 0 && (
            <div>
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Completed</h4>
              <div className="max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {completedTasks.map(task => <TaskItem key={task.id} task={task} />)}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
