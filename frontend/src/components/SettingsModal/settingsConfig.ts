export interface SettingOption {
  value: string;
  labelKey: string;
}

export interface SettingFieldConfig {
  id: string;
  type: 'select' | 'text' | 'password';
  labelKey: string;
  options?: SettingOption[];
  placeholder?: string;
}

export interface SettingSectionConfig {
  id: string;
  titleKey?: string;
  fields: SettingFieldConfig[];
  colorClass?: string;
}

export const settingsConfig: SettingSectionConfig[] = [
  {
    id: 'interface',
    fields: [
      {
        id: 'interfaceLanguage',
        type: 'select',
        labelKey: 'settings.interfaceLanguage',
        options: [
          { value: 'it', labelKey: 'settings.languages.it' },
          { value: 'en', labelKey: 'settings.languages.en' }
        ]
      }
    ]
  },
  {
    id: 'transcription',
    titleKey: 'settings.transcriptionTitle',
    colorClass: 'text-blue-400',
    fields: [
      {
        id: 'defaultModel',
        type: 'select',
        labelKey: 'settings.defaultModel',
        options: [
          { value: 'tiny', labelKey: 'setup.models.tiny' },
          { value: 'base', labelKey: 'setup.models.base' },
          { value: 'small', labelKey: 'setup.models.small' },
          { value: 'medium', labelKey: 'setup.models.medium' },
          { value: 'large-v3', labelKey: 'setup.models.large' }
        ]
      },
      {
        id: 'defaultLanguage',
        type: 'select',
        labelKey: 'settings.defaultLanguage',
        options: [
          { value: 'auto', labelKey: 'setup.autoDetect' },
          { value: 'it', labelKey: 'settings.languages.it' },
          { value: 'en', labelKey: 'settings.languages.en' },
          { value: 'fr', labelKey: 'settings.languages.fr' },
          { value: 'es', labelKey: 'settings.languages.es' },
          { value: 'de', labelKey: 'settings.languages.de' }
        ]
      }
    ]
  }
];
