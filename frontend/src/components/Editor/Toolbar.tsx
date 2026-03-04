import React, { useState } from 'react';
import { Search, Copy, Download, Save, Loader2, Volume2 } from 'lucide-react';
import { useEditor } from './EditorContext';
import { exportTranscription } from '../../api';

interface ToolbarProps {
  onBack: () => void;
  t: (key: string) => string;
}

export default function Toolbar({ onBack, t }: ToolbarProps) {
  const {
    job,
    project,
    segments,
    setSegments,
    saveProject,
    isSaving
  } = useEditor();

  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [exportFormat, setExportFormat] = useState('srt');
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleReplaceAll = () => {
    if (!searchQuery) return;
    const newSegments = segments.map(s => {
      if (s.text.includes(searchQuery)) {
        return { ...s, text: s.text.split(searchQuery).join(replaceQuery) };
      }
      return s;
    });
    setSegments(newSegments);
  };

  const handleExport = async () => {
    if (!job.id) return;
    setIsExporting(true);
    try {
      const data = await exportTranscription(job.id, exportFormat);
      const blob = new Blob([data.content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      let originalName = project?.file_name || job.file?.name || 'transcription';
      originalName = originalName.replace(/\.[^/.]+$/, ""); // Rimuove l'estensione originale

      a.download = `${originalName}.${exportFormat}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert("Errore durante l'esportazione.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopy = async () => {
    if (!job.id) return;
    try {
      const data = await exportTranscription(job.id, exportFormat);
      await navigator.clipboard.writeText(data.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Failed to copy');
    }
  };

  return (
    <div className="h-14 bg-[#1e1e1e] border-b border-gray-800 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="text-gray-400 hover:text-white font-medium text-sm transition-colors flex items-center gap-2">
          ← {t('app.projects')}
        </button>
        <div className="h-6 w-px bg-gray-700 mx-2" />

        {!!project?.normalized && (
          <>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-medium border border-blue-500/20" title="Audio Normalizzato">
              <Volume2 size={14} />
              <span>NORM</span>
            </div>
            <div className="h-6 w-px bg-gray-700 mx-2" />
          </>
        )}

        <div className="relative flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('editor.findReplace')}
              className="bg-gray-900 border border-gray-700 text-sm text-white rounded-md pl-9 pr-4 py-2 w-64 focus:outline-none focus:border-blue-500"
            />
          </div>
          {searchQuery && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={replaceQuery}
                onChange={(e) => setReplaceQuery(e.target.value)}
                placeholder={t('editor.replaceWith')}
                className="bg-gray-900 border border-gray-700 text-sm text-white rounded-md px-3 py-2 w-48 focus:outline-none focus:border-blue-500"
              />
              <button onClick={handleReplaceAll} className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm transition-colors border border-gray-700">
                {t('editor.replaceAll')}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value)}
          className="bg-gray-900 border border-gray-700 text-sm text-white rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
        >
          <option value="srt">SRT</option>
          <option value="vtt">VTT</option>
          <option value="txt">TXT</option>
          <option value="csv">CSV</option>
          <option value="json">JSON</option>
          <option value="mcp">JSON (MCP)</option>
        </select>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium text-sm border border-gray-700"
        >
          <Copy size={16} />
          {copied ? t('editor.copied') : t('editor.copy')}
        </button>

        <button
          onClick={saveProject}
          disabled={isSaving}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isSaving ? "Salvataggio..." : "SALVA"}
        </button>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-md font-medium text-sm transition-colors"
        >
          <Download size={16} />
          {isExporting ? t('editor.exporting') : t('editor.exportSrt').replace('SRT', exportFormat.toUpperCase())}
        </button>
      </div>
    </div>
  );
}
