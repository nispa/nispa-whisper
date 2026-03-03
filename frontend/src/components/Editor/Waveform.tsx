import React, { useState, useEffect } from 'react';
import { useEditor } from './EditorContext';
import { API_BASE } from '../../api';

interface WaveformProps {
  t: (key: string) => string;
}

export default function Waveform({ t }: WaveformProps) {
  const { job, currentTime, duration, handleSeek, mediaUpdated, isUploading, mediaError } = useEditor();
  const [waveform, setWaveform] = useState<number[]>([]);

  useEffect(() => {
    if (isUploading || mediaError) {
      setWaveform([]);
      return;
    }

    const generateRealWaveform = async () => {
      try {
        const url = job.file instanceof File
          ? URL.createObjectURL(job.file)
          : `${API_BASE}/projects/${job.id}/media?t=${mediaUpdated}`;

        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const rawData = audioBuffer.getChannelData(0);
        const samples = 100;
        const blockSize = Math.floor(rawData.length / samples);
        const filteredData = [];

        for (let i = 0; i < samples; i++) {
          let blockStart = blockSize * i;
          let sum = 0;
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(rawData[blockStart + j]);
          }
          filteredData.push(sum / blockSize);
        }

        const max = Math.max(...filteredData);
        setWaveform(filteredData.map(n => Math.max(0.1, n / max)));
      } catch (e) {
        console.error("Waveform error:", e);
        setWaveform(Array(100).fill(0.2));
      }
    };

    generateRealWaveform();
  }, [job.id, job.file, mediaUpdated, isUploading, mediaError]);

  return (
    <div
      className="h-32 bg-[#141414] border-b border-gray-800 relative p-4 flex flex-col justify-end cursor-pointer group/wave"
      onClick={(e) => {
        if (!duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        handleSeek(((e.clientX - rect.left) / rect.width) * duration);
      }}
    >
      <div className="absolute top-3 left-3 text-[10px] font-mono text-gray-500 uppercase tracking-widest group-hover/wave:text-blue-400 transition-colors">
        {t('editor.waveform')}
      </div>
      <div className="w-full h-16 flex items-end gap-[1px] opacity-70">
        {waveform.length > 0 ? (
          waveform.map((height, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t-sm transition-colors ${(i / waveform.length) * duration <= currentTime ? 'bg-blue-500' : 'bg-gray-600'}`}
              style={{ height: `${height * 100}%` }}
            />
          ))
        ) : (
          <div className="w-full text-center text-[10px] text-gray-700 uppercase tracking-widest pb-4">
            Analisi audio...
          </div>
        )}
      </div>
      <div className="absolute top-0 bottom-0 w-px bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" style={{ left: `${(currentTime / duration) * 100}%` }} />
    </div>
  );
}
