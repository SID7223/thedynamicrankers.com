import React from 'react';
import { Activity } from 'lucide-react';

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
  const onlineCount = safeOperatives.filter(u => u.is_online).length;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 rounded-full border border-zinc-700/50">
        <Activity className={`w-3 h-3 ${status === 'stable' ? 'text-emerald-500' : 'text-amber-500 animate-pulse'}`} />
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          {status === 'stable' ? 'Link: Stable' : 'Connecting...'}
        </span>
      </div>

      <div className="flex -space-x-2">
        {safeOperatives.slice(0, 3).map((op) => (
          <div
            key={op.id}
            className={`w-6 h-6 rounded-full border-2 border-[#06080D] flex items-center justify-center text-[8px] font-bold ${op.is_online ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}
            title={`${op.username} (${op.is_online ? 'Online' : 'Offline'})`}
          >
            {op.username?.[0]?.toUpperCase()}
          </div>
        ))}
        {safeOperatives.length > 3 && (
          <div className="w-6 h-6 rounded-full border-2 border-[#06080D] bg-zinc-900 flex items-center justify-center text-[8px] font-bold text-zinc-500">
            +{safeOperatives.length - 3}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
        <span className="text-[10px] font-bold text-white uppercase tracking-widest">{onlineCount || 1} Online</span>
      </div>
    </div>
  );
};

export default PresenceIndicator;
