import React, { useState, useRef } from 'react';
import { UploadCloud, FileAudio, Settings2, Play, X, HardDrive, Cpu, Zap, Star, Loader2 } from 'lucide-react';
import { TranscriptionJob } from '../types';
import { startTranscription } from '../api';

interface SetupProps {
  initialJob: TranscriptionJob;
  onStart: (job: TranscriptionJob) => void;
  onCancel: () => void;
  t: (key: string) => string;
}

export default function Setup({ initialJob, onStart, onCancel, t }: SetupProps) {
  const [job, setJob] = useState<TranscriptionJob>(initialJob);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setJob({ ...job, file: e.target.files[0] });
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setJob({ ...job, file: e.dataTransfer.files[0] });
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

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
            <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <FileAudio size={20} className="text-blue-500" />
                {t('setup.uploadFile')}
              </h3>
              
              {!job.file ? (
                <div 
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
                    ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800/50'}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud size={48} className="mx-auto text-gray-500 mb-4" />
                  <p className="text-gray-300 font-medium mb-2">{t('setup.dragDrop')}</p>
                  <p className="text-gray-500 text-sm">{t('setup.supportedFormats')}</p>
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    accept="video/*,audio/*"
                  />
                </div>
              ) : (
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="w-12 h-12 bg-blue-600/20 text-blue-500 rounded-lg flex items-center justify-center shrink-0">
                      <FileAudio size={24} />
                    </div>
                    <div className="truncate">
                      <p className="text-white font-medium truncate">{job.file.name}</p>
                      <p className="text-gray-400 text-sm">{formatBytes(job.file.size)}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setJob({ ...job, file: null })}
                    className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors shrink-0"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Settings */}
          <div className="space-y-6">
            <div className={`bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 transition-opacity ${!job.file ? 'opacity-50 pointer-events-none' : ''}`}>
              <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                <Settings2 size={20} className="text-blue-500" />
                {t('setup.configuration')}
              </h3>

              <div className="space-y-6">
                {/* Model Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('setup.model')}</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'tiny', name: t('setup.models.tiny'), desc: t('setup.modelDesc.tiny'), icon: <Zap size={16} className="text-yellow-500" /> },
                      { id: 'base', name: t('setup.models.base'), desc: t('setup.modelDesc.base'), icon: <Cpu size={16} className="text-blue-400" /> },
                      { id: 'small', name: t('setup.models.small'), desc: t('setup.modelDesc.small'), icon: <Star size={16} className="text-purple-400" /> },
                      { id: 'medium', name: t('setup.models.medium'), desc: t('setup.modelDesc.medium'), icon: <Star size={16} className="text-amber-400 fill-amber-400" /> },
                      { id: 'large-v3', name: t('setup.models.large'), desc: t('setup.modelDesc.large'), icon: <HardDrive size={16} className="text-red-400" /> },
                    ].map((m) => (
                      <div 
                        key={m.id}
                        onClick={() => setJob({ ...job, model: m.id })}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors
                          ${job.model === m.id ? 'bg-blue-600/10 border-blue-500' : 'bg-gray-800/30 border-gray-700 hover:border-gray-500'}`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            {m.icon}
                            <span className={`font-medium ${job.model === m.id ? 'text-blue-400' : 'text-gray-200'}`}>{m.name}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{m.desc}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                          ${job.model === m.id ? 'border-blue-500' : 'border-gray-600'}`}>
                          {job.model === m.id && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('setup.language')}</label>
                  <select 
                    value={job.language}
                    onChange={(e) => setJob({ ...job, language: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  >
                    <option value="auto">{t('setup.autoDetect')}</option>
                    <option value="it">Italiano</option>
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <button 
                onClick={handleStart}
                disabled={!job.file || isSubmitting}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all
                  ${job.file && !isSubmitting
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
              >
                {isSubmitting ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <Play size={24} fill="currentColor" />
                )}
                {isSubmitting ? t('setup.starting') : t('setup.transcribe')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
