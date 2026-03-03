import React from 'react';
import aiModelsData from '../../ai_models.json';

const aiModels = aiModelsData as Record<string, {
  provider: string,
  base_url: string,
  docs_models: string,
  docs_api: string,
  models: Record<string, string[]>
}>;

interface AISectionProps {
  service: string;
  apiKey: string;
  model: string;
  onServiceChange: (service: string) => void;
  onFieldChange: (field: string, value: string) => void;
}

export default function AISection({ service, apiKey, model, onServiceChange, onFieldChange }: AISectionProps) {
  return (
    <div className="pt-4 border-t border-gray-800 opacity-50 relative pointer-events-none">
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="bg-black/60 px-4 py-2 rounded-lg text-sm text-gray-300 backdrop-blur-sm border border-gray-800">
          Integrazione API in arrivo...
        </div>
      </div>
      <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">Configurazione AI</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Servizio AI</label>
          <select
            disabled
            value={service || 'gemini'}
            onChange={(e) => onServiceChange(e.target.value)}
            className="w-full bg-[#141414] border border-gray-700 text-gray-500 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 disabled:opacity-50"
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
            disabled
            value={apiKey || ''}
            onChange={(e) => onFieldChange('aiApiKey', e.target.value)}
            placeholder="sk-..."
            className="w-full bg-[#141414] border border-gray-700 text-gray-500 rounded-lg px-4 py-2.5 focus:outline-none disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Modello AI</label>
          {service === 'custom' ? (
            <input
              type="text"
              disabled
              value={model || ''}
              onChange={(e) => onFieldChange('aiModel', e.target.value)}
              placeholder="gemini-1.5-pro, etc."
              className="w-full bg-[#141414] border border-gray-700 text-gray-500 rounded-lg px-4 py-2.5 focus:outline-none disabled:opacity-50"
            />
          ) : (
            <select
              value={model || ''}
              disabled
              onChange={(e) => onFieldChange('aiModel', e.target.value)}
              className="w-full bg-[#141414] border border-gray-700 text-gray-500 rounded-lg px-4 py-2.5 focus:outline-none disabled:opacity-50"
            >
              {Object.entries(aiModels[service || 'gemini']?.models || {}).map(([category, models]) => (
                <optgroup key={category} label={category.replace(/_/g, ' ').toUpperCase()}>
                  {models.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
}
