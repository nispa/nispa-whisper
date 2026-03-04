import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { TranscriptionJob, Segment } from '../../types';
import { getProjects, deleteProject } from '../../api';
import ProjectCard from './ProjectCard';
import EmptyState from './EmptyState';

interface DashboardProps {
  onNewProject: () => void;
  onResumeProject: (job: TranscriptionJob, segments: Segment[], status?: string) => void;
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
        // Aggiorna lo stato locale filtrando l'ID eliminato
        setProjects(prev => prev.filter(p => p.id !== id));
      } catch (e) {
        console.error("Failed to delete project", e);
        alert("Errore durante l'eliminazione del progetto.");
      }
    }
  };

  const handleResume = (p: any) => {
    const job: TranscriptionJob = {
      id: p.id,
      file: null,
      model: p.model,
      language: p.language,
      saveLocation: ''
    };
    onResumeProject(job, [], p.status);
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
              <ProjectCard
                key={p.id}
                project={p}
                onDelete={handleDelete}
                onResume={handleResume}
                t={t}
              />
            ))}
          </div>
        ) : (
          <EmptyState onNewProject={onNewProject} t={t} />
        )}
      </div>
    </div>
  );
}
