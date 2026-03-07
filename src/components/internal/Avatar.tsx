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
    md: 'w-11 h-11 text-sm'
  }[size];

  return (
    <div className="relative flex-shrink-0 flex items-center justify-center">
      <div className={`${sizeClasses} aspect-square bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/20 rounded-full flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 font-sans shadow-sm transition-transform hover:scale-105`}>
        {initial}
      </div>
      {isOnline !== undefined && (
        <div className={`absolute bottom-[5%] right-[5%] w-[30%] h-[30%] rounded-full border-2 border-white dark:border-[#11161D] bg-emerald-500 shadow-sm`} />
      )}
    </div>
  );
};

export default Avatar;
