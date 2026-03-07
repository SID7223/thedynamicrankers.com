import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, History, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MessageHistoryPage: React.FC = () => {
    const { messageId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const session = JSON.parse(sessionStorage.getItem('dr_internal_session') || '{}');
        if (!session.id) {
            navigate('/internal');
            return;
        }

        const fetchHistory = async () => {
            try {
                const res = await fetch(`/api/internal/message_history?messageId=${messageId}&userId=${session.id}`);
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                    setCurrentIndex(json.edits.length); // Start at current content
                } else {
                    const err = await res.text();
                    setError(err);
                }
            } catch (err) {
                setError('Failed to fetch history');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [messageId, navigate]);

    if (loading) return <div className="min-h-screen bg-[#06080D] flex items-center justify-center text-zinc-500 font-bold uppercase tracking-widest text-xs">Scanning timeline...</div>;
    if (error) return <div className="min-h-screen bg-[#06080D] flex items-center justify-center text-red-500 font-bold uppercase tracking-widest text-xs">{error}</div>;

    const allVersions = [...data.edits.map((e: any) => ({ content: e.old_content, timestamp: e.edited_at, type: 'revision' })), { content: data.current_content, timestamp: data.created_at, type: 'current' }];
    const currentVersion = allVersions[currentIndex];

    return (
        <div className="min-h-screen bg-[#06080D] text-zinc-300 font-sans flex flex-col">
            <header className="p-6 border-b border-zinc-800/50 flex items-center justify-between sticky top-0 bg-[#06080D]/80 backdrop-blur-xl z-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2.5 text-zinc-400 hover:text-white bg-zinc-800/50 rounded-xl transition-all"><ChevronLeft size={20} /></button>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight">Timeline Analysis</h1>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Version {currentIndex + 1} of {allVersions.length}</p>
                    </div>
                </div>
                <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center border border-indigo-500/20 text-indigo-400"><History size={20} /></div>
            </header>

            <main className="flex-1 p-6 lg:p-12 flex flex-col items-center max-w-4xl mx-auto w-full">
                <div className="w-full mb-10 flex items-center justify-between gap-4">
                    <button
                        disabled={currentIndex === 0}
                        onClick={() => setCurrentIndex(prev => prev - 1)}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 px-6 py-4 rounded-2xl border border-zinc-700/50 transition-all disabled:opacity-30 disabled:grayscale font-bold uppercase tracking-widest text-xs"
                    >
                        <ArrowLeft size={16} /> Backward
                    </button>
                    <button
                        disabled={currentIndex === allVersions.length - 1}
                        onClick={() => setCurrentIndex(prev => prev + 1)}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 px-6 py-4 rounded-2xl border border-indigo-500/20 transition-all disabled:opacity-30 disabled:grayscale font-bold uppercase tracking-widest text-xs"
                    >
                        Forward <ArrowRight size={16} />
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-[2rem] p-8 lg:p-12 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${currentVersion.type === 'current' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
                                {currentVersion.type}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
                            <Clock size={14} />
                            <span>{new Date(currentVersion.timestamp).toLocaleString()}</span>
                        </div>

                        <div className="text-lg lg:text-2xl text-white font-medium leading-relaxed whitespace-pre-wrap font-sans">
                            {currentVersion.content}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default MessageHistoryPage;
