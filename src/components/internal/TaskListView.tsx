import React, { useState } from 'react';
import { Plus, Search, Filter, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import Avatar from './Avatar';

interface Task {
  id: number;
  title: string;
  status: string;
  priority: string;
  assigned_to: number | null;
  assigned_name?: string;
  due_date: string | null;
  created_at: string;
  hasUnread?: boolean;
}

interface User {
  id: number;
  username: string;
}

interface TaskListViewProps {
  tasks: Task[];
  operatives: User[];
  onSelectTask: (id: number) => void;
  onCreateTask: () => void;
}

const TaskListView: React.FC<TaskListViewProps> = ({ tasks, operatives, onSelectTask, onCreateTask }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks
    .filter(t =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assigned_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toString().includes(searchTerm)
    )
    .sort((a, b) => b.id - a.id); // Show newest first

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Low': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'review': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'in_progress': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'todo': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'backlog': return 'bg-zinc-800 text-zinc-500 border-zinc-700';
      default: return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B101A] p-6 lg:p-10 overflow-hidden">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 font-sans tracking-tight">Operations Hub</h2>
          <p className="text-zinc-500 text-sm font-sans">Strategic command and control for all active directives.</p>
        </div>
        <button
          onClick={onCreateTask}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-3 shadow-2xl shadow-indigo-600/20 active:scale-95"
        >
          <Plus size={20} />
          Initialize New Directive
        </button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Search directives, operatives, or IDs..."
            className="w-full bg-[#161B22] border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-sans"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="p-4 bg-[#161B22] border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white transition-colors">
          <Filter size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid grid-cols-[1fr_180px_140px_160px_140px] gap-6 px-6 py-4 bg-[#161B22] rounded-t-2xl border-x border-t border-zinc-800/50">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 font-sans">Directive</span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 font-sans">Operative</span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 font-sans">Priority</span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 font-sans">Status</span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 font-sans">Target Date</span>
          </div>

          {/* List */}
          <div className="bg-[#11161D] border-x border-b border-zinc-800/50 rounded-b-2xl divide-y divide-zinc-800/30">
            {filteredTasks.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">No active directives found in this sector.</p>
              </div>
            ) : (
              filteredTasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => onSelectTask(task.id)}
                  className="grid grid-cols-[1fr_180px_140px_160px_140px] gap-6 px-6 py-5 hover:bg-[#1C2128] transition-all cursor-pointer group items-center"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative">
                       <div className="w-10 h-10 bg-[#161B22] rounded-xl flex items-center justify-center text-zinc-500 group-hover:text-indigo-400 border border-zinc-800 transition-colors">
                        <span className="text-[10px] font-bold">#{task.id.toString().padStart(3, '0')}</span>
                      </div>
                      {task.hasUnread && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-[#11161D] shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                      )}
                    </div>
                    <span className={`text-sm font-bold truncate group-hover:text-white transition-colors ${task.hasUnread ? 'text-white' : 'text-zinc-300'}`}>
                      {task.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Avatar name={task.assigned_name || '?'} size="xs" />
                    <span className="text-xs font-medium text-zinc-400 truncate">{task.assigned_name || 'Unassigned'}</span>
                  </div>

                  <div>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>

                  <div>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-zinc-500">
                    <Clock size={14} />
                    <span className="text-xs font-medium">{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'TBD'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskListView;
