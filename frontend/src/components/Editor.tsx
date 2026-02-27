import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Download, Search, Undo, Redo, MoreVertical, Edit3, SplitSquareHorizontal, Merge } from 'lucide-react';
import { TranscriptionJob, Segment } from '../types';
import { exportTranscription, getProjectDetails, API_BASE, reuploadMedia } from '../api';

interface EditorProps {
  job: TranscriptionJob;
  segments: Segment[];
  onBack: () => void;
  t: (key: string) => string;
}

export default function Editor({ job, segments: initialSegments, onBack, t }: EditorProps) {
  const [segments, setSegments] = useState<Segment[]>(initialSegments);
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [loading, setLoading] = useState(initialSegments.length === 0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [mediaError, setMediaError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReupload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !job.id) return;
    
    setIsUploading(true);
    try {
      await reuploadMedia(job.id, file);
      setMediaError(false);
      // Force video reload
      if (videoRef.current) {
        videoRef.current.load();
      }
    } catch (err: any) {
      alert(err.message || "Errore durante il caricamento del file.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const [history, setHistory] = useState<Segment[][]>([initialSegments]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const updateSegments = (newSegments: Segment[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newSegments);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setSegments(newSegments);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSegments(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSegments(history[historyIndex + 1]);
    }
  };

  useEffect(() => {
    if (initialSegments.length === 0 && job.id) {
      getProjectDetails(job.id).then(data => {
        setSegments(data.segments || []);
        setLoading(false);
      }).catch(e => {
        console.error(e);
        setLoading(false);
      });
    }
  }, [job.id, initialSegments]);

  useEffect(() => {
    if (editingId && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
      textareaRef.current.focus();
    }
  }, [editingId, segments]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      
      // Auto-scroll and highlight active segment
      const currentSegment = segments.find(s => video.currentTime >= s.start && video.currentTime <= s.end);
      if (currentSegment && currentSegment.id !== activeSegmentId && isPlaying) {
        setActiveSegmentId(currentSegment.id);
        // Scroll to segment
        const el = document.getElementById(`segment-${currentSegment.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [segments, activeSegmentId, isPlaying]);

  const handleSegmentClick = (segment: Segment) => {
    setActiveSegmentId(segment.id);
    if (videoRef.current) {
      videoRef.current.currentTime = segment.start;
      if (!isPlaying) {
        videoRef.current.play();
      }
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleTextChange = (id: string, newText: string) => {
    setSegments(segments.map(s => s.id === id ? { ...s, text: newText } : s));
  };

  const handleTextBlur = () => {
    if (historyIndex === 0 || JSON.stringify(segments) !== JSON.stringify(history[historyIndex])) {
      updateSegments(segments);
    }
    setEditingId(null);
  };

  const handleSpeakerChange = (id: string, newSpeaker: string) => {
    setSegments(segments.map(s => s.id === id ? { ...s, speaker: newSpeaker } : s));
  };

  const handleSpeakerBlur = () => {
    if (historyIndex === 0 || JSON.stringify(segments) !== JSON.stringify(history[historyIndex])) {
      updateSegments(segments);
    }
  };

  const handleSplitSegment = (id: string) => {
    const index = segments.findIndex(s => s.id === id);
    if (index === -1) return;
    
    const segment = segments[index];
    const duration = segment.end - segment.start;
    const midPoint = segment.start + (duration / 2);
    
    const words = segment.text.split(' ');
    const midWord = Math.floor(words.length / 2);
    
    const text1 = words.slice(0, midWord).join(' ');
    const text2 = words.slice(midWord).join(' ');
    
    const newSegment1: Segment = {
      ...segment,
      end: midPoint,
      text: text1
    };
    
    const newSegment2: Segment = {
      ...segment,
      id: Date.now().toString(),
      start: midPoint,
      text: text2
    };
    
    const newSegments = [
      ...segments.slice(0, index),
      newSegment1,
      newSegment2,
      ...segments.slice(index + 1)
    ];
    
    updateSegments(newSegments);
  };

  const handleMergeSegment = (id: string) => {
    const index = segments.findIndex(s => s.id === id);
    if (index === -1 || index === segments.length - 1) return;
    
    const segment1 = segments[index];
    const segment2 = segments[index + 1];
    
    const newSegment: Segment = {
      ...segment1,
      end: segment2.end,
      text: `${segment1.text} ${segment2.text}`
    };
    
    const newSegments = [
      ...segments.slice(0, index),
      newSegment,
      ...segments.slice(index + 2)
    ];
    
    updateSegments(newSegments);
    
    if (activeSegmentId === segment2.id) {
      setActiveSegmentId(segment1.id);
    }
  };

  const [exportFormat, setExportFormat] = useState('srt');
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');

  const handleReplaceAll = () => {
    if (!searchQuery) return;
    
    let hasChanges = false;
    const newSegments = segments.map(s => {
      if (s.text.includes(searchQuery)) {
        hasChanges = true;
        return { ...s, text: s.text.split(searchQuery).join(replaceQuery) };
      }
      return s;
    });
    
    if (hasChanges) {
      updateSegments(newSegments);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger hotkeys if user is typing in the search bar
      if (e.target instanceof HTMLInputElement) return;

      if (e.key === 'Tab') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  const handleExport = async () => {
    if (!job.id) return;
    setIsExporting(true);
    try {
      const data = await exportTranscription(job.id, exportFormat, job.diarization);
      
      // Create a blob and download it
      const blob = new Blob([data.content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${job.file?.name || 'transcription'}.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      alert("Errore durante l'esportazione.");
    } finally {
      setIsExporting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-[#141414] overflow-hidden">
      {/* Toolbar */}
      <div className="h-14 bg-[#1e1e1e] border-b border-gray-800 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-400 hover:text-white font-medium text-sm transition-colors flex items-center gap-2">
            <span className="text-lg leading-none mb-0.5">←</span> {t('app.projects')}
          </button>
          <div className="h-6 w-px bg-gray-700 mx-2" />
          <div className="flex items-center gap-1">
            <button 
              onClick={handleUndo}
              disabled={historyIndex === 0}
              className="p-2 hover:bg-gray-800 rounded-md text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent" 
              title="Undo"
            >
              <Undo size={18} />
            </button>
            <button 
              onClick={handleRedo}
              disabled={historyIndex === history.length - 1}
              className="p-2 hover:bg-gray-800 rounded-md text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent" 
              title="Redo"
            >
              <Redo size={18} />
            </button>
          </div>
          <div className="h-6 w-px bg-gray-700 mx-2" />
          <div className="relative flex items-center gap-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('editor.findReplace')} 
                className="bg-gray-900 border border-gray-700 text-sm text-white rounded-md pl-9 pr-4 py-2 w-64 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
            {searchQuery && (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-200">
                <input 
                  type="text" 
                  value={replaceQuery}
                  onChange={(e) => setReplaceQuery(e.target.value)}
                  placeholder={t('editor.replaceWith')} 
                  className="bg-gray-900 border border-gray-700 text-sm text-white rounded-md px-3 py-2 w-48 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <button 
                  onClick={handleReplaceAll}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm transition-colors border border-gray-700 hover:border-gray-600 whitespace-nowrap"
                >
                  {t('editor.replaceAll')}
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-sm text-white rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="srt">SRT</option>
            <option value="vtt">VTT</option>
            <option value="txt">TXT</option>
            <option value="csv">CSV</option>
          </select>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-md font-medium text-sm transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50"
          >
            <Download size={16} />
            {isExporting ? t('editor.exporting') : t('editor.exportSrt').replace('SRT', exportFormat.toUpperCase())}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Video/Audio Player (30%) */}
        <div className="w-[30%] min-w-[320px] max-w-[400px] border-r border-gray-800 bg-[#1a1a1a] flex flex-col h-full">
          {/* Player Area */}
          <div className="aspect-video bg-black relative flex items-center justify-center group overflow-hidden">
            {mediaError ? (
              <div className="flex flex-col items-center text-gray-600 p-4 text-center">
                <Play size={48} className="opacity-50 mb-3" />
                <span className="font-mono text-sm tracking-wider text-red-400 mb-2">
                  {t('editor.mediaUnavailable')}
                </span>
                <span className="text-xs text-gray-500 max-w-[250px] mb-4">
                  {t('editor.mediaUnavailableDesc')}
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
            ) : job.file instanceof File && job.file.type.startsWith('video') ? (
              <video 
                ref={videoRef}
                className="w-full h-full object-contain" 
                src={URL.createObjectURL(job.file)} 
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={() => setMediaError(true)}
              />
            ) : job.id ? (
              <video 
                ref={videoRef}
                className="w-full h-full object-contain" 
                src={`${API_BASE}/projects/${job.id}/media`} 
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={() => setMediaError(true)}
              />
            ) : (
              <div className="flex flex-col items-center text-gray-600">
                <Play size={48} className="opacity-50 mb-3" />
                <span className="font-mono text-sm tracking-wider">
                  {job.file instanceof File ? t('editor.audioPlayer') : t('editor.mediaUnavailable')}
                </span>
                {!(job.file instanceof File) && (
                  <span className="text-xs mt-2 text-gray-500 max-w-[200px] text-center">
                    {t('editor.mediaUnavailableDesc')}
                  </span>
                )}
                {job.file instanceof File && (
                  <video 
                    ref={videoRef}
                    className="hidden" 
                    src={URL.createObjectURL(job.file)} 
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onError={() => setMediaError(true)}
                  />
                )}
              </div>
            )}
            
            {/* Playback Controls Overlay */}
            {!mediaError && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <div className="flex items-center justify-center gap-6 text-white mb-2">
                <button 
                  className="hover:text-blue-400 transition-colors"
                  onClick={() => handleSeek(Math.max(0, (videoRef.current?.currentTime || 0) - 5))}
                >
                  <SkipBack size={24} fill="currentColor" />
                </button>
                <button 
                  className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors shadow-lg"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                </button>
                <button 
                  className="hover:text-blue-400 transition-colors"
                  onClick={() => handleSeek((videoRef.current?.currentTime || 0) + 5)}
                >
                  <SkipForward size={24} fill="currentColor" />
                </button>
              </div>
              {/* Scrubber */}
              <div 
                className="w-full h-1 bg-gray-700 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                  if (!videoRef.current || !duration) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  handleSeek(pos * duration);
                }}
              >
                <div 
                  className="h-full bg-blue-500 transition-all duration-100 ease-linear" 
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
            </div>
            )}
          </div>

          {/* Waveform Area */}
          <div 
            className="h-32 bg-[#141414] border-b border-gray-800 relative p-4 flex flex-col justify-end cursor-pointer"
            onClick={(e) => {
              if (!videoRef.current || !duration) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              handleSeek(pos * duration);
            }}
          >
            <div className="absolute top-3 left-3 text-[10px] font-mono text-gray-500 uppercase tracking-widest">{t('editor.waveform')}</div>
            {/* Generated Waveform based on segments */}
            <div className="w-full h-16 flex items-end gap-[1px] opacity-70">
              {Array.from({ length: 80 }).map((_, i) => {
                const barTime = duration > 0 ? (i / 80) * duration : 0;
                const isSpeech = segments.some(s => barTime >= s.start && barTime <= s.end);
                // Deterministic pseudo-random height based on index
                const hash = Math.sin(i * 12.9898) * 43758.5453;
                const randomHeight = hash - Math.floor(hash);
                
                const height = isSpeech ? (randomHeight * 50 + 40) : (randomHeight * 10 + 5);
                const isPlayed = duration > 0 && barTime <= currentTime;
                
                return (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-t-sm transition-colors ${isPlayed ? 'bg-blue-500' : 'bg-gray-600'}`} 
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>
            {/* Playhead */}
            <div 
              className="absolute top-0 bottom-0 w-px bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] z-10 transition-all duration-100 ease-linear" 
              style={{ left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>

          {/* Segment Info */}
          <div className="p-6 flex-1 overflow-y-auto bg-[#1a1a1a]">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">{t('editor.segmentDetails')}</h3>
            {activeSegmentId ? (
              <div className="space-y-5">
                <div className="flex justify-between items-center text-sm border-b border-gray-800 pb-3">
                  <span className="text-gray-500">{t('editor.start')}</span>
                  <span className="font-mono text-gray-200 bg-gray-900 px-2 py-1 rounded">{formatTime(segments.find(s => s.id === activeSegmentId)?.start || 0)}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-gray-800 pb-3">
                  <span className="text-gray-500">{t('editor.end')}</span>
                  <span className="font-mono text-gray-200 bg-gray-900 px-2 py-1 rounded">{formatTime(segments.find(s => s.id === activeSegmentId)?.end || 0)}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-gray-800 pb-3">
                  <span className="text-gray-500">{t('editor.duration')}</span>
                  <span className="font-mono text-blue-400 font-medium">
                    {((segments.find(s => s.id === activeSegmentId)?.end || 0) - (segments.find(s => s.id === activeSegmentId)?.start || 0)).toFixed(2)}s
                  </span>
                </div>
                <div className="pt-6 flex gap-3">
                  <button 
                    onClick={() => handleSplitSegment(activeSegmentId)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 rounded-lg text-sm font-medium transition-colors border border-gray-700 hover:border-gray-600"
                  >
                    <SplitSquareHorizontal size={16} /> {t('editor.split')}
                  </button>
                  <button 
                    onClick={() => handleMergeSegment(activeSegmentId)}
                    disabled={segments.findIndex(s => s.id === activeSegmentId) === segments.length - 1}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 rounded-lg text-sm font-medium transition-colors border border-gray-700 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Merge size={16} /> {t('editor.merge')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center px-4">
                <p className="text-sm text-gray-600">{t('editor.selectSegment')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Transcript Editor (70%) */}
        <div className="flex-1 bg-[#141414] overflow-y-auto p-8 lg:p-12 h-full">
          <div className="max-w-4xl mx-auto space-y-3">
            {segments.map((segment, index) => (
              <div 
                key={segment.id}
                id={`segment-${segment.id}`}
                className={`flex gap-6 p-5 rounded-xl border transition-all cursor-text group relative
                  ${activeSegmentId === segment.id 
                    ? 'bg-[#1e1e1e] border-gray-700 shadow-xl' 
                    : 'bg-transparent border-transparent hover:bg-gray-800/40'}`}
                onClick={() => handleSegmentClick(segment)}
              >
                {/* Left: Metadata */}
                <div className="w-36 shrink-0 flex flex-col gap-2 select-none pt-1">
                  <span className="text-xs font-mono text-gray-500 bg-gray-900/50 px-2 py-1 rounded w-fit">
                    [{index + 1}] {formatTime(segment.start).slice(3, 8)}
                  </span>
                  
                  {job.diarization ? (
                    <input 
                      type="text"
                      value={segment.speaker}
                      onChange={(e) => handleSpeakerChange(segment.id, e.target.value)}
                      onBlur={handleSpeakerBlur}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSpeakerBlur();
                        }
                      }}
                      className={`text-xs font-bold uppercase tracking-wider bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none transition-colors w-full pb-1
                        ${segment.speaker.includes('1') ? 'text-blue-400' : 'text-emerald-400'}`}
                    />
                  ) : (
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-600 pb-1">{t('editor.text')}</span>
                  )}
                </div>

                {/* Right: Text Content */}
                <div className="flex-1 relative">
                  {editingId === segment.id ? (
                    <textarea
                      ref={textareaRef}
                      value={segment.text}
                      onChange={(e) => {
                        handleTextChange(segment.id, e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                      }}
                      onBlur={handleTextBlur}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleTextBlur();
                        }
                        if (e.key === 'Escape') {
                          handleTextBlur();
                        }
                      }}
                      className="w-full bg-gray-900 border border-blue-500 rounded-lg p-3 text-gray-200 font-serif text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none overflow-hidden shadow-inner"
                      rows={1}
                    />
                  ) : (
                    <div 
                      className="text-gray-300 font-serif text-lg leading-relaxed hover:text-white transition-colors py-2 px-1 rounded hover:bg-gray-800/50 cursor-text"
                      onClick={() => setEditingId(segment.id)}
                    >
                      {segment.text}
                    </div>
                  )}

                  {/* Hover Actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-[#2a2a2a] rounded-lg shadow-lg border border-gray-700 p-1 z-10">
                    <button 
                      className="p-1.5 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white transition-colors" 
                      title="Modifica"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(segment.id);
                      }}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button className="p-1.5 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white transition-colors" title="Opzioni">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
