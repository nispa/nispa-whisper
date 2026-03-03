import React from 'react';
import { FileAudio } from 'lucide-react';

interface EmptyStateProps {
  onNewProject: () => void;
  t: (key: string) => string;
}

export default function EmptyState({ onNewProject, t }: EmptyStateProps) {
  return (
    <div className="text-center py-20 bg-[#1e1e1e] border border-gray-800 rounded-xl">
      <FileAudio size={48} className="mx-auto text-gray-600 mb-4" />
      <h3 className="text-xl font-medium text-white mb-2">{t('dashboard.noProjects')}</h3>
      <p className="text-gray-400 mb-6">{t('dashboard.startFirst')}</p>
      <button 
        onClick={onNewProject}
        className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
      >
        {t('dashboard.createProject')}
      </button>
    </div>
  );
}
