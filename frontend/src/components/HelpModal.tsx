import React from 'react';
import { X, Info, FileAudio, Settings2, Edit3, Download, Cpu } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
}

export default function HelpModal({ isOpen, onClose, t }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e1e1e] border border-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-800 shrink-0">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Info size={24} className="text-blue-500" />
            {t('help.title')}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto space-y-8 text-gray-300 leading-relaxed">
          
          <section>
            <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
              <FileAudio size={20} className="text-blue-400" />
              {t('help.modelsTitle')}
            </h3>
            <p className="mb-3">
              {t('help.intro')}
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-400">
              <li>{t('help.modelsTiny')}</li>
              <li>{t('help.modelsSmall')}</li>
              <li>{t('help.modelsLarge')}</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
              <Settings2 size={20} className="text-emerald-400" />
              {t('help.diarizationTitle')}
            </h3>
            <p className="mb-3">
              {t('help.diarizationIntro')}
            </p>
            <div className="bg-blue-900/20 border border-blue-800/50 p-4 rounded-lg text-sm text-blue-200">
              {t('help.diarizationNote')}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
              <Edit3 size={20} className="text-amber-400" />
              {t('help.editorTitle')}
            </h3>
            <p className="mb-3">
              {t('help.editorIntro')}
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-400">
              <li>{t('help.editorPoint1')}</li>
              <li>{t('help.editorPoint2')}</li>
              <li>{t('help.editorPoint3')}</li>
              <li>{t('help.editorPoint4')}</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
              <Download size={20} className="text-purple-400" />
              {t('help.exportTitle')}
            </h3>
            <p className="mb-3">
              {t('help.exportIntro')}
            </p>
            <p className="text-sm text-gray-400 mb-3">
              {t('help.exportPoint1')}
            </p>
            <p className="text-sm text-gray-400">
              {t('help.exportPoint2')}
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
              <Cpu size={20} className="text-red-400" />
              {t('help.hardwareTitle')}
            </h3>
            <p className="text-sm text-gray-400">
              {t('help.hardwareIntro')}
            </p>
          </section>

        </div>

        <div className="p-6 border-t border-gray-800 bg-[#1a1a1a] flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            {t('help.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
