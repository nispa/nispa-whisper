import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { Segment, TranscriptionJob, Project } from '../../types';
import { getProjectDetails } from '../../api';

interface EditorContextType {
  // State
  job: TranscriptionJob;
  project: Project | null;
  segments: Segment[];
  activeSegmentId: string | null;
  editingId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  seekRequest: { time: number; timestamp: number } | null;
  loading: boolean;
  isSaving: boolean;
  modifiedIds: Set<string>;
  mediaError: boolean;
  isUploading: boolean;
  mediaUpdated: number;

  // Actions
  setSegments: (segments: Segment[]) => void;
  setActiveSegmentId: (id: string | null) => void;
  setEditingId: (id: string | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;

  // Business Logic
  handleTextChange: (id: string, newText: string) => void;
  handleSeek: (time: number) => void;
  togglePlay: () => void;
  saveProject: () => Promise<void>;
  setMediaError: (error: boolean) => void;
  reuploadMediaFile: (file: File) => Promise<void>;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({
  children,
  job,
  initialSegments
}: {
  children: React.ReactNode;
  job: TranscriptionJob;
  initialSegments: Segment[]
}) {
  const [project, setProject] = useState<Project | null>(null);
  const [segments, setSegmentsState] = useState<Segment[]>(initialSegments);
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modifiedIds, setModifiedIds] = useState<Set<string>>(new Set());

  const [mediaError, setMediaError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [mediaUpdated, setMediaUpdated] = useState(Date.now());
  const [seekRequest, setSeekRequest] = useState<{ time: number; timestamp: number } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (job.id) {
      import('../../api').then(({ getProjectDetails }) => {
        getProjectDetails(job.id!).then(data => {
          setProject(data);
          if (initialSegments.length === 0) {
            setSegmentsState(data.segments || []);
          }
          setLoading(false);
        }).catch(e => {
          console.error("Errore caricamento progetto:", e);
          setLoading(false);
        });
      });
    } else {
      setLoading(false);
    }
  }, [job.id]);

  const handleTextChange = useCallback((id: string, newText: string) => {
    setSegmentsState(prev => prev.map(s => s.id === id ? { ...s, text: newText } : s));
    setModifiedIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const handleSeek = (time: number) => {
    setSeekRequest({ time, timestamp: Date.now() });
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const saveProject = async () => {
    if (!job.id) return;
    setIsSaving(true);
    try {
      const { saveProjectSegments } = await import('../../api');
      await saveProjectSegments(job.id, segments);
      setModifiedIds(new Set()); // Reset labels modificato
      alert("Progetto salvato con successo!");
    } catch (e) {
      console.error(e);
      alert("Errore durante il salvataggio.");
    } finally {
      setIsSaving(false);
    }
  };

  const reuploadMediaFile = async (file: File) => {
    if (!job.id) return;
    setIsUploading(true);
    try {
      const { reuploadMedia } = await import('../../api');
      await reuploadMedia(job.id, file);
      setMediaError(false);
      setMediaUpdated(Date.now());
      // Trigger update is handled via mediaUpdated propagating down
    } catch (err: any) {
      alert(err.message || "Errore durante il caricamento del file.");
    } finally {
      setIsUploading(false);
    }
  };

  const value = {
    job,
    project,
    segments,
    activeSegmentId,
    editingId,
    isPlaying,
    currentTime,
    duration,
    seekRequest,
    loading,
    isSaving,
    modifiedIds,
    mediaError,
    isUploading,
    mediaUpdated,
    setSegments: setSegmentsState,
    setActiveSegmentId,
    setEditingId,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    handleTextChange,
    handleSeek,
    togglePlay,
    saveProject,
    setMediaError,
    reuploadMediaFile
  };

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
