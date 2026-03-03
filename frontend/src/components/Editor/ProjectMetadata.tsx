import React, { useState } from 'react';
import { Globe, BarChart3, FileText, Maximize2 } from 'lucide-react';
import { useEditor } from './EditorContext';
import BaseModal from '../Common/BaseModal';

interface ProjectMetadataProps {
  t: (key: string) => string;
}

export default function ProjectMetadata({ t }: ProjectMetadataProps) {
  const { project } = useEditor();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (!project) return null;

  const probability = project.language_probability 
    ? (project.language_probability * 100).toFixed(1) + '%' 
    : 'N/A';

  return (
    <div className="p-6 border-b border-gray-800 bg-[#1a1a1a]">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Metadati Trascrizione</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Globe size={14} />
            <span>Lingua Rilevata</span>
          </div>
          <span className="font-mono text-blue-400 font-medium uppercase">
            {project.detected_language || 'Auto'}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <BarChart3 size={14} />
            <span>Affidabilità Lingua</span>
          </div>
          <span className="font-mono text-gray-200">
            {probability}
          </span>
        </div>

        {project.full_text && (
          <div className="pt-2">
            <button 
              onClick={() => setIsPreviewOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg text-xs font-medium transition-all border border-gray-700 hover:border-gray-600"
            >
              <Maximize2 size={12} />
              VISUALIZZA TESTO COMPLETO
            </button>
          </div>
        )}
      </div>

      {/* Modal Anteprima Testo Completo */}
      <BaseModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Anteprima Testo Completo"
        icon={<FileText size={20} />}
        maxWidth="max-w-3xl"
        footer={
          <div className="flex justify-end">
            <button 
              onClick={() => setIsPreviewOpen(false)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Chiudi
            </button>
          </div>
        }
      >
        <div className="bg-black/20 rounded-xl p-6 font-serif text-lg leading-relaxed text-gray-300 whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
          {project.full_text}
        </div>
      </BaseModal>
    </div>
  );
}
