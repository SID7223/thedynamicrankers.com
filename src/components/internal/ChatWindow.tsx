import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  content: string;
  sender: string;
  timestamp: string;
}

interface ChatWindowProps {
  taskId?: number;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ taskId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom on new message
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!taskId) return;

    // In production, we'd start an SSE connection:
    // const eventSource = new EventSource(`/api/internal/chat?taskId=${taskId}`);
    // eventSource.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   setMessages(prev => [...prev, data]);
    // };
    // return () => eventSource.close();

    // For now, mock a few initial messages
    setMessages([
      { id: 1, content: 'Status report initiated.', sender: 'SID', timestamp: new Date().toISOString() },
      { id: 2, content: 'Deployment finalized at edge.', sender: 'Eric', timestamp: new Date().toISOString() }
    ]);
  }, [taskId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !taskId) return;

    // In production, we'd POST to /api/internal/chat
    const newMessage = {
      id: Date.now(),
      content: content.trim(),
      sender: 'SID', // In production, we'd get from the current user session.
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
    setContent('');
  };

  if (!taskId) {
    return (
      <div className="flex-1 bg-zinc-950 flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-16 h-16 border-2 border-dashed border-zinc-800 rounded-full animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 bg-zinc-900 rounded-full border border-zinc-800"></div>
        </div>
        <p className="text-zinc-600 font-mono text-xs uppercase tracking-widest text-center max-w-xs leading-loose">
          SELECT A THREAD FROM THE LEDGER TO INITIALIZE COMMUNICATION.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-950 font-mono text-zinc-400">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
        <h2 className="text-emerald-500 font-bold tracking-widest uppercase text-xs">COMMS / THREAD: {taskId.toString().padStart(3, '0')}</h2>
        <button className="text-[10px] px-2 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded hover:bg-emerald-500 hover:text-black transition-all uppercase tracking-tighter">
          Mark as Complete
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col space-y-1 group">
            <div className="flex items-center space-x-2">
              <span className="text-emerald-500 font-bold text-[11px] tracking-widest">{msg.sender.toUpperCase()}</span>
              <span className="text-zinc-700 text-[9px]">{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed max-w-2xl bg-zinc-900/30 p-3 border border-zinc-900 group-hover:border-zinc-800 transition-colors">
              {msg.content}
            </p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-6 border-t border-zinc-800 bg-zinc-950">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-emerald-500 animate-pulse font-bold text-xs">{'>'}</span>
          </div>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="ENTER COMMAND..."
            className="block w-full bg-zinc-900 border border-zinc-800 pl-8 pr-12 py-3 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all font-mono rounded"
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-700 group-focus-within:text-emerald-500 hover:text-emerald-400 transition-colors"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1">SEND</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
