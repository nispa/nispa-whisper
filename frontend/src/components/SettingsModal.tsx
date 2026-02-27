import React from 'react';
import { X, Save } from 'lucide-react';

export interface AppSettings {
  defaultModel: string;
  defaultLanguage: string;
  defaultDiarization: boolean;
  interfaceLanguage: 'it' | 'en';
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  t: (key: string) => string;
}

export default function SettingsModal({ isOpen, onClose, settings, onSave, t }: SettingsModalProps) {
  const [localSettings, setLocalSettings] = React.useState<AppSettings>(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e1e1e] border border-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Impostazioni Predefinite</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Lingua Interfaccia / Interface Language</label>
            <select 
              value={localSettings.interfaceLanguage || 'it'}
              onChange={(e) => setLocalSettings({ ...localSettings, interfaceLanguage: e.target.value as 'it' | 'en' })}
              className="w-full bg-[#141414] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="it">Italiano</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {localSettings.interfaceLanguage === 'en' ? 'Default Model' : 'Modello Predefinito'}
            </label>
            <select 
              value={localSettings.defaultModel}
              onChange={(e) => setLocalSettings({ ...localSettings, defaultModel: e.target.value })}
              className="w-full bg-[#141414] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="tiny">Veloce (Tiny)</option>
              <option value="base">Equilibrato (Base)</option>
              <option value="small">Qualità Alta (Small)</option>
              <option value="medium">Qualità Massima (Medium)</option>
              <option value="large-v3">Precisione Pro (Large-v3)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Lingua Predefinita</label>
            <select 
              value={localSettings.defaultLanguage}
              onChange={(e) => setLocalSettings({ ...localSettings, defaultLanguage: e.target.value })}
              className="w-full bg-[#141414] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="auto">Rilevamento Automatico</option>
              <option value="it">Italiano</option>
              <option value="en">Inglese</option>
              <option value="fr">Francese</option>
              <option value="es">Spagnolo</option>
              <option value="de">Tedesco</option>
            </select>
          </div>

          <div>
            <label className="flex items-center justify-between cursor-pointer p-4 bg-[#141414] border border-gray-700 rounded-lg hover:border-gray-600 transition-colors">
              <div>
                <span className="block text-sm font-medium text-gray-200">Diarization Predefinita</span>
                <span className="block text-xs text-gray-500 mt-1">Identifica i parlanti di default</span>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${localSettings.defaultDiarization ? 'bg-blue-600' : 'bg-gray-600'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${localSettings.defaultDiarization ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={localSettings.defaultDiarization}
                onChange={(e) => setLocalSettings({ ...localSettings, defaultDiarization: e.target.checked })}
              />
            </label>
          </div>
        </div>

        <div className="p-6 border-t border-gray-800 bg-[#1a1a1a] flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg font-medium text-gray-300 hover:text-white transition-colors"
          >
            Annulla
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/20"
          >
            <Save size={18} />
            Salva
          </button>
        </div>
      </div>
    </div>
  );
}
