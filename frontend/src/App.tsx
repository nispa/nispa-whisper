import React, { useState, useEffect, useRef } from 'react';
import { Settings, HelpCircle, HardDrive, Cpu, Activity, Wrench, Trash2 } from 'lucide-react';
import { Screen, TranscriptionJob, Segment } from './types';
import Dashboard from './components/Dashboard';
import Setup from './components/Setup';
import Transcribing from './components/Transcribing';
import Editor from './components/Editor';
import SettingsModal, { AppSettings } from './components/SettingsModal';
import HelpModal from './components/HelpModal';
import { getSystemStatus, clearCache } from './api';
import { useTranslation } from './i18n';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const [systemStatus, setSystemStatus] = useState<any>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setIsActionsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClearCache = async () => {
    if (confirm(t('app.confirmClearCache') || 'Sei sicuro di voler svuotare la cache? Questo eliminerà tutti i progetti e i file audio salvati.')) {
      try {
        await clearCache();
        alert(t('app.cacheCleared') || 'Cache svuotata con successo.');
        // Reload dashboard if we are on it
        if (currentScreen === 'dashboard') {
          // A little hack to force dashboard reload
          setCurrentScreen('setup');
          setTimeout(() => setCurrentScreen('dashboard'), 10);
        } else {
          setCurrentScreen('dashboard');
        }
      } catch (e) {
        alert("Errore durante lo svuotamento della cache.");
      }
    }
    setIsActionsOpen(false);
  };
  
  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('whisper_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, interfaceLanguage: parsed.interfaceLanguage || 'it' };
      } catch (e) {}
    }
    return {
      defaultModel: 'medium',
      defaultLanguage: 'auto',
      defaultDiarization: false,
      interfaceLanguage: 'it',
    };
  });

  const t = useTranslation(appSettings.interfaceLanguage);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await getSystemStatus();
        setSystemStatus(status);
      } catch (e) {
        // Silently fail or set a disconnected state to avoid console spam
        setSystemStatus({
          gpu_available: false,
          gpu_name: 'Backend Disconnected',
          vram_mb_total: 0,
          vram_mb_free: 0,
          disk_gb_total: 0,
          disk_gb_free: 0,
          queue_length: 0
        });
      }
    };
    
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const [job, setJob] = useState<TranscriptionJob>({
    file: null,
    model: appSettings.defaultModel,
    language: appSettings.defaultLanguage,
    diarization: appSettings.defaultDiarization,
    saveLocation: './data',
  });
  
  const [segments, setSegments] = useState<Segment[]>([]);

  useEffect(() => {
    localStorage.setItem('whisper_settings', JSON.stringify(appSettings));
  }, [appSettings]);

  const handleNewProject = () => {
    // Reset job with default settings when creating a new project
    setJob({
      file: null,
      model: appSettings.defaultModel,
      language: appSettings.defaultLanguage,
      diarization: appSettings.defaultDiarization,
      saveLocation: './data',
    });
    setCurrentScreen('setup');
  };

  const handleStartTranscription = (newJob: TranscriptionJob) => {
    setJob(newJob);
    setCurrentScreen('transcribing');
  };

  const handleTranscriptionComplete = (newSegments: Segment[]) => {
    setSegments(newSegments);
    setCurrentScreen('editor');
  };

  const handleCancel = () => {
    setCurrentScreen('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#141414] text-gray-200 font-sans flex flex-col">
      {/* Top Bar */}
      <header className="h-14 bg-[#1e1e1e] border-b border-gray-800 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentScreen('dashboard')}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
            W
          </div>
          <h1 className="text-xl font-semibold text-white tracking-tight">WhisperApp</h1>
        </div>
        <div className="flex items-center gap-4 relative">
          <div className="relative" ref={actionsRef}>
            <button 
              onClick={() => setIsActionsOpen(!isActionsOpen)}
              className="p-2 hover:bg-gray-800 rounded-md transition-colors text-gray-400 hover:text-white flex items-center gap-2"
              title={t('app.actions') || 'Azioni'}
            >
              <Wrench size={20} />
            </button>
            {isActionsOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1e1e1e] border border-gray-800 rounded-lg shadow-xl z-50 overflow-hidden">
                <button 
                  onClick={handleClearCache}
                  className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-800 hover:text-red-300 flex items-center gap-2 transition-colors"
                >
                  <Trash2 size={16} />
                  {t('app.clearCache') || 'Svuota Cache'}
                </button>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:bg-gray-800 rounded-md transition-colors text-gray-400 hover:text-white"
          >
            <Settings size={20} />
          </button>
          <button 
            onClick={() => setIsHelpOpen(true)}
            className="p-2 hover:bg-gray-800 rounded-md transition-colors text-gray-400 hover:text-white"
          >
            <HelpCircle size={20} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {currentScreen === 'dashboard' && (
          <Dashboard 
            onNewProject={handleNewProject} 
            onResumeProject={(job, segments) => {
              setJob(job);
              setSegments(segments);
              setCurrentScreen('editor');
            }}
            t={t}
          />
        )}
        {currentScreen === 'setup' && <Setup initialJob={job} onStart={handleStartTranscription} onCancel={handleCancel} t={t} />}
        {currentScreen === 'transcribing' && <Transcribing job={job} onComplete={handleTranscriptionComplete} onCancel={handleCancel} t={t} />}
        {currentScreen === 'editor' && <Editor job={job} segments={segments} onBack={() => setCurrentScreen('dashboard')} t={t} />}
      </main>

      {/* Status Bar */}
      <footer className="h-8 bg-[#0a0a0a] border-t border-gray-800 flex items-center justify-between px-4 text-xs text-gray-500 shrink-0 font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Cpu size={14} className={systemStatus?.gpu_available ? "text-green-500" : "text-blue-500"} />
            <span>
              {systemStatus?.gpu_available ? 'GPU' : 'CPU'}: {systemStatus?.gpu_name || 'N/A'} 
              {' '}({systemStatus?.gpu_available ? t('app.gpuActive') : t('app.gpuInactive')})
            </span>
          </div>
          {systemStatus?.gpu_available && (
            <div className="flex items-center gap-1.5">
              <Activity size={14} />
              <span>{t('app.vram')}: {systemStatus ? Math.round((systemStatus.vram_mb_total - systemStatus.vram_mb_free) / 1024 * 10) / 10 : 0} / {systemStatus ? Math.round(systemStatus.vram_mb_total / 1024 * 10) / 10 : 0} GB</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span>{t('app.queue')}: {systemStatus?.queue_length || 0}</span>
          <div className="flex items-center gap-1.5">
            <HardDrive size={14} />
            <span>{t('app.freeSpace')}: {systemStatus?.disk_gb_free || 0} GB</span>
          </div>
        </div>
      </footer>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={appSettings}
        onSave={setAppSettings}
        t={t}
      />
      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
        t={t}
      />
    </div>
  );
}
