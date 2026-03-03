import React, { useRef, useState } from 'react';
import { UploadCloud, FileAudio, X } from 'lucide-react';

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  t: (key: string) => string;
}

export default function FileUpload({ file, onFileChange, t }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
        <FileAudio size={20} className="text-blue-500" />
        {t('setup.uploadFile')}
      </h3>
      
      {!file ? (
        <div 
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
            ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800/50'}`}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud size={48} className="mx-auto text-gray-500 mb-4" />
          <p className="text-gray-300 font-medium mb-2">{t('setup.dragDrop')}</p>
          <p className="text-gray-500 text-sm">{t('setup.supportedFormats')}</p>
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={(e) => onFileChange(e.target.files?.[0] || null)}
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
              <p className="text-white font-medium truncate">{file.name}</p>
              <p className="text-gray-400 text-sm">{formatBytes(file.size)}</p>
            </div>
          </div>
          <button 
            onClick={() => onFileChange(null)}
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
