import React from 'react';
import { Zap, Cpu, Star, HardDrive } from 'lucide-react';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  t: (key: string) => string;
}

export default function ModelSelector({ selectedModel, onModelChange, t }: ModelSelectorProps) {
  const models = [
    { id: 'tiny', name: t('setup.models.tiny'), desc: t('setup.modelDesc.tiny'), icon: <Zap size={16} className="text-yellow-500" /> },
    { id: 'base', name: t('setup.models.base'), desc: t('setup.modelDesc.base'), icon: <Cpu size={16} className="text-blue-400" /> },
    { id: 'small', name: t('setup.models.small'), desc: t('setup.modelDesc.small'), icon: <Star size={16} className="text-purple-400" /> },
    { id: 'medium', name: t('setup.models.medium'), desc: t('setup.modelDesc.medium'), icon: <Star size={16} className="text-amber-400 fill-amber-400" /> },
    { id: 'large-v3', name: t('setup.models.large'), desc: t('setup.modelDesc.large'), icon: <HardDrive size={16} className="text-red-400" /> },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{t('setup.model')}</label>
      <div className="grid grid-cols-1 gap-2">
        {models.map((m) => (
          <div 
            key={m.id}
            onClick={() => onModelChange(m.id)}
            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors
              ${selectedModel === m.id ? 'bg-blue-600/10 border-blue-500' : 'bg-gray-800/30 border-gray-700 hover:border-gray-500'}`}
          >
            <div>
              <div className="flex items-center gap-2">
                {m.icon}
                <span className={`font-medium ${selectedModel === m.id ? 'text-blue-400' : 'text-gray-200'}`}>{m.name}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{m.desc}</p>
            </div>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
              ${selectedModel === m.id ? 'border-blue-500' : 'border-gray-600'}`}>
              {selectedModel === m.id && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
