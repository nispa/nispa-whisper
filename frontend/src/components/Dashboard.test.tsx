import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
// Ora puntiamo alla cartella Dashboard (che contiene index.tsx)
import Dashboard from './Dashboard';

// Mock delle traduzioni
const mockT = (key: string) => key;

// Mock delle API
vi.mock('../api', () => ({
  getProjects: vi.fn(() => Promise.resolve([])),
  deleteProject: vi.fn(() => Promise.resolve({ success: true })),
  getProjectDetails: vi.fn(() => Promise.resolve({ segments: [] })),
}));

describe('Dashboard Component', () => {
  it('renders the dashboard with empty state', async () => {
    render(
      <Dashboard 
        onNewProject={() => {}} 
        onResumeProject={() => {}} 
        t={mockT} 
      />
    );
    
    // Il Dashboard ora cerca "dashboard.recentProjects" come titolo
    expect(screen.getByText('dashboard.recentProjects')).toBeDefined();
  });

  it('shows the new project button', () => {
    render(
      <Dashboard 
        onNewProject={() => {}} 
        onResumeProject={() => {}} 
        t={mockT} 
      />
    );
    
    expect(screen.getByText('dashboard.newProject')).toBeDefined();
  });
});
