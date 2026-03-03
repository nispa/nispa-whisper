import React from 'react';
import { Play } from 'lucide-react';
import { TranscriptionJob } from '../../types';

interface SidebarInfoProps {
  job: TranscriptionJob;
  t: (key: string) => string;
}

export default function SidebarInfo({ job, t }: SidebarInfoProps) {
  return (
    <div className="w-[30%] border-r border-gray-800 bg-[#1a1a1a] flex flex-col">
      {/* Video Player Preview */}
      <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
        {job.file instanceof File && job.file.type.startsWith('video') ? (
          <video 
            className="w-full h-full object-contain" 
            src={URL.createObjectURL(job.file)} 
            controls
          />
        ) : (
          <div className="text-gray-600 flex flex-col items-center gap-2">
            <Play size={48} className="opacity-50" />
            <span className="font-mono text-sm">{t('transcribing.videoPreview')}</span>
          </div>
        )}
      </div>

      {/* Status Info Details */}
      <div className="p-4 space-y-3 text-sm text-gray-400">
        <div className="flex justify-between">
          <span>{t('setup.uploadFile')}:</span>
          <span className="text-gray-200 truncate ml-2">{job.file?.name || 'audio.mp4'}</span>
        </div>
        <div className="flex justify-between">
          <span>{t('setup.model')}:</span>
          <span className="text-gray-200 capitalize">{job.model}</span>
        </div>
        <div className="flex justify-between">
          <span>{t('setup.language')}:</span>
          <span className="text-gray-200 capitalize">{job.language === 'auto' ? t('setup.autoDetect') : job.language}</span>
        </div>
      </div>
    </div>
  );
}
