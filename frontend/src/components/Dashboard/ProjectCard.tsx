import React from 'react';
import { FileText, Clock, Play, Trash2 } from 'lucide-react';

interface ProjectCardProps {
  project: any;
  onDelete: (e: React.MouseEvent, id: string) => void;
  onResume: (project: any) => void;
  t: (key: string) => string;
}

export default function ProjectCard({ project: p, onDelete, onResume, t }: ProjectCardProps) {
  return (
    <div 
      onClick={() => onResume(p)}
      className="bg-[#1e1e1e] border border-gray-800 hover:border-blue-500/50 rounded-xl p-6 cursor-pointer transition-all group hover:shadow-lg hover:shadow-blue-500/10 relative"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
          <FileText size={24} />
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`text-xs font-mono px-2 py-1 rounded ${p.status === 'completed' ? 'text-green-500 bg-green-900/30' : p.status === 'failed' ? 'text-red-500 bg-red-900/30' : 'text-yellow-500 bg-yellow-900/30'}`}>
            {p.status.toUpperCase()}
          </span>
          <button 
            onClick={(e) => onDelete(e, p.id)}
            className="text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <h3 className="text-lg font-medium text-white mb-2 truncate" title={p.name || t('dashboard.unnamed')}>
        {p.name || t('dashboard.unnamed')}
      </h3>
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-1.5">
          <Clock size={14} />
          <span>{p.language === 'auto' ? t('setup.autoDetect') : p.language.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Play size={14} />
          <span>{p.model}</span>
        </div>
      </div>
    </div>
  );
}
