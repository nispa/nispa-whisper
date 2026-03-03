import React from 'react';
import { FileAudio, Settings2, Edit3, Download, Cpu } from 'lucide-react';

export interface HelpSectionConfig {
  id: string;
  titleKey: string;
  icon: React.ReactNode;
  colorClass: string;
  content: {
    introKey?: string;
    listKeys?: string[];
    noteKey?: string;
    paragraphs?: string[];
  };
}

export const helpConfig: HelpSectionConfig[] = [
  {
    id: 'models',
    titleKey: 'help.modelsTitle',
    icon: <FileAudio size={20} />,
    colorClass: 'text-blue-400',
    content: {
      introKey: 'help.intro',
      listKeys: ['help.modelsTiny', 'help.modelsSmall', 'help.modelsLarge']
    }
  },
  {
    id: 'diarization',
    titleKey: 'help.diarizationTitle',
    icon: <Settings2 size={20} />,
    colorClass: 'text-emerald-400',
    content: {
      introKey: 'help.diarizationIntro',
      noteKey: 'help.diarizationNote'
    }
  },
  {
    id: 'editor',
    titleKey: 'help.editorTitle',
    icon: <Edit3 size={20} />,
    colorClass: 'text-amber-400',
    content: {
      introKey: 'help.editorIntro',
      listKeys: ['help.editorPoint1', 'help.editorPoint2', 'help.editorPoint3', 'help.editorPoint4']
    }
  },
  {
    id: 'export',
    titleKey: 'help.exportTitle',
    icon: <Download size={20} />,
    colorClass: 'text-purple-400',
    content: {
      introKey: 'help.exportIntro',
      paragraphs: ['help.exportPoint1', 'help.exportPoint2']
    }
  },
  {
    id: 'hardware',
    titleKey: 'help.hardwareTitle',
    icon: <Cpu size={20} />,
    colorClass: 'text-red-400',
    content: {
      paragraphs: ['help.hardwareIntro']
    }
  }
];
