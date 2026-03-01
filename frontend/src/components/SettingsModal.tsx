import React from 'react';
import { X, Save } from 'lucide-react';
import aiModelsData from '../ai_models.json';

const aiModels = aiModelsData as Record<string, { 
  provider: string, 
  base_url: string,
  docs_models: string,
  docs_api: string,
  models: Record<string, string[]> 
}>;

export interface AppSettings {
  defaultModel: string;
  defaultLanguage: string;
  interfaceLanguage: 'it' | 'en';
  aiService?: string;
  aiApiKey?: string;
  aiModel?: string;
  aiCustomUrl?: string;
  aiMcpFormat?: string;
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

  const handleServiceChange = (service: string) => {
    const newSettings = { ...localSettings, aiService: service };
    if (service !== 'custom' && aiModels[service]) {
      newSettings.aiCustomUrl = aiModels[service].base_url;
      const categories = Object.keys(aiModels[service].models);
      if (categories.length > 0) {
        const firstCategory = categories[0];
        const models = aiModels[service].models[firstCategory];
        if (models.length > 0) {
          newSettings.aiModel = models[0];
        }
      }
    }
    setLocalSettings(newSettings);
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
        
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
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

          <div className="pt-4 border-t border-gray-800">
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">Trascrizione</h3>
            <div className="space-y-4">
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
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800">
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">Configurazione AI (Analisi)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Servizio AI</label>
                <select 
                  value={localSettings.aiService || 'gemini'}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  className="w-full bg-[#141414] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="gemini">Google Gemini</option>
                  <option value="openai">OpenAI ChatGPT</option>
                  <option value="anthropic">Anthropic Claude</option>
                  <option value="deepseek">DeepSeek</option>
                  <option value="custom">Custom MCP / API</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">API Key</label>
                <input 
                  type="password"
                  value={localSettings.aiApiKey || ''}
                  onChange={(e) => setLocalSettings({ ...localSettings, aiApiKey: e.target.value })}
                  placeholder="sk-..."
                  className="w-full bg-[#141414] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Modello AI</label>
                {localSettings.aiService === 'custom' ? (
                  <input 
                    type="text"
                    value={localSettings.aiModel || ''}
                    onChange={(e) => setLocalSettings({ ...localSettings, aiModel: e.target.value })}
                    placeholder="gemini-1.5-pro, gpt-4o, etc."
                    className="w-full bg-[#141414] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                ) : (
                  <select 
                    value={localSettings.aiModel || ''}
                    onChange={(e) => setLocalSettings({ ...localSettings, aiModel: e.target.value })}
                    className="w-full bg-[#141414] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    {Object.entries(aiModels[localSettings.aiService || 'gemini']?.models || {}).map(([category, models]) => (
                      <optgroup key={category} label={category.replace(/_/g, ' ').toUpperCase()}>
                        {models.map(model => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">API URL</label>
                <input 
                  type="text"
                  value={localSettings.aiCustomUrl || ''}
                  onChange={(e) => setLocalSettings({ ...localSettings, aiCustomUrl: e.target.value })}
                  placeholder="https://api.example.com/v1"
                  className="w-full bg-[#141414] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                />
                {localSettings.aiService !== 'custom' && aiModels[localSettings.aiService || 'gemini'] && (
                  <div className="mt-2 flex gap-4">
                    <a 
                      href={aiModels[localSettings.aiService || 'gemini'].docs_api} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 underline"
                    >
                      API Docs
                    </a>
                    <a 
                      href={aiModels[localSettings.aiService || 'gemini'].docs_models} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 underline"
                    >
                      Models Docs
                    </a>
                  </div>
                )}
              </div>

              {localSettings.aiService === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Formato MCP</label>
                  <input 
                    type="text"
                    value={localSettings.aiMcpFormat || ''}
                    onChange={(e) => setLocalSettings({ ...localSettings, aiMcpFormat: e.target.value })}
                    placeholder="mcp-1.0, custom-schema, etc."
                    className="w-full bg-[#141414] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              )}
            </div>
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
