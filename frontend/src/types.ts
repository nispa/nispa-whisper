export type Screen = 'dashboard' | 'setup' | 'transcribing' | 'editor';

export interface Project {
  id: string;
  name: string;
  date: string;
  duration: string;
  language: string;
  speakers: number;
  thumbnail?: string;
}

export interface Segment {
  id: string;
  start: number;
  end: number;
  speaker: string;
  text: string;
}

export interface TranscriptionJob {
  id?: string;
  file: File | null;
  model: string;
  language: string;
  diarization: boolean;
  saveLocation: string;
}
