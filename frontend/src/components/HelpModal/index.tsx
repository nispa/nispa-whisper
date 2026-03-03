import React from 'react';
import { Info } from 'lucide-react';
import BaseModal from '../Common/BaseModal';
import HelpSection from './HelpSection';
import { helpConfig } from './helpConfig';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
}

export default function HelpModal({ isOpen, onClose, t }: HelpModalProps) {
  const footer = (
    <div className="flex justify-end">
      <button 
        onClick={onClose}
        className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
      >
        {t('help.close')}
      </button>
    </div>
  );

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={t('help.title')} 
      icon={<Info size={24} />}
      footer={footer}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-8 leading-relaxed">
        {helpConfig.map((section) => (
          <HelpSection 
            key={section.id}
            title={t(section.titleKey)} 
            icon={section.icon} 
            colorClass={section.colorClass}
          >
            {section.content.introKey && <p className="mb-3">{t(section.content.introKey)}</p>}
            
            {section.content.listKeys && (
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-400">
                {section.content.listKeys.map(key => <li key={key}>{t(key)}</li>)}
              </ul>
            )}

            {section.content.paragraphs && section.content.paragraphs.map(key => (
              <p key={key} className="text-sm text-gray-400 mb-3 last:mb-0">{t(key)}</p>
            ))}

            {section.content.noteKey && (
              <div className="bg-blue-900/20 border border-blue-800/50 p-4 rounded-lg text-sm text-blue-200 mt-3">
                {t(section.content.noteKey)}
              </div>
            )}
          </HelpSection>
        ))}
      </div>
    </BaseModal>
  );
}
