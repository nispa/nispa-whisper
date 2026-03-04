import React, { useMemo, useState, useEffect } from 'react';

interface TimelineSectionProps {
  progress: number;
  isError: boolean;
  t: (key: string) => string;
  logs?: string[];
}

export default function TimelineSection({ progress, isError, t, logs = [] }: TimelineSectionProps) {
  const TOTAL_BLOCKS = 250;
  const completedBlocks = Math.floor((progress / 100) * TOTAL_BLOCKS);

  const blocks = useMemo(() => Array.from({ length: TOTAL_BLOCKS }), []);
  const [activeRandomSectors, setActiveRandomSectors] = useState<number[]>([]);

  useEffect(() => {
    if (progress >= 100 || isError) {
      setActiveRandomSectors([]);
      return;
    }

    const interval = setInterval(() => {
      // Pick 1-3 random sectors ahead of the main progress to simulate "reading" ahead
      const remaining = TOTAL_BLOCKS - completedBlocks;
      if (remaining <= 0) return;

      const count = Math.min(Math.floor(Math.random() * 3) + 1, remaining);
      const newSectors = [];
      for (let i = 0; i < count; i++) {
        const sector = completedBlocks + Math.floor(Math.random() * remaining);
        newSectors.push(sector);
      }
      setActiveRandomSectors(newSectors);
    }, 100);

    return () => clearInterval(interval);
  }, [progress, completedBlocks, isError]);

  return (
    <div className="max-w-4xl mx-auto w-full mb-8 font-mono">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h3 className="text-sm font-bold text-[#55ff55] uppercase tracking-widest mb-1">
            {t('transcribing.timeline')}
          </h3>
        </div>
      </div>

      <div className="bg-[#0a0a0a] p-3 border-2 border-[#333] rounded-sm shadow-inner relative">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(12px,1fr))] gap-[2px]">
          {blocks.map((_, i) => {
            let status = 'pending';
            if (i < completedBlocks) status = 'done';
            else if (isError && i === completedBlocks) status = 'error';
            else if (i === completedBlocks && progress < 100) status = 'head';
            else if (activeRandomSectors.includes(i)) status = 'reading';

            let bgClass = 'bg-[#1a1a1a]';
            let innerText = '';

            if (status === 'done') {
              bgClass = 'bg-[#00cc00] opacity-90 shadow-[0_0_4px_rgba(0,255,0,0.4)]';
            } else if (status === 'head') {
              bgClass = 'bg-[#ffffff] animate-pulse shadow-[0_0_6px_#ffffff] z-10';
            } else if (status === 'reading') {
              bgClass = 'bg-[#cc8800]';
            } else if (status === 'error') {
              bgClass = 'bg-[#ff0000] animate-bounce';
              innerText = 'E';
            }

            return (
              <div
                key={i}
                className={`w-full aspect-square text-[7px] flex items-center justify-center rounded-[1px] transition-colors duration-75 ${bgClass}`}
              >
                {innerText && <span className="text-white font-bold">{innerText}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {logs.length > 0 && (
        <div className="mt-4 p-3 bg-[#050505] border border-[#222] rounded-sm text-[#00cc00] text-[10px] leading-relaxed opacity-80 h-24 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="truncate">&gt; {log}</div>
          ))}
          {progress < 100 && !isError && (
            <div className="animate-pulse text-white">&gt; _</div>
          )}
        </div>
      )}
    </div>
  );
}
