import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Edit2,
  Trash2,
  Clock,
  Image as ImageIcon,
  X,
  Plus,
  ArrowRight,
  AtSign,
  Hash,
  Download,
  History,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';
import Avatar from './Avatar';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  timestamp: string;
  attachments?: string[];
  mentions?: string[];
  is_edited?: boolean;
}

interface SlackStreamProps {
  taskId: string | 'global-room';
  currentUser: any;
  operatives: any[];
}

const SlackStream: React.FC<SlackStreamProps> = ({ taskId, currentUser, operatives }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionType, setSuggestionType] = useState<'user' | 'task' | null>(null);
  const [suggestionSearch, setSuggestionSearch] = useState('');
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/internal/chat?room=${taskId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Fetch Messages Failed:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const eventSource = new EventSource('/api/internal/stream');
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'CHAT_MSG' && data.room === taskId) {
        fetchMessages();
      }
    };
    return () => eventSource.close();
  }, [taskId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() && attachments.length === 0) return;

    const payload = {
      room_id: taskId,
      sender_id: currentUser.id,
      sender_name: currentUser.username,
      content: newMessage,
      attachments
    };

    try {
      const res = await fetch('/api/internal/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setNewMessage('');
        setAttachments([]);
        fetchMessages();
      }
    } catch (err) {
      console.error('Send Failed:', err);
    }
  };

  const handleEdit = async (messageId: string) => {
    try {
      const res = await fetch(`/api/internal/chat?id=${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent })
      });
      if (res.ok) {
        setEditingMessage(null);
        fetchMessages();
      }
    } catch (err) {
      console.error('Edit Failed:', err);
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm('Permanently redact this communication from the record?')) return;
    try {
      const res = await fetch(`/api/internal/chat?id=${messageId}`, { method: 'DELETE' });
      if (res.ok) fetchMessages();
    } catch (err) {
      console.error('Delete Failed:', err);
    }
  };

  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setAttachments(prev => [...prev, compressed]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNewMessage(val);

    const lastChar = val[val.length - 1];
    const words = val.split(' ');
    const lastWord = words[words.length - 1];

    if (lastWord.startsWith('@')) {
      setSuggestionType('user');
      setSuggestionSearch(lastWord.slice(1).toLowerCase());
      setShowSuggestions(true);
    } else if (lastWord.startsWith('#')) {
      setSuggestionType('task');
      setSuggestionSearch(lastWord.slice(1).toLowerCase());
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const filteredSuggestions = useMemo(() => {
    if (suggestionType === 'user') {
      return operatives.filter(op => op.username.toLowerCase().includes(suggestionSearch));
    }
    return [];
  }, [suggestionType, suggestionSearch, operatives]);

  const handleSuggestionClick = (suggestion: any) => {
    const words = newMessage.split(' ');
    words.pop();
    const trigger = suggestionType === 'user' ? '@' : '#';
    const text = suggestionType === 'user' ? suggestion.username : suggestion.task_number;
    setNewMessage(words.join(' ') + (words.length > 0 ? ' ' : '') + trigger + text + ' ');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const formatContent = (content: string) => {
    const parts = content.split(/(@\w+|#TASK-\d+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return <span key={i} className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded-md mx-0.5">@{part.slice(1)}</span>;
      }
      if (part.startsWith('#TASK-')) {
        return <span key={i} className="text-indigo-600 dark:text-indigo-400 font-bold underline decoration-indigo-500/30 hover:decoration-indigo-500 cursor-pointer">#{part.slice(1)}</span>;
      }
      return part;
    });
  };

  const anyOverlayOpen = !!previewImage || isEmojiPickerOpen || showSuggestions;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#06080D] relative overflow-hidden">
      {/* Universal Overlay for Popovers/Previews */}
      <AnimatePresence>
        {anyOverlayOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setPreviewImage(null);
              setIsEmojiPickerOpen(false);
              setShowSuggestions(false);
            }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-10"
          >
            {previewImage && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={previewImage}
                  className="max-h-[85vh] lg:max-h-[90vh] w-auto rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] select-none"
                  alt="Preview"
                />
              </motion.div>
            )}

            {isEmojiPickerOpen && (
              <div onClick={e => e.stopPropagation()} className="relative z-[110]">
                 <EmojiPicker
                   onEmojiClick={(emojiData) => {
                     setNewMessage(prev => prev + emojiData.emoji);
                     setIsEmojiPickerOpen(false);
                   }}
                   theme={document.documentElement.classList.contains('dark') ? 'dark' as any : 'light' as any}
                 />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-3 lg:p-6 space-y-6">
        {messages.map((msg) => {
          const isOwn = msg.sender_id === currentUser.id;
          const isAdmin = currentUser.role === 'Admin' || currentUser.role === 'SuperAdmin';
          const canManage = isOwn || isAdmin;

          return (
            <div key={msg.id} className="group relative flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Avatar name={msg.sender_name} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{msg.sender_name}</span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-600 font-medium">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.is_edited && (
                    <Link to={`/internal/message-history/${msg.id}`} className="text-[10px] text-zinc-400 hover:text-indigo-400 transition-colors font-medium">
                      (edited)
                    </Link>
                  )}
                </div>

                {editingMessage === msg.id ? (
                  <div className="mt-2 space-y-3">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-[#11161D] border border-indigo-500/30 rounded-xl p-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(msg.id)} className="px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">Save</button>
                      <button onClick={() => setEditingMessage(null)} className="px-3 py-1.5 text-zinc-500 text-[10px] font-bold rounded-lg uppercase tracking-wider">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed break-words whitespace-pre-wrap font-sans">
                    {formatContent(msg.content)}
                  </p>
                )}

                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.attachments.map((at, i) => (
                      <div key={i} className="relative group/att cursor-pointer" onClick={() => setPreviewImage(at)}>
                        <img src={at} className="h-32 lg:h-40 w-auto rounded-xl border border-zinc-200 dark:border-zinc-800 transition-all group-hover/att:brightness-75" alt="Attachment" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/att:opacity-100 transition-opacity">
                           <Download className="text-white" size={20} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {canManage && !editingMessage && (
                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-white dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg overflow-hidden">
                   {isOwn && (
                    <button onClick={() => { setEditingMessage(msg.id); setEditContent(msg.content); }} className="p-2 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <Edit2 size={14} />
                    </button>
                   )}
                   <button onClick={() => handleDelete(msg.id)} className="p-2 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <Trash2 size={14} />
                   </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-3 lg:p-6 bg-zinc-50 dark:bg-[#0B101A] border-t border-zinc-200 dark:border-zinc-800/50 relative">
        {/* Suggestion Popover */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-6 mb-4 w-[280px] bg-white dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-[110]"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">{suggestionType === 'user' ? 'Tag Operative' : 'Link Directive'}</span>
                {suggestionType === 'user' ? <AtSign size={14} className="text-zinc-400" /> : <Hash size={14} className="text-zinc-400" />}
              </div>
              <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                {filteredSuggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(s)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors text-left"
                  >
                    {suggestionType === 'user' ? (
                      <>
                        <Avatar name={s.username} size="xs" />
                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">@{s.username}</span>
                      </>
                    ) : (
                      <>
                        <div className="w-6 h-6 bg-indigo-500/10 rounded flex items-center justify-center text-indigo-600 text-[10px] font-bold">#</div>
                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">#{s.task_number}</span>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSend} className="bg-white dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl transition-all focus-within:ring-2 focus-within:ring-indigo-500/20">
          {attachments.length > 0 && (
            <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-2">
              {attachments.map((at, i) => (
                <div key={i} className="relative group">
                  <img src={at} className="w-16 h-16 rounded-xl object-cover border border-zinc-200 dark:border-zinc-800" alt="Preview" />
                  <button type="button" onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} className="absolute -top-1.5 -right-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2 p-2">
            <div className="flex items-center gap-1 pb-1">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2.5 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <Paperclip size={20} />
              </button>
              <button type="button" onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)} className="p-2.5 text-zinc-400 hover:text-amber-500 transition-colors">
                <Smile size={20} />
              </button>
            </div>

            <textarea
              ref={inputRef}
              rows={1}
              value={newMessage}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Broadcast a directive..."
              className="flex-1 bg-transparent border-none py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-300 dark:placeholder-zinc-700 focus:ring-0 resize-none font-sans min-h-[44px] max-h-[200px] custom-scrollbar"
            />

            <button type="submit" disabled={!newMessage.trim() && attachments.length === 0} className="p-3 bg-indigo-600 text-white rounded-2xl disabled:opacity-30 disabled:grayscale transition-all hover:bg-indigo-500 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/20">
              <Send size={18} />
            </button>
          </div>
        </form>
        <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleFileUpload} />
      </div>
    </div>
  );
};

export default SlackStream;
