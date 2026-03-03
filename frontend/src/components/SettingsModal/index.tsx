import React, { useState, useEffect } from 'react';
import { Save, Settings } from 'lucide-react';
import BaseModal from '../Common/BaseModal';
import AISection from './AISection';
import SettingField from './SettingField';
import { settingsConfig } from './settingsConfig';
import aiModelsData from '../../ai_models.json';

const aiModels = aiModelsData as Record<string, { 
  provider: string, 
  base_url: string,
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
  [key: string]: any; // Allow indexing
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  t: (key: string) => string;
}

export default function SettingsModal({ isOpen, onClose, settings, onSave, t }: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  const handleServiceChange = (service: string) => {
    const newSettings = { ...localSettings, aiService: service };
    if (service !== 'custom' && aiModels[service]) {
      const categories = Object.keys(aiModels[service].models);
      if (categories.length > 0) {
        const models = aiModels[service].models[categories[0]];
        if (models.length > 0) newSettings.aiModel = models[0];
      }
    }
    setLocalSettings(newSettings);
  };

  const footer = (
    <div className="flex justify-end gap-3">
      <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-gray-300 hover:text-white transition-colors">
        Annulla
      </button>
      <button 
        onClick={() => { onSave(localSettings); onClose(); }}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg shadow-blue-600/20 transition-all"
      >
        <Save size={18} />
        Salva
      </button>
    </div>
  );

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={t('settings.title') || "Impostazioni"} 
      icon={<Settings size={24} />} 
      footer={footer}
    >
      <div className="space-y-6">
        {settingsConfig.map((section) => (
          <div key={section.id} className={section.titleKey ? "pt-4 border-t border-gray-800" : ""}>
            {section.titleKey && (
              <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${section.colorClass || "text-gray-400"}`}>
                {t(section.titleKey)}
              </h3>
            )}
            <div className="space-y-4">
              {section.fields.map(field => (
                <SettingField 
                  key={field.id}
                  config={field}
                  value={localSettings[field.id]}
                  onChange={(val) => setLocalSettings({ ...localSettings, [field.id]: val })}
                  t={t}
                />
              ))}
            </div>
          </div>
        ))}

        <AISection 
          service={localSettings.aiService || 'gemini'} 
          apiKey={localSettings.aiApiKey || ''} 
          model={localSettings.aiModel || ''}
          onServiceChange={handleServiceChange}
          onFieldChange={(field, value) => setLocalSettings({ ...localSettings, [field]: value })}
        />
      </div>
    </BaseModal>
  );
}
