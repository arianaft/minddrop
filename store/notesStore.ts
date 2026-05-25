import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note, ChecklistNote, IdeaNote } from '../types';

interface NotesStore {
  notes: Note[];
  checklists: ChecklistNote[];
  ideas: IdeaNote[];
  addNote: (note: Note) => void;
  addChecklist: (checklist: ChecklistNote) => void;
  addIdea: (idea: IdeaNote) => void;
  deleteNote: (id: string) => void;
  deleteChecklist: (id: string) => void;
  deleteIdea: (id: string) => void;
  archiveNote: (id: string) => void;
  archiveChecklist: (id: string) => void;
  archiveIdea: (id: string) => void;
  restoreNote: (id: string) => void;
  restoreChecklist: (id: string) => void;
  restoreIdea: (id: string) => void;
  toggleChecklistItem: (checklistId: string, itemId: string) => void;
}

export const useNotesStore = create<NotesStore>()(
  persist(
    (set) => ({
      notes: [],
      checklists: [],
      ideas: [],

      addNote: (note) =>
        set((state) => ({ notes: [...state.notes, note] })),
      addChecklist: (checklist) =>
        set((state) => ({ checklists: [...state.checklists, checklist] })),
      addIdea: (idea) =>
        set((state) => ({ ideas: [...state.ideas, idea] })),

      deleteNote: (id) =>
        set((state) => ({ notes: state.notes.filter((n) => n.id !== id) })),
      deleteChecklist: (id) =>
        set((state) => ({ checklists: state.checklists.filter((c) => c.id !== id) })),
      deleteIdea: (id) =>
        set((state) => ({ ideas: state.ideas.filter((i) => i.id !== id) })),

      archiveNote: (id) =>
        set((state) => ({
          notes: state.notes.map((n) => n.id === id ? { ...n, archived: true } : n),
        })),
      archiveChecklist: (id) =>
        set((state) => ({
          checklists: state.checklists.map((c) => c.id === id ? { ...c, archived: true } : c),
        })),
      archiveIdea: (id) =>
        set((state) => ({
          ideas: state.ideas.map((i) => i.id === id ? { ...i, archived: true } : i),
        })),

      restoreNote: (id) =>
        set((state) => ({
          notes: state.notes.map((n) => n.id === id ? { ...n, archived: false } : n),
        })),
      restoreChecklist: (id) =>
        set((state) => ({
          checklists: state.checklists.map((c) => c.id === id ? { ...c, archived: false } : c),
        })),
      restoreIdea: (id) =>
        set((state) => ({
          ideas: state.ideas.map((i) => i.id === id ? { ...i, archived: false } : i),
        })),

      toggleChecklistItem: (checklistId, itemId) =>
        set((state) => ({
          checklists: state.checklists.map((c) =>
            c.id !== checklistId
              ? c
              : {
                  ...c,
                  items: c.items.map((i) =>
                    i.id === itemId ? { ...i, isCompleted: !i.isCompleted } : i
                  ),
                }
          ),
        })),
    }),
    {
      name: 'minddrop-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
