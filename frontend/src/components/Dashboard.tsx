import React, { useEffect, useState } from 'react';
import { Plus, FileAudio, FileText, Clock, Play, Trash2 } from 'lucide-react';
import { TranscriptionJob, Segment } from '../types';
import { getProjects, deleteProject } from '../api';

interface DashboardProps {
  onNewProject: () => void;
  onResumeProject: (job: TranscriptionJob, segments: Segment[]) => void;
  t: (key: string) => string;
}

export default function Dashboard({ onNewProject, onResumeProject, t }: DashboardProps) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (e) {
      console.error("Failed to fetch projects", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Sei sicuro di voler eliminare questo progetto?')) {
      try {
        await deleteProject(id);
        fetchProjects();
      } catch (e) {
        console.error("Failed to delete project", e);
      }
    }
  };

  const handleResume = (p: any) => {
    // We pass a mock job object. The Editor will fetch the real details using the ID.
    const job: TranscriptionJob = {
      id: p.id,
      file: null, // We don't have the File object, but Editor will use the media URL
      model: p.model,
      language: p.language,
      saveLocation: ''
    };
    // The segments will be fetched by the Editor, or we can pass empty array and let Editor fetch
    onResumeProject(job, []);
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-[#141414]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-white">{t('dashboard.recentProjects')}</h2>
          <button 
            onClick={onNewProject}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/20"
          >
            <Plus size={20} />
            {t('dashboard.newProject')}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Caricamento progetti...</div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(p => (
              <div 
                key={p.id}
                onClick={() => handleResume(p)}
                className="bg-[#1e1e1e] border border-gray-800 hover:border-blue-500/50 rounded-xl p-6 cursor-pointer transition-all group hover:shadow-lg hover:shadow-blue-500/10 relative"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <FileText size={24} />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs font-mono px-2 py-1 rounded ${p.status === 'completed' ? 'text-green-500 bg-green-900/30' : p.status === 'failed' ? 'text-red-500 bg-red-900/30' : 'text-yellow-500 bg-yellow-900/30'}`}>
                      {p.status.toUpperCase()}
                    </span>
                    <button 
                      onClick={(e) => handleDelete(e, p.id)}
                      className="text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-white mb-2 truncate" title={p.name || t('dashboard.unnamed')}>
                  {p.name || t('dashboard.unnamed')}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>{p.language === 'auto' ? t('setup.autoDetect') : p.language.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Play size={14} />
                    <span>{p.model}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#1e1e1e] border border-gray-800 rounded-xl">
            <FileAudio size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">{t('dashboard.noProjects')}</h3>
            <p className="text-gray-400 mb-6">{t('dashboard.startFirst')}</p>
            <button 
              onClick={onNewProject}
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              {t('dashboard.createProject')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
