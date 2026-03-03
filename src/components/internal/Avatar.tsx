import React from 'react';

interface AvatarProps {
  name?: string;
  size?: 'sm' | 'md';
}

const Avatar: React.FC<AvatarProps> = ({ name = '?', size = 'md' }) => {
  const initial = name[0]?.toUpperCase() || '?';
  const sizeClasses = size === 'sm' ? 'w-6 h-6 text-[8px]' : 'w-9 h-9 text-xs';

  return (
    <div className={`${sizeClasses} bg-indigo-600/20 border border-indigo-500/30 rounded-xl flex items-center justify-center font-bold text-indigo-400`}>
      {initial}
    </div>
  );
};

export default Avatar;
