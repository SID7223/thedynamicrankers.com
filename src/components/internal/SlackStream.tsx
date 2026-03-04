import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Check, CheckCheck } from 'lucide-react';
import Avatar from './Avatar';

interface Message {
  id: number;
  task_id: number | null;
  sender_id: number;
  sender_name: string;
  content: string;
  timestamp: string;
  read_count: number;
}

interface User {
  id: number;
  username: string;
}

interface SlackStreamProps {
  taskId: number;
  currentUser: User;
  operatives: User[];
}

const SlackStream: React.FC<SlackStreamProps> = ({ taskId, currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/internal/chat?taskId=${taskId}&userId=${currentUser.id}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Chat fetch failed:', err);
    }
  }, [taskId, currentUser.id]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    setSending(true);
    const text = input;
    setInput('');

    try {
      await fetch('/api/internal/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          senderId: currentUser.id,
          content: text
        })
      });
      fetchMessages();
    } catch (err) {
      console.error('Send failed:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1f1f1f]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg) => {
          const isOwn = msg.sender_id === currentUser.id;
          const isRead = msg.read_count > 0;

          return (
            <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}>
              <div className={`flex max-w-[80%] gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar name={msg.sender_name} size="sm" />
                <div className="flex flex-col">
                  <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                    isOwn ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-zinc-800 text-zinc-200 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                  <div className={`flex items-center gap-2 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isOwn && (
                      <div className="flex">
                        {isRead ? (
                          <CheckCheck size={12} className="text-indigo-400" />
                        ) : (
                          <CheckCheck size={12} className="text-zinc-600" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 bg-[#1f1f1f] border-t border-zinc-800/50">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            placeholder="Transmit command data..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-3.5 pr-14 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 text-indigo-400 hover:text-white transition-colors"
            disabled={sending}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SlackStream;
