import React from 'react';

interface TimelineSectionProps {
  chunks: { status: 'pending' | 'processing' | 'done' | 'error' }[];
  t: (key: string) => string;
}

export default function TimelineSection({ chunks, t }: TimelineSectionProps) {
  return (
    <div className="max-w-4xl mx-auto w-full mb-8">
      <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">{t('transcribing.timeline')}</h3>
      <div className="grid grid-cols-12 gap-1">
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
    </div>
  );
}
