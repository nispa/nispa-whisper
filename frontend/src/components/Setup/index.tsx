import React, { useState } from 'react';
import { Settings2, X } from 'lucide-react';
import { TranscriptionJob } from '../../types';
import { startTranscription } from '../../api';
import FileUpload from './FileUpload';
import ModelSelector from './ModelSelector';
import LanguageSelector from './LanguageSelector';
import ActionButton from './ActionButton';

interface SetupProps {
  initialJob: TranscriptionJob;
  onStart: (job: TranscriptionJob) => void;
  onCancel: () => void;
  t: (key: string) => string;
}

export default function Setup({ initialJob, onStart, onCancel, t }: SetupProps) {
  const [job, setJob] = useState<TranscriptionJob>(initialJob);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    if (!job.file) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const data = await startTranscription(job.file, job.model, job.language);
      onStart({ ...job, id: data.job_id });
    } catch (e: any) {
      const msg = e.message === 'Failed to fetch' 
        ? t('setup.connectionError')
        : e.message;
      setError(msg || t('setup.unknownError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#141414]">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-white">{t('setup.newProject')}</h2>
          <button onClick={onCancel} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: File Upload */}
          <div className="space-y-6">
            <FileUpload 
              file={job.file} 
              onFileChange={(file) => {
                setJob({ ...job, file });
                setError(null);
              }} 
              t={t} 
            />
          </div>

          {/* Right Column: Settings */}
          <div className="space-y-6">
            <div className={`bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 transition-opacity ${!job.file ? 'opacity-50 pointer-events-none' : ''}`}>
              <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                <Settings2 size={20} className="text-blue-500" />
                {t('setup.configuration')}
              </h3>

              <div className="space-y-6">
                <ModelSelector 
                  selectedModel={job.model} 
                  onModelChange={(model) => setJob({ ...job, model })} 
                  t={t} 
                />
                
                <LanguageSelector 
                  language={job.language} 
                  onLanguageChange={(language) => setJob({ ...job, language })} 
                  t={t} 
                />
              </div>
            </div>

            <ActionButton 
              isDisabled={!job.file} 
              isLoading={isSubmitting} 
              onClick={handleStart} 
              t={t} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
