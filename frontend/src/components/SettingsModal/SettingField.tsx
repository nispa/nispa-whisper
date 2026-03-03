import React from 'react';
import { SettingFieldConfig } from './settingsConfig';

interface SettingFieldProps {
  config: SettingFieldConfig;
  value: string;
  onChange: (value: string) => void;
  t: (key: string) => string;
}

export default function SettingField({ config, value, onChange, t }: SettingFieldProps) {
  const baseClasses = "w-full bg-[#141414] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{t(config.labelKey)}</label>
      
      {config.type === 'select' ? (
        <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClasses}
        >
          {config.options?.map(opt => (
            <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
          ))}
        </select>
      ) : (
        <input 
          type={config.type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={config.placeholder}
          className={baseClasses}
        />
      )}
    </div>
  );
}
