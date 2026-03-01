import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, XCircle, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { TranscriptionJob, Segment } from '../types';
import { getJobStatus } from '../api';

interface TranscribingProps {
  job: TranscriptionJob;
  onComplete: (segments: Segment[]) => void;
  onCancel: () => void;
  t: (key: string) => string;
}

export default function Transcribing({ job, onComplete, onCancel, t }: TranscribingProps) {
  const [progress, setProgress] = useState(0);
  const [chunks, setChunks] = useState<{ status: 'pending' | 'processing' | 'done' | 'error' }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [liveSegments, setLiveSegments] = useState<Segment[]>([]);
  const totalChunks = 24; // Visual mock for chunks

  useEffect(() => {
    setChunks(Array(totalChunks).fill({ status: 'pending' }));

    if (!job.id) return;

    const interval = setInterval(async () => {
      try {
        const data = await getJobStatus(job.id!);
        
        const currentProgress = data.progress * 100;
        setProgress(currentProgress);
        if (data.segments) {
          setLiveSegments(data.segments);
        }
        
        // Update chunks based on progress
        const completedChunksCount = Math.floor((currentProgress / 100) * totalChunks);
        const processingChunkIndex = completedChunksCount < totalChunks ? completedChunksCount : -1;

        setChunks((prevChunks) => 
          prevChunks.map((chunk, i) => {
            if (i < completedChunksCount) return { status: 'done' };
            if (i === processingChunkIndex) return { status: 'processing' };
            return { status: 'pending' };
          })
        );

        if (data.status === 'completed') {
          clearInterval(interval);
          setTimeout(() => onComplete(data.segments), 1000);
        } else if (data.status === 'failed') {
          clearInterval(interval);
          setError(data.error || t('transcribing.unknownError'));
        }
      } catch (e: any) {
        // Don't stop on network error, might be temporary
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [job.id, onComplete]);

  const completedChunks = chunks.filter(c => c.status === 'done').length;
  // Simple ETA calculation based on progress
  const timeRemaining = progress > 0 && progress < 100 
    ? Math.ceil((100 - progress) / (progress / 10)) // very rough estimate
    : 0;

  return (
    <div className="flex-1 flex overflow-hidden bg-[#141414]">
      {/* Left Panel: Preview (30%) */}
      <div className="w-[30%] border-r border-gray-800 bg-[#1a1a1a] flex flex-col">
        {/* Video Player */}
        <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
          {job.file instanceof File && job.file.type.startsWith('video') ? (
            <video 
              className="w-full h-full object-contain" 
              src={URL.createObjectURL(job.file)} 
              controls
            />
          ) : (
            <div className="text-gray-600 flex flex-col items-center gap-2">
              <Play size={48} className="opacity-50" />
              <span className="font-mono text-sm">{t('transcribing.videoPreview')}</span>
            </div>
          )}
        </div>

        {/* Status Info */}
        <div className="p-4 space-y-3 text-sm text-gray-400">
          <div className="flex justify-between">
            <span>{t('setup.uploadFile')}:</span>
            <span className="text-gray-200 truncate ml-2">{job.file?.name || 'audio.mp4'}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('setup.model')}:</span>
            <span className="text-gray-200 capitalize">{job.model}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('setup.language')}:</span>
            <span className="text-gray-200 capitalize">{job.language === 'auto' ? t('setup.autoDetect') : job.language}</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Timeline & Progress (70%) */}
      <div className="flex-1 flex flex-col bg-[#141414] p-8">
        
        {/* Global Progress Bar */}
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

        {/* Chunking Timeline */}
        <div className="max-w-4xl mx-auto w-full">
          <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">{t('transcribing.timeline')}</h3>
          
          {/* Chunks Grid */}
          <div className="grid grid-cols-12 gap-1 mb-8">
            {chunks.map((chunk, i) => (
              <div 
                key={i} 
                className={`h-8 rounded-sm transition-colors duration-300
                  ${chunk.status === 'done' ? 'bg-green-600' : 
                    chunk.status === 'processing' ? 'bg-yellow-500 animate-pulse' : 
                    chunk.status === 'error' ? 'bg-red-500' : 
                    'bg-gray-800'}`}
              />
            ))}
          </div>

          {/* Live Transcript Preview */}
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 h-64 overflow-y-auto font-serif text-lg leading-relaxed text-gray-300 flex flex-col">
            {liveSegments.length === 0 && progress < 100 && (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-sm font-sans">
                {t('transcribing.waitingSegments')}
              </div>
            )}
            
            {liveSegments.map((segment, i) => (
              <p key={i} className="mb-4">
                {segment.text}
              </p>
            ))}
            
            {progress < 100 && progress > 0 && (
              <div className="flex items-center gap-2 text-gray-500 mt-4 animate-pulse">
                <div className="w-2 h-2 bg-gray-500 rounded-full" />
                <div className="w-2 h-2 bg-gray-500 rounded-full" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full" style={{ animationDelay: '0.4s' }} />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
