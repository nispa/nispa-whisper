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
      copy: 'COPIA',
      copying: 'COPIA IN CORSO...',
      copied: 'COPIATO!',
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
    help: {
      title: 'Guida all\'uso di WhisperApp',
      intro: 'WhisperApp supporta file audio e video (MP4, MOV, WAV, MP3, ecc.). Il file viene elaborato localmente sulla tua macchina, garantendo la massima privacy.',
      modelsTitle: '1. Caricamento e Modelli',
      modelsTiny: 'Veloce (Tiny): Modelli molto veloci, ideali per test o audio molto chiari.',
      modelsSmall: 'Small / Medium: Il miglior compromesso tra velocità e precisione. Medium è il modello consigliato per la maggior parte degli usi.',
      modelsLarge: 'Large-v3: La massima precisione possibile, ma richiede più tempo e più memoria video (VRAM).',
      editorTitle: '2. Editor e Correzioni',
      editorIntro: 'Una volta completata la trascrizione, entrerai nell\'Editor.',
      editorPoint1: 'Clicca su qualsiasi blocco di testo per modificarlo.',
      editorPoint2: 'Il video/audio si sincronizzerà automaticamente con il testo selezionato.',
      editorPoint3: 'Usa la Waveform in basso a sinistra per navigare rapidamente nel file.',
      exportTitle: '3. Salvataggio ed Esportazione',
      exportIntro: 'Il tuo progetto viene salvato automaticamente nel database locale. Puoi tornare alla schermata principale e riprenderlo in seguito.',
      exportPoint1: 'Clicca su ESPORTA per scaricare il file nel formato desiderato (SRT, VTT, TXT, CSV, JSON).',
      exportPoint2: 'Usa il pulsante COPIA per copiare rapidamente l\'intera trascrizione negli appunti. Il formato JSON (MCP) è ottimizzato per essere utilizzato con servizi AI esterni (Gemini, ChatGPT, Claude) per analisi, riassunti o traduzioni. Puoi configurare le tue API Key nelle Impostazioni.',
      hardwareTitle: '5. Requisiti Hardware',
      hardwareIntro: 'L\'app utilizza l\'accelerazione GPU (CUDA) se disponibile. Per usare il modello Large-v3 è consigliata una scheda video NVIDIA con almeno 8GB di VRAM. Se la VRAM non è sufficiente, l\'app scalerà automaticamente su modelli quantizzati (int8) o sulla CPU.',
      close: 'Chiudi'
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
      copy: 'COPY',
      copying: 'COPYING...',
      copied: 'COPIED!',
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
    help: {
      title: 'WhisperApp User Guide',
      intro: 'WhisperApp supports audio and video files (MP4, MOV, WAV, MP3, etc.). The file is processed locally on your machine, ensuring maximum privacy.',
      modelsTitle: '1. Upload and Models',
      modelsTiny: 'Tiny / Base: Very fast models, ideal for testing or very clear audio.',
      modelsSmall: 'Small / Medium: The best compromise between speed and precision. Medium is the recommended model for most uses.',
      modelsLarge: 'Large-v3: The maximum precision possible, but requires more time and more video memory (VRAM).',
      editorTitle: '2. Editor and Corrections',
      editorIntro: 'Once the transcription is complete, you will enter the Editor.',
      editorPoint1: 'Click on any block of text to edit it.',
      editorPoint2: 'The video/audio will automatically sync with the selected text.',
      editorPoint3: 'Use the Waveform at the bottom left to quickly navigate the file.',
      exportTitle: '3. Saving and Exporting',
      exportIntro: 'Your project is automatically saved in the local database. You can return to the main screen and resume it later.',
      exportPoint1: 'Click EXPORT to download the file in the desired format (SRT, VTT, TXT, CSV, JSON).',
      exportPoint2: 'Use the COPY button to quickly copy the entire transcription to the clipboard. The JSON (MCP) format is optimized for use with external AI services (Gemini, ChatGPT, Claude) for analysis, summaries, or translations. You can configure your API Keys in Settings.',
      hardwareTitle: '5. Hardware Requirements',
      hardwareIntro: 'The app uses GPU acceleration (CUDA) if available. To use the Large-v3 model, an NVIDIA graphics card with at least 8GB of VRAM is recommended. If VRAM is not sufficient, the app will automatically scale to quantized models (int8) or the CPU.',
      close: 'Close'
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
