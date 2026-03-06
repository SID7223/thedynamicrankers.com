import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Send,
  Paperclip,
  Smile,
  X,
  FileText,
  ChevronDown,
  CheckCheck,
  Mic,
  Square,
  Edit2,
  Check,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import Avatar from './Avatar';

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  timestamp: string;
  created_at?: string;
  attachments?: any[];
  edited?: boolean;
}

interface SlackStreamProps {
  taskId: string;
  currentUser: any;
  operatives: any[];
}

const SlackStream: React.FC<SlackStreamProps> = ({ taskId, currentUser, operatives }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editBuffer, setEditBuffer] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingInterval = useRef<any>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/internal/chat?taskId=${taskId}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Fetch Messages Failed:', err);
    }
  }, [taskId]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior });
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && attachments.length === 0) return;

    setSending(true);
    try {
      const res = await fetch('/api/internal/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          senderId: currentUser.id,
          content: input,
          attachments: attachments.map(a => ({ name: a.name, type: a.type, url: a.url }))
        })
      });

      if (res.ok) {
        setInput('');
        setAttachments([]);
        fetchMessages();
        setTimeout(() => scrollToBottom(), 100);
      }
    } catch (err) {
      console.error('Send Failed:', err);
    } finally {
      setSending(false);
    }
  };

  const handleEdit = async (msgId: string) => {
    if (!editBuffer.trim()) return;
    try {
      const res = await fetch(`/api/internal/chat?id=${msgId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editBuffer })
      });
      if (res.ok) {
        setEditingMessageId(null);
        fetchMessages();
      }
    } catch (err) {
      console.error('Edit Failed:', err);
    }
  };

  const handleDelete = async (msgId: string) => {
    if (!confirm('Delete message?')) return;
    try {
      const res = await fetch(`/api/internal/chat?id=${msgId}`, { method: 'DELETE' });
      if (res.ok) fetchMessages();
    } catch (err) {
      console.error('Delete Failed:', err);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    // In a real app, upload to S3/R2 here
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      setAttachments(prev => [...prev, { name: file.name, type: file.type, url, size: file.size }]);
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingInterval.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } catch (err) {
      console.error('Mic Access Denied:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (recordingInterval.current) clearInterval(recordingInterval.current);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#06080D] relative overflow-hidden">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
      >
        {messages.map((msg) => {
          const isOwn = msg.sender_id === currentUser.id;
          const canEdit = isOwn || currentUser.role === 'admin' || currentUser.role === 'superuser';
          const isEditing = editingMessageId === msg.id;

          return (
            <div key={msg.id} className="flex justify-start group">
              <div className="flex max-w-[85%] gap-3 flex-row items-start">
                <Avatar name={msg.sender_name} size="sm" />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100">{msg.sender_name}</span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase">{new Date(msg.timestamp || msg.created_at || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {msg.edited && <span className="text-[10px] text-zinc-400 italic">(edited)</span>}
                  </div>

                  <div className="relative group/content">
                    <div className={`px-4 py-2.5 rounded-2xl text-sm bg-zinc-100 dark:bg-[#11161D] text-zinc-900 dark:text-zinc-200 rounded-tl-none shadow-sm border border-transparent dark:border-zinc-800/50 ${isEditing ? 'ring-2 ring-indigo-500' : ''}`}>
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="space-y-3 mb-2">
                          {msg.attachments.map((att, i) => (
                            <div key={i} className="rounded-xl overflow-hidden bg-black/5 dark:bg-black/20 p-2 border border-black/5 dark:border-white/10">
                              {att.type.startsWith('image/') ? (
                                <img
                                  src={att.url}
                                  alt={att.name}
                                  className="max-w-[240px] max-h-[320px] object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => { setPreviewImage(att.url); }}
                                />
                              ) : att.type.startsWith('audio/') ? (
                                <audio src={att.url} controls className="w-full h-8" />
                              ) : (
                                <a href={att.url} download={att.name} className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-200 hover:underline">
                                  <FileText size={16} />
                                  <span className="truncate max-w-[150px]">{att.name}</span>
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {isEditing ? (
                        <div className="flex flex-col gap-2 min-w-[200px]">
                          <textarea
                            autoFocus
                            className="w-full bg-transparent border-none focus:ring-0 resize-none p-0 text-sm"
                            value={editBuffer}
                            onChange={(e) => setEditBuffer(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleEdit(msg.id);
                              }
                              if (e.key === 'Escape') setEditingMessageId(null);
                            }}
                          />
                          <div className="flex justify-end gap-2">
                             <button onClick={() => setEditingMessageId(null)} className="text-[10px] font-bold uppercase text-zinc-500">Cancel</button>
                             <button onClick={() => handleEdit(msg.id)} className="text-[10px] font-bold uppercase text-indigo-500">Save</button>
                          </div>
                        </div>
                      ) : (
                        msg.content
                      )}
                    </div>

                    {canEdit && !isEditing && (
                      <div className="absolute left-full top-0 ml-2 opacity-0 group-hover/content:opacity-100 transition-opacity flex items-center gap-1">
                        <button
                          onClick={() => { setEditingMessageId(msg.id); setEditBuffer(msg.content); }}
                          className="p-1.5 text-zinc-400 hover:text-indigo-500 transition-colors"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 lg:p-10"
            onClick={() => setPreviewImage(null)}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-6 right-6 lg:top-10 lg:right-10 w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-2xl z-[210] transition-transform hover:scale-110 active:scale-95"
            >
              <X size={24} />
            </button>

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
                className="max-h-[90vh] w-auto rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] select-none"
                alt="Preview"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 lg:p-6 bg-zinc-50 dark:bg-[#0B101A] border-t border-zinc-200 dark:border-zinc-800/50">
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4 p-3 bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800/50 shadow-sm">
            {attachments.map((att, i) => (
              <div key={i} className="relative group w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                {att.type.startsWith('image/') ? <img src={att.url} className="w-full h-full object-cover" alt="Attachment" /> : <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-500"><FileText size={24} /></div>}
                <button onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
              </div>
            ))}
            <button onClick={() => fileInputRef.current?.click()} className="w-20 h-20 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-600 hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"><Plus size={24} /></button>
          </div>
        )}
        <form onSubmit={handleSend} className="relative flex items-center gap-3">
          <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileSelect} />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0"><Paperclip size={20} /></button>
          <div className="relative flex-1">
            <input ref={inputRef} type="text" placeholder={isRecording ? "Recording voice note..." : "Transmit command data..."} className={`w-full bg-white dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800 rounded-xl px-5 py-3.5 pr-12 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm shadow-sm ${isRecording ? 'opacity-50 pointer-events-none' : ''}`} value={input} onChange={(e) => setInput(e.target.value)} />
            <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><Smile size={20} /></button>
            {showEmojiPicker && <div className="absolute bottom-full right-0 mb-4 z-[100] shadow-2xl"><EmojiPicker theme={Theme.DARK} onEmojiClick={(emojiData) => { setInput(prev => prev + emojiData.emoji); inputRef.current?.focus(); }} /></div>}
          </div>
          {isRecording ? <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /><span className="text-red-600 dark:text-red-500 font-mono text-sm">{Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}</span><button type="button" onClick={() => stopRecording()} className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white"><X size={18} /></button><button type="button" onClick={() => stopRecording()} className="text-emerald-600 dark:text-emerald-500 hover:text-emerald-500 dark:hover:text-emerald-400"><Square size={18} /></button></div> : <button type="button" onClick={startRecording} className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0"><Mic size={20} /></button>}
          <button type="submit" className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50 disabled:grayscale shrink-0" disabled={sending || isRecording}><Send size={18} /></button>
        </form>
      </div>
    </div>
  );
};

export default SlackStream;
