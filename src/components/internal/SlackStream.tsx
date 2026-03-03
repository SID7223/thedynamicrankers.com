import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Reply, MoreHorizontal } from 'lucide-react';
import Avatar from './Avatar';

interface Message {
  id: number;
  content: string;
  sender_id: number;
  sender_name: string;
  timestamp: string;
  reactions?: Array<{ emoji: string; user_name: string; user_id: number }>;
}

interface User {
  id: number;
  username: string;
  role: string;
}

interface SlackStreamProps {
  taskId: number;
  currentUser: User | null;
  operatives: User[];
}

const SlackStream: React.FC<SlackStreamProps> = ({
  taskId,
  currentUser,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [hoveredMessage, setHoveredMessage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/internal/chat?taskId=${taskId}`);
        if (res.ok) {
          const data = await res.json();
          // The API returns results in a results property or as an array
          setMessages(Array.isArray(data) ? data : (data.results || []));
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentUser) return;

    try {
      const res = await fetch('/api/internal/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SEND',
          taskId,
          senderId: currentUser.id,
          content: input.trim()
        })
      });

      if (res.ok) {
        setInput('');
        const updated = await fetch(`/api/internal/chat?taskId=${taskId}`);
        const data = await updated.json();
        setMessages(Array.isArray(data) ? data : (data.results || []));
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleReact = async (messageId: number, emoji: string) => {
    if (!currentUser) return;
    try {
      await fetch('/api/internal/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REACT',
          messageId,
          userId: currentUser.id,
          emoji
        })
      });
      const updated = await fetch(`/api/internal/chat?taskId=${taskId}`);
      const data = await updated.json();
      setMessages(Array.isArray(data) ? data : (data.results || []));
    } catch (err) {
      console.error('Failed to react:', err);
    }
  };

  const quickReactions = ['👍', '✅', '🚀', '🔥', '👀'];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#06080D] relative overflow-hidden">
      <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-t-2 border-indigo-500 rounded-full animate-spin" />
          </div>
        ) : (messages || []).length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-20">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/20" />
                <p className="text-xs uppercase tracking-widest">Beginning of thread</p>
            </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="group relative flex gap-4 items-start"
              onMouseEnter={() => setHoveredMessage(msg.id)}
              onMouseLeave={() => setHoveredMessage(null)}
            >
              <Avatar name={msg.sender_name} />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-zinc-100">{msg.sender_name}</span>
                  <span className="text-[10px] text-zinc-500">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-zinc-300 text-sm leading-relaxed max-w-3xl">
                  {msg.content}
                </div>

                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {Object.entries(
                      msg.reactions.reduce((acc, r) => {
                        acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([emoji, count]) => (
                      <button
                        key={emoji}
                        onClick={() => handleReact(msg.id, emoji)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-colors ${
                          msg.reactions?.some(r => r.user_id === currentUser?.id && r.emoji === emoji)
                            ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400'
                            : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10'
                        }`}
                      >
                        <span>{emoji}</span>
                        <span className="font-bold">{count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <AnimatePresence>
                {hoveredMessage === msg.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute right-0 -top-4 flex items-center bg-[#111827] border border-white/10 rounded-lg shadow-2xl p-1 z-20"
                  >
                    <div className="flex items-center border-r border-white/5 px-1 gap-1">
                      {quickReactions.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => handleReact(msg.id, emoji)}
                          className="p-1.5 hover:bg-white/5 rounded transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center px-1 gap-1">
                      <button className="p-1.5 hover:bg-white/5 rounded text-zinc-400"><Smile size={16} /></button>
                      <button className="p-1.5 hover:bg-white/5 rounded text-zinc-400"><Reply size={16} /></button>
                      <button className="p-1.5 hover:bg-white/5 rounded text-zinc-400"><MoreHorizontal size={16} /></button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-8 pt-0">
        <div className="relative group bg-white/5 border border-white/10 rounded-xl focus-within:border-indigo-500/50 transition-all p-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message the team..."
            className="w-full bg-transparent border-none focus:ring-0 text-zinc-100 text-sm px-4 py-3 placeholder-zinc-600"
          />
          <div className="flex items-center justify-between px-2 py-1 border-t border-white/5">
            <div className="flex gap-1">
              <button type="button" className="p-1.5 hover:bg-white/5 rounded text-zinc-500"><Smile size={16} /></button>
            </div>
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20"
            >
              SEND
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SlackStream;
