import React, { useState, useEffect } from 'react';
import TaskList from '../components/internal/TaskList';
import ChatWindow from '../components/internal/ChatWindow';

interface Task {
  id: number;
  title: string;
  status: 'pending' | 'completed';
  assigned_to: string;
}

const InternalDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, fetch from /api/internal/tasks
    // const response = await fetch('/api/internal/tasks');
    // const data = await response.json();
    // setTasks(data.results);

    // For now, mock a few tasks
    setTasks([
      { id: 1, title: 'Edge Deployment', status: 'pending', assigned_to: 'SID' },
      { id: 2, title: 'Strategic Review', status: 'completed', assigned_to: 'Eric' },
      { id: 3, title: 'Network Security Audit', status: 'pending', assigned_to: 'SID' },
      { id: 4, title: 'Content Migration', status: 'pending', assigned_to: 'Eric' }
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-8 space-y-4 font-mono">
        <div className="w-12 h-1 bg-zinc-900 overflow-hidden relative border border-zinc-800 rounded-full">
          <div className="absolute inset-0 bg-emerald-500 w-1/3 animate-ping"></div>
        </div>
        <p className="text-zinc-600 text-[10px] uppercase tracking-widest text-center animate-pulse">
          INITIALIZING EDGE NODE...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-400 font-mono overflow-hidden">
      <TaskList
        tasks={tasks}
        onSelectTask={setSelectedTask}
        activeTaskId={selectedTask?.id}
      />
      <ChatWindow
        taskId={selectedTask?.id}
      />

      {/* Global Status Bar */}
      <div className="fixed bottom-0 right-0 p-2 text-[9px] text-zinc-700 pointer-events-none flex items-center space-x-3 bg-zinc-950/80 backdrop-blur px-4 py-1.5 border-t border-l border-zinc-900 rounded-tl">
        <span className="flex items-center space-x-1">
          <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
          <span>EDGE_STATUS: NOMINAL</span>
        </span>
        <span className="text-zinc-800">|</span>
        <span>NODE: VERCEL_EDGE</span>
        <span className="text-zinc-800">|</span>
        <span>AUTH: VALID_SESSION</span>
        <span className="text-zinc-800">|</span>
        <span>SYNC: REAL_TIME</span>
      </div>
    </div>
  );
};

export default InternalDashboard;
