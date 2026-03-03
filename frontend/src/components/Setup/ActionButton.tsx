import React from 'react';
import { Play, Loader2 } from 'lucide-react';

interface ActionButtonProps {
  isDisabled: boolean;
  isLoading: boolean;
  onClick: () => void;
  t: (key: string) => string;
}

export default function ActionButton({ isDisabled, isLoading, onClick, t }: ActionButtonProps) {
  return (
    <div className="pt-4">
      <button 
        onClick={onClick}
        disabled={isDisabled || isLoading}
        className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all
          ${!isDisabled && !isLoading
            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20' 
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
      >
        {isLoading ? (
          <Loader2 size={24} className="animate-spin" />
        ) : (
          <Play size={24} fill="currentColor" />
        )}
        {isLoading ? t('setup.starting') : t('setup.transcribe')}
      </button>
    </div>
  );
}
