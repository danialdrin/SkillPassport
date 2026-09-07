import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SpaceItem {
  id: string;
  name: string;
  count: number;
  createdAt: string;
}

interface SpaceContextType {
  spaces: SpaceItem[];
  activeSpaceId: string;
  activeSpace: SpaceItem | undefined;
  createSpace: (name: string) => SpaceItem;
  editSpace: (id: string, name: string) => void;
  deleteSpace: (id: string) => void;
  setActiveSpaceId: (id: string) => void;
}

const STORAGE_KEY = 'skill_intelligence_spaces';
const ACTIVE_KEY = 'skill_intelligence_active_space';

const DEFAULT_SPACES: SpaceItem[] = [
  { id: 'default', name: 'General Space', count: 1, createdAt: new Date().toISOString() },
];

const SpaceContext = createContext<SpaceContextType | undefined>(undefined);

export const SpaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [spaces, setSpaces] = useState<SpaceItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse spaces from localStorage', e);
    }
    return DEFAULT_SPACES;
  });

  const [activeSpaceId, setActiveSpaceId] = useState<string>(() => {
    try {
      const storedActive = localStorage.getItem(ACTIVE_KEY);
      if (storedActive) return storedActive;
    } catch (e) {
      console.error('Failed to read active space', e);
    }
    return spaces[0]?.id || 'default';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(spaces));
  }, [spaces]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_KEY, activeSpaceId);
  }, [activeSpaceId]);

  const createSpace = (name: string): SpaceItem => {
    const newSpace: SpaceItem = {
      id: `space_${Date.now()}`,
      name: name.trim() || `Space ${spaces.length + 1}`,
      count: 0,
      createdAt: new Date().toISOString(),
    };
    setSpaces((prev) => [...prev, newSpace]);
    setActiveSpaceId(newSpace.id);
    return newSpace;
  };

  const editSpace = (id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSpaces((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name: trimmed } : s))
    );
  };

  const deleteSpace = (id: string) => {
    setSpaces((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (filtered.length === 0) {
        const fallback: SpaceItem = {
          id: `space_${Date.now()}`,
          name: 'General Space',
          count: 0,
          createdAt: new Date().toISOString(),
        };
        setActiveSpaceId(fallback.id);
        return [fallback];
      }
      if (activeSpaceId === id) {
        setActiveSpaceId(filtered[0].id);
      }
      return filtered;
    });
  };

  const activeSpace = spaces.find((s) => s.id === activeSpaceId) || spaces[0];

  return (
    <SpaceContext.Provider
      value={{
        spaces,
        activeSpaceId,
        activeSpace,
        createSpace,
        editSpace,
        deleteSpace,
        setActiveSpaceId,
      }}
    >
      {children}
    </SpaceContext.Provider>
  );
};

export const useSpaces = (): SpaceContextType => {
  const context = useContext(SpaceContext);
  if (!context) {
    throw new Error('useSpaces must be used within a SpaceProvider');
  }
  return context;
};
