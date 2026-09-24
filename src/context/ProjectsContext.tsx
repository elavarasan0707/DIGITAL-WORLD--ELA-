import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  db, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc,
  serverTimestamp 
} from '../lib/firebase';
import { ProjectItem } from '../types';
import { PROJECTS_DATA } from '../data/mockData';
import { useAuth } from './AuthContext';

interface ProjectsContextType {
  projects: ProjectItem[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  addProject: (project: Omit<ProjectItem, 'id' | 'createdAt'>) => Promise<ProjectItem>;
  updateProject: (id: string, project: Partial<ProjectItem>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  refreshProjects: () => Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

const PROJECTS_STORAGE_KEY = 'ela_portfolio_projects_data';

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isOwner } = useAuth();
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return PROJECTS_DATA;
  });

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Save projects to localStorage whenever updated
  const saveProjectsLocal = (updated: ProjectItem[]) => {
    try {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to cache projects in localStorage:', e);
    }
  };

  // Fetch projects from Firestore on mount
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const colRef = collection(db, 'projects');
      const snap = await getDocs(colRef);
      
      if (!snap.empty) {
        const firestoreList: ProjectItem[] = [];
        snap.forEach((d) => {
          firestoreList.push({ id: d.id, ...d.data() } as ProjectItem);
        });
        
        // Merge with existing seeded projects if any are missing
        const combinedMap = new Map<string, ProjectItem>();
        PROJECTS_DATA.forEach(p => combinedMap.set(p.id, p));
        firestoreList.forEach(p => combinedMap.set(p.id, p));
        
        const combined = Array.from(combinedMap.values());
        setProjects(combined);
        saveProjectsLocal(combined);
      } else {
        // If Firestore collection is empty, seed initial projects to Firestore
        try {
          for (const proj of PROJECTS_DATA) {
            await setDoc(doc(db, 'projects', proj.id), {
              ...proj,
              createdAt: new Date().toISOString(),
              createdBy: 'eladigitalw@gmail.com'
            }, { merge: true });
          }
        } catch (seedErr) {
          console.warn('Firestore seeding notice:', seedErr);
        }
      }
    } catch (err) {
      console.warn('Firestore fetch notice (using robust local store):', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const addProject = async (data: Omit<ProjectItem, 'id' | 'createdAt'>): Promise<ProjectItem> => {
    const newId = 'proj_' + Date.now();
    const newProject: ProjectItem = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString(),
      createdBy: user?.email || 'eladigitalw@gmail.com'
    };

    // 1. Instant local state update for zero latency
    setProjects(prev => {
      const updated = [newProject, ...prev];
      saveProjectsLocal(updated);
      return updated;
    });

    // 2. Sync to Firestore
    try {
      await setDoc(doc(db, 'projects', newId), {
        ...newProject,
        serverTimestamp: serverTimestamp()
      });
    } catch (err) {
      console.warn('Firestore add project notice:', err);
    }

    return newProject;
  };

  const updateProject = async (id: string, data: Partial<ProjectItem>) => {
    setProjects(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...data } : p);
      saveProjectsLocal(updated);
      return updated;
    });

    try {
      await updateDoc(doc(db, 'projects', id), {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.warn('Firestore update project notice:', err);
    }
  };

  const deleteProject = async (id: string) => {
    setProjects(prev => {
      const updated = prev.filter(p => p.id !== id);
      saveProjectsLocal(updated);
      return updated;
    });

    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (err) {
      console.warn('Firestore delete project notice:', err);
    }
  };

  return (
    <ProjectsContext.Provider value={{
      projects,
      loading,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      addProject,
      updateProject,
      deleteProject,
      refreshProjects: fetchProjects
    }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};
