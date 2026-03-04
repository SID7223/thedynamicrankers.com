import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Reply, MoreHorizontal, CheckCheck } from 'lucide-react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
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
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/internal/chat?taskId=${taskId}`);
      if (res.ok) {
        const data = await res.json();
        const arrayData = Array.isArray(data) ? data : (data.results || []);
        setMessages(arrayData);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    setIsLoading(true);
    fetchMessages();
  }, [taskId, fetchMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentUser) return;

    const tempId = Date.now();
    const newMessage: Message = {
      id: tempId,
      content: input.trim(),
      sender_id: currentUser.id,
      sender_name: currentUser.username,
      timestamp: new Date().toISOString(),
      reactions: []
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    try {
      const res = await fetch('/api/internal/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SEND',
          taskId,
          senderId: currentUser.id,
          content: newMessage.content
        })
      });

      if (res.ok) {
        fetchMessages();
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
      fetchMessages();
    } catch (err) {
      console.error('Failed to react:', err);
    }
  };

  const formatDateSeparator = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const groupedMessages = useMemo(() => {
    const items: Array<{ type: 'separator'; label: string } | { type: 'message'; data: Message; showHeader: boolean }> = [];
    let lastDate = '';
    let lastSenderId: number | null = null;

    messages.forEach((msg) => {
      const msgDate = new Date(msg.timestamp).toDateString();
      if (msgDate !== lastDate) {
        items.push({ type: 'separator', label: formatDateSeparator(msg.timestamp) });
        lastDate = msgDate;
        lastSenderId = null;
      }

      const showHeader = msg.sender_id !== lastSenderId;
      items.push({ type: 'message', data: msg, showHeader });
      lastSenderId = msg.sender_id;
    });

    return items;
  }, [messages]);

  const MessageRow = ({ index }: { index: number }) => {
    const item = groupedMessages[index];
    if (!item) return null;

    if (item.type === 'separator') {
      return (
        <div className="flex items-center gap-4 my-6 px-8 select-none">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-[#1f1f1f] px-2 font-sans">
            {item.label}
          </span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>
      );
    }

    const { data: msg, showHeader } = item;
    const isSelf = msg.sender_id === currentUser?.id;

    return (
      <div
        className={`group relative flex gap-4 items-start px-8 ${showHeader ? 'mt-4' : 'mt-0.5'} hover:bg-[#353739] transition-colors py-1`}
        onMouseEnter={() => setHoveredMessage(msg.id)}
        onMouseLeave={() => setHoveredMessage(null)}
      >
        <div className="w-9 flex-shrink-0">
          {showHeader ? <Avatar name={msg.sender_name} /> : <div className="w-9 h-1" />}
        </div>

        <div className="flex-1 min-w-0 pr-12">
          {showHeader && (
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[14px] font-bold text-zinc-100 font-sans leading-[20px]">{msg.sender_name}</span>
              <span className="text-[10px] text-zinc-500 font-sans">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )}

          <div className="relative group/bubble inline-block w-full">
            <div className={`text-zinc-300 text-[14px] leading-[20px] font-sans break-words pr-20 relative p-1 rounded-lg ${isSelf ? 'bg-transparent' : 'bg-transparent'}`}>
              {msg.content}
              <div className="absolute bottom-0 right-0 flex items-center gap-1.5 text-[10px] text-zinc-500 select-none pb-0.5 pr-1">
                <span className="font-sans">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                <CheckCheck size={14} className="text-indigo-500" />
              </div>
            </div>

            {msg.reactions && msg.reactions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5 ml-1">
                {Object.entries(
                  (msg.reactions || []).reduce((acc, r) => {
                    acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([emoji, count]) => (
                  <button
                    key={emoji}
                    onClick={() => handleReact(msg.id, emoji)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-colors ${
                      (msg.reactions || []).some(r => r.user_id === currentUser?.id && r.emoji === emoji)
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
        </div>

        {/* Google Chat Style Horizontal Hover Bar */}
        <AnimatePresence>
          {hoveredMessage === msg.id && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center bg-[#1f1f1f] border border-zinc-700/50 rounded-lg shadow-xl px-1 py-1 z-20"
            >
              <div className="flex items-center gap-0.5 px-1 border-r border-zinc-800 mr-1">
                {['👍', '✅', '🚀'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => handleReact(msg.id, emoji)}
                    className="p-1.5 hover:bg-zinc-800 rounded transition-colors text-sm"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-0.5 px-1">
                <button className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400" title="Add reaction"><Smile size={16} /></button>
                <button className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400" title="Reply"><Reply size={16} /></button>
                <button className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400" title="More"><MoreHorizontal size={16} /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1f1f1f] relative overflow-hidden">
      <div className="flex-1 relative">
        {isLoading && messages.length === 0 ? (
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="w-6 h-6 border-t-2 border-indigo-500 rounded-full animate-spin" />
          </div>
        ) : groupedMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-20">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/20" />
            <p className="text-xs uppercase tracking-widest font-sans">Beginning of thread</p>
          </div>
        ) : (
          <Virtuoso
            ref={virtuosoRef}
            data={groupedMessages}
            initialTopMostItemIndex={groupedMessages.length - 1}
            followOutput="smooth"
            itemContent={(index) => <MessageRow index={index} />}
            className="custom-scrollbar"
            style={{ height: '100%' }}
          />
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="relative group bg-[#2d2e30] border border-transparent focus-within:border-indigo-500/50 transition-all p-1 rounded-xl shadow-inner">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="History is written here..."
            className="w-full bg-transparent border-none focus:ring-0 text-zinc-100 text-[14px] px-4 py-3 placeholder-zinc-500 font-sans"
          />
          <div className="flex items-center justify-between px-2 py-1 border-t border-white/5">
            <div className="flex gap-1">
              <button type="button" className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 transition-colors"><Smile size={18} /></button>
            </div>
            <button
              type="submit"
              className="px-5 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20 uppercase tracking-widest"
            >
              Send
            </button>
          </div>
        </div>
      </form>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }
      `}</style>
    </div>
  );
};

export default SlackStream;
