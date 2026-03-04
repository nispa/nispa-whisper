export type Screen = 'dashboard' | 'setup' | 'transcribing' | 'editor';

export interface Project {
  id: string;
  name: string;
  file_name?: string;
  date: string;
  duration: string;
  language: string;
  detected_language?: string;
  language_probability?: number;
  full_text?: string;
  speakers: number;
  thumbnail?: string;
  normalized?: boolean;
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
  saveLocation: string;
  normalize?: boolean;
}
