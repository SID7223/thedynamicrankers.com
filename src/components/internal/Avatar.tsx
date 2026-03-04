import React from 'react';

interface AvatarProps {
  name?: string;
  size?: 'sm' | 'md' | 'xs';
  isOnline?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ name = '?', size = 'md', isOnline }) => {
  const initial = name[0]?.toUpperCase() || '?';
  const sizeClasses = {
    xs: 'w-6 h-6 text-[8px]',
    sm: 'w-8 h-8 text-[10px]',
    md: 'w-10 h-10 text-xs'
  }[size];

  return (
    <div className="relative flex-shrink-0 group">
      <div className={`${sizeClasses} bg-indigo-600/20 border border-indigo-500/30 rounded-xl flex items-center justify-center font-bold text-indigo-400 font-sans shadow-sm transition-transform group-hover:scale-105`}>
        {initial}
      </div>
      {isOnline !== undefined && (
        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#1f1f1f] shadow-lg ${isOnline ? 'bg-emerald-500 shadow-emerald-500/40' : 'bg-zinc-600'}`} />
      )}
    </div>
  );
};

export default Avatar;
