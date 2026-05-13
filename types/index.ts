export interface BaseNote {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Note extends BaseNote {
  content: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface ChecklistNote extends BaseNote {
  items: ChecklistItem[];
}

export interface IdeaNote extends BaseNote {
  tags: string[];
  color: string;
}

export type AnyNote = Note | ChecklistNote | IdeaNote;

// Type guards para distinguir tipos en tiempo de ejecución
export function isNote(note: AnyNote): note is Note {
  return 'content' in note;
}

export function isChecklist(note: AnyNote): note is ChecklistNote {
  return 'items' in note;
}

export function isIdea(note: AnyNote): note is IdeaNote {
  return 'tags' in note;
}