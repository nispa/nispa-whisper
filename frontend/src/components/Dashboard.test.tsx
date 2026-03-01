import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from './Dashboard';

// Mock delle traduzioni
const mockT = (key: string) => key;

// Mock delle API
vi.mock('../api', () => ({
  getProjects: vi.fn(() => Promise.resolve([])),
  deleteProject: vi.fn(() => Promise.resolve({ success: true })),
  clearAllData: vi.fn(() => Promise.resolve({ success: true })),
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
    
    // Verifica che il titolo o un elemento chiave sia presente
    // Nota: usiamo i tasti di traduzione come mock
    expect(screen.getByText('app.projects')).toBeDefined();
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
