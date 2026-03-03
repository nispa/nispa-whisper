import React from 'react';

interface LanguageSelectorProps {
  language: string;
  onLanguageChange: (lang: string) => void;
  t: (key: string) => string;
}

export default function LanguageSelector({ language, onLanguageChange, t }: LanguageSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{t('setup.language')}</label>
      <select 
        value={language}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
      >
        <option value="auto">{t('setup.autoDetect')}</option>
        <option value="it">Italiano</option>
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="es">Español</option>
        <option value="de">Deutsch</option>
      </select>
    </div>
  );
}
