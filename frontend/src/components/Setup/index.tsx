import React, { useState } from 'react';
import { Settings2, X } from 'lucide-react';
import { TranscriptionJob } from '../../types';
import { startTranscription, getAudioPreview } from '../../api';
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
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handlePreview = async () => {
    if (!job.file) return;
    setIsPreviewing(true);
    setError(null);
    try {
      const url = await getAudioPreview(job.file, true);
      setPreviewUrl(url);
    } catch (e: any) {
      setError(e.message || t('setup.unknownError'));
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleStart = async () => {
    if (!job.file) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const data = await startTranscription(job.file, job.model, job.language, job.normalize || false);
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

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-white">{t('setup.normalizeAudio')}</h4>
                      <p className="text-xs text-gray-400 mt-1">{t('setup.normalizeDesc')}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setJob({ ...job, normalize: !job.normalize })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${job.normalize ? 'bg-blue-600' : 'bg-gray-700'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${job.normalize ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {job.normalize && job.file && (
                    <div className="mt-4 p-4 border border-blue-500/30 bg-blue-500/5 rounded-lg">
                      <button
                        onClick={handlePreview}
                        disabled={isPreviewing}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        {isPreviewing ? t('setup.previewing') : t('setup.preview')}
                      </button>

                      {previewUrl && (
                        <div className="mt-4 space-y-4">
                          <div>
                            <span className="text-xs text-gray-400 block mb-1">{t('setup.previewOriginal')}</span>
                            <audio controls className="w-full h-8" src={URL.createObjectURL(job.file)} />
                          </div>
                          <div>
                            <span className="text-xs text-blue-400 block mb-1">{t('setup.previewNormalized')}</span>
                            <audio controls className="w-full h-8" src={previewUrl} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
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
