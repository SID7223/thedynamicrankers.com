import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, CheckCheck, Plus, Paperclip, Smile, Mic, X, Square, FileText, ChevronDown } from 'lucide-react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './Avatar';

interface Attachment {
  id?: number;
  name: string;
  type: string;
  url: string;
  size?: number;
}

interface Message {
  id: number;
  task_id: number | null;
  sender_id: number;
  sender_name: string;
  content: string;
  timestamp: string;
  read_count: number;
  attachments?: Attachment[];
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
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Scroll and New Message State
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const lastMessageIdRef = useRef<number>(0);

  // Preview State
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior
      });
      setNewMessagesCount(0);
      setIsAtBottom(true);
    }
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    // Increased threshold for better detection
    const atBottom = scrollHeight - scrollTop - clientHeight < 100;
    setIsAtBottom(atBottom);
    if (atBottom) setNewMessagesCount(0);
  };

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/internal/chat?taskId=${taskId}&userId=${currentUser.id}`);
      const data = await res.json();

      const newLastId = data.length > 0 ? data[data.length - 1].id : 0;

      // If new messages arrived and we aren't at bottom
      if (lastMessageIdRef.current !== 0 && newLastId > lastMessageIdRef.current && !isAtBottom) {
        // Find how many new messages were added
        const currentCount = messages.length;
        if (data.length > currentCount) {
            setNewMessagesCount(prev => prev + (data.length - currentCount));
        }
      }

      setMessages(data);
      lastMessageIdRef.current = newLastId;
    } catch (err) {
      console.error('Chat fetch failed:', err);
    }
  }, [taskId, currentUser.id, isAtBottom, messages.length]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Initial scroll to bottom when changing tasks
  useEffect(() => {
    lastMessageIdRef.current = 0;
    setNewMessagesCount(0);
    scrollToBottom('auto');
  }, [taskId, scrollToBottom]);

  // Auto-scroll on new messages if already at bottom
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom('smooth');
    }
  }, [messages, isAtBottom, scrollToBottom]);

  // Scroll lock when previewing
  useEffect(() => {
    if (previewImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [previewImage]);

  // Auto-focus on desktop
  useEffect(() => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [taskId]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!input.trim() && attachments.length === 0) || sending) return;

    setSending(true);
    const text = input;
    const currentAttachments = [...attachments];

    setInput('');
    setAttachments([]);
    setShowEmojiPicker(false);

    try {
      await fetch('/api/internal/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          senderId: currentUser.id,
          content: text,
          attachments: currentAttachments
        })
      });
      fetchMessages();
      setIsAtBottom(true);
      scrollToBottom();
      if (window.innerWidth >= 1024) inputRef.current?.focus();
    } catch (err) {
      console.error('Send failed:', err);
    } finally {
      setSending(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachments(prev => [...prev, { name: file.name, type: file.type, size: file.size, url: reader.result as string }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setAttachments(prev => [...prev, { name: `Voice Note ${new Date().toLocaleTimeString()}`, type: 'audio/webm', url: reader.result as string }]);
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
      recordingInterval.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } catch (err) {
      console.error('Mic access denied:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
    setIsRecording(false);
    if (recordingInterval.current) clearInterval(recordingInterval.current);
  };

  // Zoom Handling
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 3));
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1f1f1f] relative overflow-hidden">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
      >
        {messages.map((msg) => {
          const isOwn = msg.sender_id === currentUser.id;
          const isRead = msg.read_count > 0;
          return (
            <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}>
              <div className={`flex max-w-[85%] gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar name={msg.sender_name} size="sm" />
                <div className="flex flex-col">
                  <div className={`px-4 py-2.5 rounded-2xl text-sm ${isOwn ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-zinc-800 text-zinc-200 rounded-tl-none'}`}>
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="space-y-3 mb-2">
                        {msg.attachments.map((att, i) => (
                          <div key={i} className="rounded-xl overflow-hidden bg-black/20 p-2 border border-white/10">
                            {att.type.startsWith('image/') ? (
                              <img
                                src={att.url}
                                alt={att.name}
                                className="max-w-[240px] max-h-[320px] object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => { setPreviewImage(att.url); setZoom(1); }}
                              />
                            ) : att.type.startsWith('audio/') ? (
                              <audio src={att.url} controls className="w-full h-8" />
                            ) : (
                              <a href={att.url} download={att.name} className="flex items-center gap-2 text-xs text-indigo-200 hover:underline">
                                <FileText size={16} />
                                <span className="truncate max-w-[150px]">{att.name}</span>
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {msg.content}
                  </div>
                  <div className={`flex items-center gap-2 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isOwn && <div className="flex"><CheckCheck size={12} className={isRead ? "text-indigo-400" : "text-zinc-600"} /></div>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Message Popup */}
      <AnimatePresence>
        {newMessagesCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="absolute bottom-24 left-1/2 z-20"
          >
            <button
              onClick={() => scrollToBottom()}
              className="bg-indigo-500/90 text-white px-5 py-2.5 rounded-full font-bold text-xs shadow-2xl backdrop-blur-md flex items-center gap-2 hover:bg-indigo-600 transition-all active:scale-95 border border-white/20"
            >
              <ChevronDown size={14} className="animate-bounce" />
              {newMessagesCount} new {newMessagesCount === 1 ? 'message' : 'messages'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 lg:p-10"
            onClick={() => setPreviewImage(null)}
            onWheel={handleWheel}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-6 right-6 lg:top-10 lg:right-10 w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-2xl z-[210] transition-transform hover:scale-110 active:scale-95"
            >
              <X size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: zoom, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={previewImage}
                className="max-h-[90vh] w-auto rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] select-none"
                style={{ cursor: 'zoom-in', pointerEvents: 'auto' }}
              />
            </motion.div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-[10px] font-bold uppercase tracking-[0.2em] pointer-events-none">
                Hold CTRL + Scroll to zoom
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 lg:p-6 bg-[#111111] border-t border-zinc-800/50">
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4 p-3 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
            {attachments.map((att, i) => (
              <div key={i} className="relative group w-20 h-20 bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700">
                {att.type.startsWith('image/') ? <img src={att.url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-500"><FileText size={24} /></div>}
                <button onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
              </div>
            ))}
            <button onClick={() => fileInputRef.current?.click()} className="w-20 h-20 rounded-xl border-2 border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 hover:border-indigo-500/50 hover:text-indigo-400 transition-all"><Plus size={24} /></button>
          </div>
        )}
        <form onSubmit={handleSend} className="relative flex items-center gap-3">
          <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileSelect} />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-zinc-500 hover:text-indigo-400 transition-colors shrink-0"><Paperclip size={20} /></button>
          <div className="relative flex-1">
            <input ref={inputRef} type="text" placeholder={isRecording ? "Recording voice note..." : "Transmit command data..."} className={`w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-3.5 pr-12 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm ${isRecording ? 'opacity-50 pointer-events-none' : ''}`} value={input} onChange={(e) => setInput(e.target.value)} />
            <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-indigo-400 transition-colors"><Smile size={20} /></button>
            {showEmojiPicker && <div className="absolute bottom-full right-0 mb-4 z-[100]"><EmojiPicker theme={Theme.DARK} onEmojiClick={(emojiData) => { setInput(prev => prev + emojiData.emoji); inputRef.current?.focus(); }} /></div>}
          </div>
          {isRecording ? <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /><span className="text-red-500 font-mono text-sm">{Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}</span><button type="button" onClick={() => stopRecording()} className="text-zinc-500 hover:text-white"><X size={18} /></button><button type="button" onClick={() => stopRecording()} className="text-emerald-500 hover:text-emerald-400"><Square size={18} /></button></div> : <button type="button" onClick={startRecording} className="p-2 text-zinc-500 hover:text-indigo-400 transition-colors shrink-0"><Mic size={20} /></button>}
          <button type="submit" className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50 disabled:grayscale shrink-0" disabled={sending || isRecording}><Send size={18} /></button>
        </form>
      </div>
    </div>
  );
};

export default SlackStream;
