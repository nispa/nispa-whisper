import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useEditor } from './EditorContext';
import { API_BASE } from '../../api';

interface VideoPlayerProps {
  t: (key: string) => string;
}

export default function VideoPlayer({ t }: VideoPlayerProps) {
  const {
    job,
    isPlaying,
    currentTime,
    duration,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    seekRequest,
    handleSeek,
    togglePlay,
    editingId,
    segments,
    activeSegmentId,
    setActiveSegmentId,
    mediaError,
    isUploading,
    mediaUpdated,
    setMediaError,
    reuploadMediaFile
  } = useEditor();

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isSeekingRef = useRef<boolean>(false);
  const [videoSrc, setVideoSrc] = useState<string>('');

  useEffect(() => {
    if (job.file instanceof File) {
      const url = URL.createObjectURL(job.file);
      setVideoSrc(url);
      return () => URL.revokeObjectURL(url);
    } else if (job.id) {
      setVideoSrc(`${API_BASE}/projects/${job.id}/media?t=${mediaUpdated}`);
    }
  }, [job.file, job.id, mediaUpdated]);

  const handleReupload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await reuploadMediaFile(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (isSeekingRef.current) return; // Prevent old time updates during a seek operation

      setCurrentTime(video.currentTime);

      // Logica di pausa a fine segmento durante l'editing
      if (editingId) {
        const editingSegment = segments.find(s => s.id === editingId);
        if (editingSegment && video.currentTime >= editingSegment.end) {
          video.pause();
          setIsPlaying(false);
        }
        return; // Non cambiare segmento attivo mentre editiamo
      }

      // Sincronizzazione segmento attivo e auto-scroll
      const currentSegment = segments.find(s => video.currentTime >= s.start && video.currentTime <= s.end);
      if (currentSegment && currentSegment.id !== activeSegmentId && isPlaying) {
        setActiveSegmentId(currentSegment.id);
        const el = document.getElementById(`segment-${currentSegment.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('loadedmetadata', () => setDuration(video.duration));

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, [editingId, segments, activeSegmentId, isPlaying]);

  // Sincronizza lo stato isPlaying con l'elemento video reale
  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying && videoRef.current.paused) videoRef.current.play();
    else if (!isPlaying && !videoRef.current.paused) videoRef.current.pause();
  }, [isPlaying]);

  // Gestione seek esterno
  useEffect(() => {
    if (videoRef.current && seekRequest !== null) {
      videoRef.current.currentTime = seekRequest.time;
      setCurrentTime(seekRequest.time); // Eagerly update UI
    }
  }, [seekRequest]);

  return (
    <div className="aspect-video bg-black relative flex items-center justify-center group overflow-hidden">
      {mediaError ? (
        <div className="flex flex-col items-center text-gray-400 p-4 text-center z-10 w-full bg-black/80 h-full justify-center">
          <Play size={48} className="opacity-50 mb-3" />
          <span className="font-mono text-sm tracking-wider text-red-400 mb-2">
            {t('editor.mediaUnavailable') || "Media non disponibile"}
          </span>
          <span className="text-xs text-gray-500 max-w-[300px] mb-4">
            {t('editor.mediaUnavailableDesc') || "Il file originale non è più disponibile. Caricalo di nuovo per continuare."}
          </span>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleReupload}
            className="hidden"
            accept="audio/*,video/*"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isUploading ? t('editor.uploading') || 'Caricamento...' : t('editor.reupload') || 'Ricarica File Originale'}
          </button>
        </div>
      ) : (
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          src={videoSrc}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => setMediaError(true)}
        />
      )}

      {!mediaError && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-center gap-6 text-white mb-2">
            <button onClick={() => handleSeek(Math.max(0, currentTime - 5))}><SkipBack size={24} /></button>
            <button onClick={togglePlay} className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </button>
            <button onClick={() => handleSeek(currentTime + 5)}><SkipForward size={24} /></button>
          </div>
          <div className="w-full h-1 bg-gray-700 rounded-full cursor-pointer" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            handleSeek(((e.clientX - rect.left) / rect.width) * duration);
          }}>
            <div className="h-full bg-blue-500" style={{ width: `${(currentTime / duration) * 100}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
