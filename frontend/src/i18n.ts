export type Language = 'it' | 'en';

export const translations = {
  it: {
    app: {
      title: 'WhisperApp',
      projects: 'Progetti',
      settings: 'Impostazioni Predefinite',
      help: 'Guida all\'uso',
      gpuActive: 'Attiva',
      gpuInactive: 'Inattiva',
      vram: 'VRAM',
      queue: 'Coda',
      freeSpace: 'Liberi',
      actions: 'Azioni',
      clearCache: 'Svuota Cache',
      confirmClearCache: 'Sei sicuro di voler svuotare la cache? Questo eliminerà tutti i progetti e i file audio salvati.',
      cacheCleared: 'Cache svuotata con successo.',
    },
    dashboard: {
      recentProjects: 'Progetti Recenti',
      newProject: 'Nuovo Progetto',
      noProjects: 'Nessun progetto',
      startFirst: 'Inizia creando la tua prima trascrizione.',
      createProject: 'Crea Progetto',
      segments: 'segmenti',
      unnamed: 'Progetto Senza Nome'
    },
    setup: {
      newProject: 'Nuovo Progetto',
      uploadFile: '1. Carica File',
      dragDrop: 'Trascina un file qui o clicca per sfogliare',
      supportedFormats: 'MP4, MOV, MKV, WAV, MP3, FLAC',
      configuration: '2. Configurazione',
      model: 'Modello Whisper',
      language: 'Lingua',
      diarization: 'Identifica Parlanti (Diarization)',
      diarizationDesc: 'Assegna un nome a chi parla (Speaker 1, Speaker 2...)',
      transcribe: 'TRASCRIVI',
      starting: 'AVVIO IN CORSO...',
      autoDetect: 'Rilevamento Automatico',
      models: {
        tiny: 'Veloce (Tiny)',
        base: 'Equilibrato (Base)',
        small: 'Qualità Alta (Small)',
        medium: 'Qualità Massima (Medium)',
        large: 'Precisione Pro (Large-v3)'
      },
      modelDesc: {
        tiny: '~5 sec/min • Test rapidi',
        base: '~8 sec/min • Podcast brevi',
        small: '~15 sec/min • Interviste',
        medium: '~25 sec/min • Consigliato',
        large: '~45 sec/min • Ricerca'
      },
      connectionError: 'Errore di connessione al backend. Assicurati che Flask sia in esecuzione sulla porta 5000.',
      unknownError: 'Errore sconosciuto.'
    },
    editor: {
      exportSrt: 'ESPORTA SRT',
      exporting: 'ESPORTAZIONE...',
      findReplace: 'Trova e Sostituisci...',
      replaceWith: 'Sostituisci con...',
      replaceAll: 'Sostituisci Tutto',
      audioPlayer: 'AUDIO PLAYER',
      mediaUnavailable: 'MEDIA NON DISPONIBILE',
      mediaUnavailableDesc: 'Il file originale non è disponibile dopo il ricaricamento della pagina.',
      reupload: 'Ricarica File Originale',
      uploading: 'Caricamento...',
      waveform: 'Waveform',
      segmentDetails: 'Dettagli Segmento',
      start: 'Inizio',
      end: 'Fine',
      duration: 'Durata',
      split: 'Dividi',
      merge: 'Unisci',
      selectSegment: 'Seleziona un segmento nella timeline per vederne i dettagli e le opzioni di modifica.',
      text: 'Testo'
    },
    transcribing: {
      errorTitle: 'Errore di Trascrizione',
      inProgress: 'Trascrizione in corso...',
      completed: 'Completato!',
      processing: 'Elaborazione in corso...',
      finalizing: 'Finalizzazione...',
      goBack: 'Torna Indietro',
      cancel: 'Annulla Elaborazione',
      timeline: 'Timeline Elaborazione',
      waitingSegments: 'In attesa dei primi segmenti audio...',
      videoPreview: 'Anteprima Video',
      unknownError: 'Errore sconosciuto durante la trascrizione'
    },
    settings: {
      defaultModel: 'Modello Predefinito',
      defaultLanguage: 'Lingua Predefinita',
      defaultDiarization: 'Diarization Predefinita',
      defaultDiarizationDesc: 'Identifica i parlanti di default',
      cancel: 'Annulla',
      save: 'Salva',
      interfaceLanguage: 'Lingua Interfaccia'
    }
  },
  en: {
    app: {
      title: 'WhisperApp',
      projects: 'Projects',
      settings: 'Default Settings',
      help: 'User Guide',
      gpuActive: 'Active',
      gpuInactive: 'Inactive',
      vram: 'VRAM',
      queue: 'Queue',
      freeSpace: 'Free',
    },
    dashboard: {
      recentProjects: 'Recent Projects',
      newProject: 'New Project',
      noProjects: 'No projects',
      startFirst: 'Start by creating your first transcription.',
      createProject: 'Create Project',
      segments: 'segments',
      unnamed: 'Unnamed Project'
    },
    setup: {
      newProject: 'New Project',
      uploadFile: '1. Upload File',
      dragDrop: 'Drag a file here or click to browse',
      supportedFormats: 'MP4, MOV, MKV, WAV, MP3, FLAC',
      configuration: '2. Configuration',
      model: 'Whisper Model',
      language: 'Language',
      diarization: 'Identify Speakers (Diarization)',
      diarizationDesc: 'Assign a name to who is speaking (Speaker 1, Speaker 2...)',
      transcribe: 'TRANSCRIBE',
      starting: 'STARTING...',
      autoDetect: 'Auto Detect',
      models: {
        tiny: 'Fast (Tiny)',
        base: 'Balanced (Base)',
        small: 'High Quality (Small)',
        medium: 'Max Quality (Medium)',
        large: 'Pro Precision (Large-v3)'
      },
      modelDesc: {
        tiny: '~5 sec/min • Quick tests',
        base: '~8 sec/min • Short podcasts',
        small: '~15 sec/min • Interviews',
        medium: '~25 sec/min • Recommended',
        large: '~45 sec/min • Research'
      },
      connectionError: 'Backend connection error. Ensure Flask is running on port 5000.',
      unknownError: 'Unknown error.'
    },
    editor: {
      exportSrt: 'EXPORT SRT',
      exporting: 'EXPORTING...',
      findReplace: 'Find and Replace...',
      replaceWith: 'Replace with...',
      replaceAll: 'Replace All',
      audioPlayer: 'AUDIO PLAYER',
      mediaUnavailable: 'MEDIA UNAVAILABLE',
      mediaUnavailableDesc: 'The original file is not available after page reload.',
      reupload: 'Re-upload Original File',
      uploading: 'Uploading...',
      waveform: 'Waveform',
      segmentDetails: 'Segment Details',
      start: 'Start',
      end: 'End',
      duration: 'Duration',
      split: 'Split',
      merge: 'Merge',
      selectSegment: 'Select a segment in the timeline to see details and editing options.',
      text: 'Text'
    },
    transcribing: {
      errorTitle: 'Transcription Error',
      inProgress: 'Transcription in progress...',
      completed: 'Completed!',
      processing: 'Processing...',
      finalizing: 'Finalizing...',
      goBack: 'Go Back',
      cancel: 'Cancel Processing',
      timeline: 'Processing Timeline',
      waitingSegments: 'Waiting for first audio segments...',
      videoPreview: 'Video Preview',
      unknownError: 'Unknown error during transcription'
    },
    settings: {
      defaultModel: 'Default Model',
      defaultLanguage: 'Default Language',
      defaultDiarization: 'Default Diarization',
      defaultDiarizationDesc: 'Identify speakers by default',
      cancel: 'Cancel',
      save: 'Save',
      interfaceLanguage: 'Interface Language'
    }
  }
};

export function useTranslation(lang: Language) {
  return (key: string) => {
    const keys = key.split('.');
    let value: any = translations[lang];
    for (const k of keys) {
      if (value === undefined) break;
      value = value[k];
    }
    return value || key;
  };
}
