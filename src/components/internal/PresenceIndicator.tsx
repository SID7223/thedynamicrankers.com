import React from 'react';
import { Activity } from 'lucide-react';
import Avatar from './Avatar';

interface User {
  id: number;
  username: string;
  role: string;
  is_online?: boolean;
}

interface PresenceIndicatorProps {
  operatives: User[];
  status: 'connecting' | 'stable' | 'failed';
}

const PresenceIndicator: React.FC<PresenceIndicatorProps> = ({ operatives = [], status }) => {
  const safeOperatives = Array.isArray(operatives) ? operatives : [];
  const onlineCount = safeOperatives.filter(u => u && u.is_online).length;

  return (
    <div className="flex items-center gap-6">
      <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-zinc-800/40 rounded-full border border-zinc-700/30 shadow-inner">
        <Activity className={`w-3.5 h-3.5 ${status === 'stable' ? 'text-emerald-500' : 'text-amber-500 animate-pulse'}`} />
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em] font-sans">
          {status === 'stable' ? 'Link: Stable' : 'Connecting...'}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex -space-x-3 hover:space-x-1 transition-all">
          {safeOperatives.slice(0, 4).map((op) => op && (
            <Avatar
              key={op.id}
              name={op.username}
              size="xs"
              isOnline={op.is_online}
            />
          ))}
          {safeOperatives.length > 4 && (
            <div className="w-6 h-6 rounded-xl border-2 border-[#06080D] bg-zinc-900 flex items-center justify-center text-[8px] font-bold text-zinc-500 shadow-sm">
              +{safeOperatives.length - 4}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20 shadow-sm select-none">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-sans">{onlineCount || 1} Online</span>
        </div>
      </div>
    </div>
  );
};

export default PresenceIndicator;
