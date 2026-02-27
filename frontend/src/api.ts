export const API_BASE = 'http://localhost:5000/api';

export async function startTranscription(file: File, model: string, language: string, diarization: boolean) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('model', model);
  formData.append('language', language);
  formData.append('diarization', diarization.toString());

  const res = await fetch(`${API_BASE}/transcribe`, {
    method: 'POST',
    body: formData,
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to start transcription');
  }
  return res.json();
}

export async function getJobStatus(jobId: string) {
  const res = await fetch(`${API_BASE}/transcribe/${jobId}`);
  if (!res.ok) throw new Error('Failed to get status');
  return res.json();
}

export async function exportTranscription(jobId: string, format: string, includeSpeakers: boolean = true) {
  const res = await fetch(`${API_BASE}/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ job_id: jobId, format, include_speakers: includeSpeakers })
  });
  if (!res.ok) throw new Error('Failed to export');
  return res.json();
}

export async function getSystemStatus() {
  const res = await fetch(`${API_BASE}/system/status`);
  if (!res.ok) throw new Error('Failed to get system status');
  return res.json();
}

export async function getProjects() {
  const res = await fetch(`${API_BASE}/projects`);
  if (!res.ok) throw new Error('Failed to get projects');
  return res.json();
}

export async function getProjectDetails(jobId: string) {
  const res = await fetch(`${API_BASE}/projects/${jobId}`);
  if (!res.ok) throw new Error('Failed to get project details');
  return res.json();
}

export async function deleteProject(jobId: string) {
  const res = await fetch(`${API_BASE}/projects/${jobId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete project');
  return res.json();
}

export async function clearCache() {
  const res = await fetch(`${API_BASE}/system/cache`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to clear cache');
  return res.json();
}

export async function reuploadMedia(projectId: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await fetch(`${API_BASE}/projects/${projectId}/reupload`, {
    method: 'POST',
    body: formData
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to reupload media');
  return data;
}
