import React from 'react';
import { Loader2, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface ProgressSectionProps {
  progress: number;
  error: string | null;
  onCancel: () => void;
  t: (key: string) => string;
}

export default function ProgressSection({ progress, error, onCancel, t }: ProgressSectionProps) {
  return (
    <div className="max-w-3xl mx-auto w-full mb-12">
      {error ? (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 flex items-center gap-3">
          <AlertCircle size={24} />
          <div>
            <h3 className="font-bold">{t('transcribing.errorTitle')}</h3>
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-end justify-between mb-2">
            <div>
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                {progress < 100 ? (
                  <>
                    <Loader2 className="animate-spin text-blue-500" size={24} />
                    {t('transcribing.inProgress')}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="text-green-500" size={24} />
                    {t('transcribing.completed')}
                  </>
                )}
              </h2>
              <p className="text-gray-400 mt-1">
                {progress < 100 ? t('transcribing.processing') : t('transcribing.finalizing')}
              </p>
            </div>
            <div className="text-4xl font-light text-blue-400 font-mono">
              {Math.round(progress)}%
            </div>
          </div>
          
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} />
            </div>
          </div>
        </>
      )}

      <div className="mt-6 flex justify-end">
        <button 
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-medium"
        >
          <XCircle size={18} />
          {error ? t('transcribing.goBack') : t('transcribing.cancel')}
        </button>
      </div>
    </div>
  );
}
