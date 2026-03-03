import React from 'react';
import { EditorProvider, useEditor } from './EditorContext';
import Toolbar from './Toolbar';
import Player from './Player';
import SegmentItem from './SegmentItem';
import { TranscriptionJob, Segment } from '../../types';

interface EditorProps {
  job: TranscriptionJob;
  segments: Segment[];
  onBack: () => void;
  t: (key: string) => string;
}

function EditorContent({ onBack, t }: { onBack: () => void, t: (key: string) => string }) {
  const { segments, loading } = useEditor();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#141414] text-gray-500">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p>Caricamento trascrizione...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#141414] overflow-hidden">
      <Toolbar onBack={onBack} t={t} />
      
      <div className="flex-1 flex overflow-hidden">
        <Player t={t} />
        
        <div className="flex-1 bg-[#141414] overflow-y-auto p-8 lg:p-12 min-h-0">
          <div className="max-w-4xl mx-auto space-y-3">
            {segments.map((segment, index) => (
              <SegmentItem 
                key={segment.id} 
                segment={segment} 
                index={index} 
                t={t} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Editor(props: EditorProps) {
  return (
    <EditorProvider job={props.job} initialSegments={props.segments}>
      <EditorContent onBack={props.onBack} t={props.t} />
    </EditorProvider>
  );
}
