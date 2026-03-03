import React from 'react';
import { useEditor } from './EditorContext';

interface SegmentDetailsProps {
  t: (key: string) => string;
}

export default function SegmentDetails({ t }: SegmentDetailsProps) {
  const { segments, activeSegmentId } = useEditor();
  const segment = segments.find(s => s.id === activeSegmentId);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
  };

  return (
    <div className="p-6 flex-1 overflow-y-auto bg-[#1a1a1a]">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">{t('editor.segmentDetails')}</h3>
      {segment ? (
        <div className="space-y-5">
          <div className="flex justify-between items-center text-sm border-b border-gray-800 pb-3">
            <span className="text-gray-500">{t('editor.start')}</span>
            <span className="font-mono text-gray-200 bg-gray-900 px-2 py-1 rounded">{formatTime(segment.start)}</span>
          </div>
          <div className="flex justify-between items-center text-sm border-b border-gray-800 pb-3">
            <span className="text-gray-500">{t('editor.end')}</span>
            <span className="font-mono text-gray-200 bg-gray-900 px-2 py-1 rounded">{formatTime(segment.end)}</span>
          </div>
          <div className="flex justify-between items-center text-sm border-b border-gray-800 pb-3">
            <span className="text-gray-500">{t('editor.duration')}</span>
            <span className="font-mono text-blue-400 font-medium">
              {(segment.end - segment.start).toFixed(2)}s
            </span>
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-center px-4">
          <p className="text-sm text-gray-600">{t('editor.selectSegment')}</p>
        </div>
      )}
    </div>
  );
}
