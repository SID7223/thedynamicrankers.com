import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Send,
  Paperclip,
  Smile,
  Edit2,
  Trash2,
  X as XIcon,
  Plus,
  AtSign,
  Hash,
  Reply,
  ChevronDown,
  Download,
  Check
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
  attachments?: any[];
  reactions?: any[];
  is_edited?: boolean;
  parent_message_id?: string | null;
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
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
  const [showJumpToBottom, setShowJumpToBottom] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hasInitialScrolled, setHasInitialScrolled] = useState(false);
  const [lastReadAt, setLastReadAt] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<any>(null);
  const unreadRef = useRef<HTMLDivElement>(null);

  const apiTaskId = taskId === 'global-room' ? '0' : taskId;

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/internal/chat?taskId=${apiTaskId}&userId=${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        setLastReadAt(data.lastReadAt);
      }
    } catch (err) {
      console.error('Fetch Messages Failed:', err);
    }
  };

  const sendReadReceipt = async () => {
      try {
          await fetch('/api/internal/read_receipts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: currentUser.id, roomId: taskId })
          });
      } catch {}
  };

  const fetchFavorites = async () => {
     try {
       const res = await fetch(`/api/internal/reactions?userId=${currentUser.id}`);
       if (res.ok) setFavorites(await res.json());
     } catch {}
  };

  useEffect(() => {
    fetchMessages();
    fetchFavorites();
    sendReadReceipt();
    const eventSource = new EventSource('/api/internal/stream');
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'CHAT_MSG' && (data.room === taskId || data.room === apiTaskId)) {
        fetchMessages();
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            const isAtBottom = scrollHeight - scrollTop - clientHeight < 200;
            if (!isAtBottom) {
                setNewMessagesCount(prev => prev + 1);
                setShowJumpToBottom(true);
            }
        }
      }
      if (data.type === 'TYPING_STATUS' && (data.room === taskId || data.room === apiTaskId)) {
          if (data.userId !== currentUser.id) {
              setTypingUsers(prev => {
                  const next = { ...prev };
                  if (data.message === 'STOP') delete next[data.userId];
                  else next[data.userId] = data.message;
                  return next;
              });
          }
      }
    };
    return () => eventSource.close();
  }, [taskId]);

  const firstUnreadId = useMemo(() => {
      if (!lastReadAt) return null;
      return messages.find(m => m.timestamp > lastReadAt && m.sender_id !== currentUser.id)?.id;
  }, [messages, lastReadAt, currentUser.id]);

  useEffect(() => {
    if (scrollRef.current && messages.length > 0 && !hasInitialScrolled) {
        if (unreadRef.current) {
            unreadRef.current.scrollIntoView({ behavior: 'auto', block: 'center' });
        } else {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
        setHasInitialScrolled(true);
    } else if (scrollRef.current && newMessagesCount === 0) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 200;
        if (isAtBottom) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }
  }, [messages, hasInitialScrolled, firstUnreadId]);

  const handleScroll = () => {
      if (!scrollRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      if (isAtBottom) {
          setShowJumpToBottom(false);
          setNewMessagesCount(0);
          sendReadReceipt();
      }
  };

  const jumpToBottom = () => {
      if (scrollRef.current) {
          scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
          setShowJumpToBottom(false);
          setNewMessagesCount(0);
      }
  };

  const updateTypingStatus = async (isTyping: boolean) => {
      try {
          await fetch('/api/internal/typing', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ roomId: taskId, userId: currentUser.id, username: currentUser.username, isTyping })
          });
      } catch {}
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() && attachments.length === 0) return;

    const payload = {
      taskId: apiTaskId,
      senderId: currentUser.id,
      content: newMessage,
      parentMessageId: replyTo?.id || null,
      attachments: attachments.map(url => ({ name: 'file.jpg', type: 'image/jpeg', url }))
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
        setReplyTo(null);
        updateTypingStatus(false);
        fetchMessages();
        setTimeout(jumpToBottom, 100);
      }
    } catch (err) {
      console.error('Send Failed:', err);
    }
  };

  const handleUpdate = async (id: string) => {
      try {
          const res = await fetch(`/api/internal/chat?id=${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ content: editContent, userId: currentUser.id })
          });
          if (res.ok) {
              setEditingMessage(null);
              fetchMessages();
          }
      } catch {}
  };

  const handleDelete = async (id: string) => {
      if (!confirm('Are you sure you want to delete this message?')) return;
      try {
          const res = await fetch(`/api/internal/chat?id=${id}`, { method: 'DELETE' });
          if (res.ok) fetchMessages();
      } catch {}
  };

  const toggleReaction = async (messageId: string, emoji: string) => {
      try {
          await fetch('/api/internal/reactions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ messageId, userId: currentUser.id, emoji })
          });
          fetchMessages();
      } catch {}
  };

  const handleAddFavorite = async (emoji: string) => {
      try {
          await fetch('/api/internal/reactions', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: currentUser.id, emoji })
          });
          fetchFavorites();
      } catch {}
  };

  const formatContent = (content: string) => {
    if (!content) return '';
    const parts = content.split(/(@\w+|#TASK-\d+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) return <span key={i} className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded-md mx-0.5">@{part.slice(1)}</span>;
      if (part.startsWith('#TASK-')) return <span key={i} className="text-indigo-600 dark:text-indigo-400 font-bold underline decoration-indigo-500/30 hover:decoration-indigo-500 cursor-pointer">#{part.slice(1)}</span>;
      return part;
    });
  };

  const threadedMessages = useMemo(() => {
      const roots: any[] = [];
      const map: Record<string, any[]> = {};
      messages.forEach(m => {
          if (m.parent_message_id) {
              if (!map[m.parent_message_id]) map[m.parent_message_id] = [];
              map[m.parent_message_id].push(m);
          } else {
              roots.push(m);
          }
      });
      return { roots, map };
  }, [messages]);

  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const anyOverlayOpen = !!previewImage || isEmojiPickerOpen || showSuggestions;

  const MessageBubble = ({ msg, isReply = false }: { msg: Message, isReply?: boolean }) => {
      const isOwn = msg.sender_id === currentUser.id;
      const isUnread = lastReadAt && msg.timestamp > lastReadAt && !isOwn;
      const isEditing = editingMessage === msg.id;
      const replies = threadedMessages.map[msg.id] || [];

      return (
          <div
            ref={msg.id === firstUnreadId ? unreadRef : null}
            className={`group relative flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${isReply ? 'ml-10 mt-2 opacity-90' : 'mt-6'} ${isUnread ? 'bg-indigo-500/5 -mx-3 px-3 py-2 rounded-2xl' : ''}`}
          >
              <Avatar name={msg.sender_name} size={isReply ? "xs" : "sm"} />
              <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{msg.sender_name}</span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-600 font-medium">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isUnread && <span className="text-[8px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-full uppercase font-bold tracking-tighter">New</span>}
                      {msg.is_edited && <span className="text-[10px] text-zinc-400 italic">(edited)</span>}
                  </div>

                  <div className="relative">
                      {isEditing ? (
                          <div className="mt-1 space-y-2">
                              <textarea value={editContent} onChange={e => setEditContent(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20" />
                              <div className="flex gap-2">
                                  <button onClick={() => handleUpdate(msg.id)} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"><Check size={12} /> Save</button>
                                  <button onClick={() => setEditingMessage(null)} className="px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg text-xs font-bold">Cancel</button>
                              </div>
                          </div>
                      ) : (
                          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed break-words whitespace-pre-wrap font-sans">
                            {formatContent(msg.content)}
                          </p>
                      )}

                      {!isEditing && (
                          <div className="mt-2 flex flex-wrap gap-1.5 min-h-[20px]">
                              {(msg.reactions || []).map((r, i) => (
                                  <button key={i} onClick={() => toggleReaction(msg.id, r.emoji)} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all ${r.me > 0 ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-600 dark:text-indigo-400' : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-indigo-500/30'}`}>
                                      <span className="text-xs">{r.emoji}</span>
                                      <span className="text-[10px] font-bold">{r.count}</span>
                                  </button>
                              ))}
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {['👍', '😲', '😊'].map(e => (
                                      <button key={e} onClick={() => toggleReaction(msg.id, e)} className="p-1 hover:scale-110 transition-transform">
                                          <span className="text-xs">{e}</span>
                                      </button>
                                  ))}
                                  <button onClick={() => { setIsEmojiPickerOpen(true); setActiveMessageId(msg.id); }} className="p-1 hover:scale-110 transition-transform text-zinc-400 hover:text-indigo-500"><Plus size={12} /></button>
                              </div>
                          </div>
                      )}
                  </div>

                  {!isReply && !isEditing && replies.map(reply => <MessageBubble key={reply.id} msg={reply} isReply={true} />)}
              </div>

              {!isEditing && (
                  <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-white dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg overflow-hidden z-10">
                     <button onClick={() => { setReplyTo(msg); inputRef.current?.focus(); }} className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"><Reply size={14} /></button>
                     {isOwn && <button onClick={() => { setEditingMessage(msg.id); setEditContent(msg.content); }} className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"><Edit2 size={14} /></button>}
                     {(isOwn || currentUser.role.includes('Admin')) && <button onClick={() => handleDelete(msg.id)} className="p-2 text-zinc-400 hover:text-red-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"><Trash2 size={14} /></button>}
                  </div>
              )}
          </div>
      );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNewMessage(val);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (val.length > 0) {
        updateTypingStatus(true);
        typingTimeoutRef.current = setTimeout(() => updateTypingStatus(false), 3000);
    } else {
        updateTypingStatus(false);
    }

    const words = val.split(' ');
    const lastWord = words[words.length - 1];
    if (lastWord.startsWith('@')) { setSuggestionType('user'); setSuggestionSearch(lastWord.slice(1).toLowerCase()); setShowSuggestions(true); }
    else if (lastWord.startsWith('#')) { setSuggestionType('task'); setSuggestionSearch(lastWord.slice(1).toLowerCase()); setShowSuggestions(true); }
    else { setShowSuggestions(false); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => { setAttachments(prev => [...prev, reader.result as string]); };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#06080D] relative overflow-hidden">
      <AnimatePresence>
        {anyOverlayOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => { setPreviewImage(null); setIsEmojiPickerOpen(false); setShowSuggestions(false); }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-10"
          >
            {previewImage && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative max-w-full max-h-full" onClick={e => e.stopPropagation()}>
                <img src={previewImage} className="max-h-[85vh] lg:max-h-[90vh] w-auto rounded-2xl shadow-2xl" alt="Preview" />
              </motion.div>
            )}
            {isEmojiPickerOpen && (
              <div onClick={e => e.stopPropagation()} className="relative bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] shadow-2xl w-full max-w-sm">
                 <div className="mb-6">
                     <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] block mb-4">Quick Linkage</span>
                     <div className="flex flex-wrap gap-3">
                        {favorites.map(f => <button key={f} onClick={() => { if (activeMessageId) toggleReaction(activeMessageId, f); else setNewMessage(prev => prev + f); setIsEmojiPickerOpen(false); }} className="text-2xl hover:scale-125 transition-transform p-2 bg-zinc-50 dark:bg-zinc-800 rounded-2xl">{f}</button>)}
                     </div>
                 </div>
                 <div className="h-[350px] overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    <EmojiPicker
                      width="100%" height="100%"
                      onEmojiClick={(e) => {
                          if (activeMessageId) { toggleReaction(activeMessageId, e.emoji); handleAddFavorite(e.emoji); }
                          else { setNewMessage(prev => prev + e.emoji); handleAddFavorite(e.emoji); }
                          setIsEmojiPickerOpen(false);
                      }}
                      theme={document.documentElement.classList.contains('dark') ? 'dark' as any : 'light' as any}
                    />
                 </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8">
        {threadedMessages.roots.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
      </div>

      <div className="px-8 py-2 min-h-[24px]">
          <AnimatePresence>
              {Object.keys(typingUsers).length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold italic flex items-center gap-2">
                      <div className="flex gap-0.5"><div className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce" /><div className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]" /><div className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]" /></div>
                      {Object.values(typingUsers).join(', ')} is typing...
                  </motion.div>
              )}
          </AnimatePresence>
      </div>

      <div className="p-4 lg:p-8 bg-zinc-50 dark:bg-[#0B101A] border-t border-zinc-200 dark:border-zinc-800/50 relative">
        <AnimatePresence>
          {showJumpToBottom && (
              <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} onClick={jumpToBottom} className="absolute -top-12 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold hover:bg-indigo-500 transition-all z-20">
                  <ChevronDown size={14} /> {newMessagesCount} New Messages
              </motion.button>
          )}
        </AnimatePresence>

        {replyTo && (
            <div className="mb-4 bg-indigo-500/5 border-l-4 border-indigo-600 p-4 rounded-r-2xl flex items-center justify-between">
                <div className="min-w-0">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">Replying to {replyTo.sender_name}</span>
                    <p className="text-xs text-zinc-500 truncate">{replyTo.content}</p>
                </div>
                <button onClick={() => setReplyTo(null)} className="p-1 text-zinc-400 hover:text-zinc-900 transition-colors"><XIcon size={16} /></button>
            </div>
        )}

        <form onSubmit={handleSend} className="bg-white dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800 rounded-[2rem] overflow-hidden shadow-2xl transition-all focus-within:ring-2 focus-within:ring-indigo-500/20">
          {attachments.length > 0 && (
            <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-2">
              {attachments.map((at, i) => (
                <div key={i} className="relative group">
                  <img src={at} className="w-16 h-16 rounded-xl object-cover border border-zinc-200 dark:border-zinc-800" alt="Preview" />
                  <button type="button" onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} className="absolute -top-1.5 -right-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><XIcon size={10} /></button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-end gap-2 p-3">
            <div className="flex items-center gap-1 pb-1">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2.5 text-zinc-400 hover:text-indigo-600 transition-colors"><Paperclip size={20} /></button>
              <button type="button" onClick={() => { setIsEmojiPickerOpen(!isEmojiPickerOpen); setActiveMessageId(null); }} className="p-2.5 text-zinc-400 hover:text-amber-500 transition-colors"><Smile size={20} /></button>
            </div>
            <textarea ref={inputRef} rows={1} value={newMessage} onChange={handleInputChange} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Broadcast a directive..." className="flex-1 bg-transparent border-none py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-300 dark:placeholder-zinc-700 focus:ring-0 resize-none font-sans min-h-[44px] max-h-[200px] custom-scrollbar" />
            <button type="submit" disabled={!newMessage.trim() && attachments.length === 0} className="p-3.5 bg-indigo-600 text-white rounded-2xl shadow-lg hover:bg-indigo-500 active:scale-95 transition-all"><Send size={20} /></button>
          </div>
        </form>
        <input ref={fileInputRef} type="file" hidden accept="image/*" />
      </div>
    </div>
  );
};

export default SlackStream;
