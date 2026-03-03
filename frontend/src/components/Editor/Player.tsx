import React from 'react';
import VideoPlayer from './VideoPlayer';
import Waveform from './Waveform';
import ProjectMetadata from './ProjectMetadata';
import SegmentDetails from './SegmentDetails';

interface PlayerProps {
  t: (key: string) => string;
}

export default function Player({ t }: PlayerProps) {
  return (
    <div className="w-[30%] min-w-[320px] max-w-[400px] border-r border-gray-800 bg-[#1a1a1a] flex flex-col min-h-0">
      {/* 1. Video Player Troncone */}
      <VideoPlayer t={t} />

      {/* 2. Waveform Troncone */}
      <Waveform t={t} />

      {/* 3. Transcription Metadata (Nuovo blocco) */}
      <ProjectMetadata t={t} />

      {/* 4. Segment Details Sidebar */}
      <SegmentDetails t={t} />
    </div>
  );
}
