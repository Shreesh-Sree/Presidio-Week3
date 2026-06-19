import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DashboardTask {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  notes?: string;
}

interface AppState {
  tasks: DashboardTask[];
  toggleTask: (id: string) => void;
  addTask: (title: string, category: string, notes?: string) => void;
  deleteTask: (id: string) => void;
  resetTasks: () => void;
  
  // Custom Alert Modal state
  alertModal: {
    title: string;
    message: string;
    type: 'success' | 'info' | 'warning' | 'danger';
  } | null;
  showAlertModal: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'danger') => void;
  closeAlertModal: () => void;
}

const initialTasks: DashboardTask[] = [
  { id: '1', title: 'Implement TypeScript types for all components', category: 'React Advanced', completed: true },
  { id: '2', title: 'Build custom hooks for window size tracking', category: 'React Advanced', completed: false, notes: 'useWindowSize & useOfflineStatus' },
  { id: '3', title: 'Set up global Theme switching Context', category: 'State Management', completed: true },
  { id: '4', title: 'Integrate Zustand for local client store', category: 'State Management', completed: true },
  { id: '5', title: 'Perform API requests using TanStack Query', category: 'API Handling', completed: false, notes: 'Connecting to remote JSONPlaceholder API' },
  { id: '6', title: 'Establish Error Boundaries for component fallbacks', category: 'React Advanced', completed: false },
  { id: '7', title: 'Implement secure storage integrations (cookies, session, local)', category: 'UX & Security', completed: false },
  { id: '8', title: 'Run accessibility (a11y) audits and fix ARIA labels', category: 'UX & Accessibility', completed: false }
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      tasks: initialTasks,
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
        })),
      addTask: (title, category, notes) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: Date.now().toString(),
              title,
              category,
              completed: false,
              notes,
            },
          ],
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
      resetTasks: () => set({ tasks: initialTasks }),

      // Alert modal values
      alertModal: null,
      showAlertModal: (title, message, type = 'info') =>
        set({ alertModal: { title, message, type } }),
      closeAlertModal: () => set({ alertModal: null }),
    }),
    {
      name: 'presidio-dashboard-tasks',
      partialize: (state) => ({ tasks: state.tasks }), // Persist only tasks list
    }
  )
);
