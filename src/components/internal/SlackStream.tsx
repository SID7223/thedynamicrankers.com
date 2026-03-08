import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Send, Paperclip, Smile, MoreVertical, Reply, Edit2, Trash2, X as XIcon, ChevronDown, Plus } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './Avatar';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';
import { useTaskStore } from '../../store/useTaskStore';
import { usePresenceStore } from '../../store/usePresenceStore';

interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  timestamp: string;
  parent_message_id?: string;
  reactions?: Record<string, string[]>;
  attachments?: string[];
  edited?: boolean;
}

interface SlackStreamProps {
  taskId: string;
  lastMessageTimestamp?: number;
}

const SlackStream: React.FC<SlackStreamProps> = ({ taskId, lastMessageTimestamp: externalTs }) => {
  const { session: currentUser } = useAuthStore();
  const { messages, fetchChatHistory, sendMessage, toggleReaction, editMessage, deleteMessage, updateReadReceipt, favorites, fetchFavorites, lastMessageTimestamp: storeTs } = useChatStore();
  const { operatives, tasks } = useTaskStore();
  const { typingUsers: allTypingUsers, updateMyTypingStatus } = usePresenceStore();

  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionType, setSuggestionType] = useState<'user' | 'task'>('user');
  const [suggestionSearch, setSuggestionSearch] = useState('');
  const [showJumpToBottom, setShowJumpToBottom] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const apiTaskId = taskId === '0' ? '0' : taskId;
  const currentMessages = useMemo(() => messages[apiTaskId] || [], [messages, apiTaskId]);
  const typingUsers = useMemo(() => allTypingUsers[apiTaskId] || {}, [allTypingUsers, apiTaskId]);

  useEffect(() => {
    if (currentUser) {
      fetchChatHistory(apiTaskId, currentUser.id);
      fetchFavorites(currentUser.id);
    }
  }, [apiTaskId, currentUser, fetchChatHistory, fetchFavorites]);

  useEffect(() => {
    if (externalTs || storeTs) {
      fetchChatHistory(apiTaskId, currentUser?.id || '');
    }
  }, [externalTs, storeTs, apiTaskId, currentUser, fetchChatHistory]);

  useEffect(() => {
    if (currentUser) {
      updateReadReceipt(apiTaskId, currentUser.id);
    }
  }, [apiTaskId, currentMessages.length, updateReadReceipt, currentUser]);

  const jumpToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setShowJumpToBottom(false);
      setNewMessagesCount(0);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      const isNearBottom = scrollRef.current.scrollHeight - scrollRef.current.scrollTop - scrollRef.current.clientHeight < 100;
      if (isNearBottom) jumpToBottom();
      else if (currentMessages.length > 0) {
        setShowJumpToBottom(true);
        setNewMessagesCount(prev => prev + 1);
      }
    }
  }, [currentMessages, jumpToBottom]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() && attachments.length === 0) return;

    try {
      await sendMessage({
        taskId: apiTaskId,
        senderId: currentUser.id,
        content: newMessage,
        parentMessageId: replyTo?.id,
        attachments
      });
      setNewMessage('');
      setAttachments([]);
      setReplyTo(null);
      updateMyTypingStatus(apiTaskId, currentUser.id, currentUser.username, false);
      fetchChatHistory(apiTaskId, currentUser.id);
    } catch (err) {
      console.error('Send failed:', err);
    }
  };

  const handleUpdateMessage = async (id: string) => {
    try {
      await editMessage(id, editContent, currentUser.id);
      setEditingMessage(null);
      fetchChatHistory(apiTaskId, currentUser.id);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Erase this directive from history?')) return;
    try {
      await deleteMessage(id, currentUser.id);
      fetchChatHistory(apiTaskId, currentUser.id);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const isNearBottom = scrollRef.current.scrollHeight - scrollRef.current.scrollTop - scrollRef.current.clientHeight < 100;
      if (isNearBottom) {
        setShowJumpToBottom(false);
        setNewMessagesCount(0);
      }
    }
  };

  const anyOverlayOpen = previewImage || isEmojiPickerOpen || showSuggestions;

  const threadedMessages = useMemo(() => {
    const roots = currentMessages.filter(m => !m.parent_message_id);
    const replies = currentMessages.filter(m => m.parent_message_id);
    return { roots, replies };
  }, [currentMessages]);

  const MessageBubble = ({ msg, isReply = false }: { msg: Message, isReply?: boolean }) => {
      const isOwn = msg.sender_id === currentUser.id;
      const replies = threadedMessages.replies.filter(r => r.parent_message_id === msg.id);
      const isEditing = editingMessage === msg.id;

      return (
          <div className={`group relative flex gap-4 ${isReply ? 'ml-12 mt-2' : 'mt-6'} ${isOwn ? 'bg-indigo-500/5 dark:bg-indigo-500/5' : ''} p-4 rounded-2xl transition-all`}>
              <Avatar name={msg.sender_name} size={isReply ? "xs" : "sm"} />
              <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tighter">{msg.sender_name}</span>
                      <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {msg.edited && <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase italic">(Edited)</span>}
                  </div>

                  <div className="relative">
                      {isEditing ? (
                          <div className="space-y-2">
                              <textarea
                                value={editContent}
                                onChange={e => setEditContent(e.target.value)}
                                className="w-full bg-white dark:bg-[#11161D] border border-indigo-500 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20"
                                autoFocus
                              />
                              <div className="flex gap-2">
                                  <button onClick={() => handleUpdateMessage(msg.id)} className="px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg uppercase tracking-widest">Save</button>
                                  <button onClick={() => setEditingMessage(null)} className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[10px] font-bold rounded-lg uppercase tracking-widest">Cancel</button>
                              </div>
                          </div>
                      ) : (
                          <div className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed break-words whitespace-pre-wrap font-medium">
                              {msg.content}
                          </div>
                      )}

                      {msg.attachments?.map((at, i) => (
                          <img key={i} src={at} onClick={() => setPreviewImage(at)} className="mt-3 max-w-sm rounded-xl border border-zinc-200 dark:border-zinc-800 cursor-zoom-in" alt="Attachment" />
                      ))}

                      {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                              {Object.entries(msg.reactions).map(([emoji, users]) => (
                                  <button key={emoji} onClick={() => toggleReaction(msg.id, emoji, currentUser.id).then(() => fetchChatHistory(apiTaskId, currentUser.id))} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs transition-all ${users.includes(currentUser.id) ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600' : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 text-zinc-500'}`}>
                                      <span>{emoji}</span>
                                      <span className="font-bold">{users.length}</span>
                                  </button>
                              ))}
                          </div>
                      )}

                      {!isEditing && (
                          <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-white dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg overflow-hidden z-10">
                             <button onClick={() => { setReplyTo(msg); inputRef.current?.focus(); }} className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"><Reply size={14} /></button>
                             {isOwn && <button onClick={() => { setEditingMessage(msg.id); setEditContent(msg.content); }} className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"><Edit2 size={14} /></button>}
                             {isOwn && <button onClick={() => handleDelete(msg.id)} className="p-2 text-zinc-400 hover:text-red-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"><Trash2 size={14} /></button>}
                             <button onClick={() => { setIsEmojiPickerOpen(true); setActiveMessageId(msg.id); }} className="p-2 text-zinc-400 hover:text-amber-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"><Plus size={14} /></button>
                          </div>
                      )}
                  </div>

                  {!isReply && !isEditing && replies.map(reply => <MessageBubble key={reply.id} msg={reply} isReply={true} />)}
              </div>
          </div>
      );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNewMessage(val);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (val.length > 0) {
        updateMyTypingStatus(apiTaskId, currentUser.id, currentUser.username, true);
        typingTimeoutRef.current = setTimeout(() => updateMyTypingStatus(apiTaskId, currentUser.id, currentUser.username, false), 3000);
    } else {
        updateMyTypingStatus(apiTaskId, currentUser.id, currentUser.username, false);
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
                        {['👍', '🔥', '🚀', '✅', '👀', '💯'].map(f => <button key={f} onClick={() => { if (activeMessageId) toggleReaction(activeMessageId, f, currentUser.id).then(() => fetchChatHistory(apiTaskId, currentUser.id)); else setNewMessage(prev => prev + f); setIsEmojiPickerOpen(false); }} className="text-2xl hover:scale-125 transition-transform p-2 bg-zinc-50 dark:bg-zinc-800 rounded-2xl">{f}</button>)}
                     </div>
                 </div>
                 <div className="h-[350px] overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    <EmojiPicker
                      width="100%" height="100%"
                      onEmojiClick={(e) => {
                          if (activeMessageId) { toggleReaction(activeMessageId, e.emoji, currentUser.id).then(() => fetchChatHistory(apiTaskId, currentUser.id)); }
                          else { setNewMessage(prev => prev + e.emoji); }
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
