import React, { useState } from 'react';
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

interface SlackStreamProps {
  messages: Message[];
  currentUserId: number;
  onSend: (content: string) => void;
  onReact: (messageId: number, emoji: string) => void;
  isTyping?: string[];
}

const SlackStream: React.FC<SlackStreamProps> = ({
  messages,
  currentUserId,
  onSend,
  onReact,
  isTyping = []
}) => {
  const [input, setInput] = useState('');
  const [hoveredMessage, setHoveredMessage] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  };

  const quickReactions = ['👍', '✅', '🚀', '🔥', '👀'];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#06080D] relative overflow-hidden">
      {/* Header */}
      <div className="h-16 border-b border-white/5 flex items-center px-8 justify-between bg-[#06080D]/80 backdrop-blur-md z-10">
        <h2 className="text-zinc-100 font-semibold flex items-center gap-2">
          <span className="text-indigo-500">#</span> communication-stream
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
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

              {/* Reactions Display */}
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
                      onClick={() => onReact(msg.id, emoji)}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-colors ${
                        msg.reactions?.some(r => r.user_id === currentUserId && r.emoji === emoji)
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

            {/* Floating Action Bar */}
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
                        onClick={() => onReact(msg.id, emoji)}
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
        ))}
      </div>

      {/* Typing Indicator */}
      <AnimatePresence>
        {isTyping.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="px-8 py-2 text-[10px] text-indigo-400 italic"
          >
            {isTyping.join(', ')} {isTyping.length === 1 ? 'is' : 'are'} typing...
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
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
