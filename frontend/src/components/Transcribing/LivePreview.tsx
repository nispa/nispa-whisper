import React, { useRef, useEffect } from 'react';
import { Segment } from '../../types';

interface LivePreviewProps {
  segments: Segment[];
  progress: number;
  t: (key: string) => string;
}

export default function LivePreview({ segments, progress, t }: LivePreviewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom as new segments arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [segments]);

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div 
        ref={scrollRef}
        className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 h-64 overflow-y-auto font-serif text-lg leading-relaxed text-gray-300 flex flex-col"
      >
        {segments.length === 0 && progress < 100 && (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-sm font-sans">
            {t('transcribing.waitingSegments')}
          </div>
        )}
        
        {segments.map((segment, i) => (
          <p key={i} className="mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
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
  );
}
