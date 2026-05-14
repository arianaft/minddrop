import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { z } from 'zod';
import { useTheme, spacing, typography, borderRadius } from '../constants/theme';
import { useNotesStore } from '../store/notesStore';
import { Note, ChecklistNote, IdeaNote } from '../types';

const noteSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  content: z.string().min(1, 'El contenido no puede estar vacío'),
});

const checklistSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  items: z.array(z.string()).min(1, 'Añade al menos un elemento'),
});

const ideaSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  tags: z.array(z.string()).min(1, 'Añade al menos una etiqueta'),
});

const IDEA_COLORS = [
  '#C8E6C9',
  '#BBDEFB',
  '#FFE0B2',
  '#F8BBD9',
  '#E1BEE7',
  '#B2DFDB',
];

type NoteType = 'note' | 'checklist' | 'idea';

export default function NuevaNotaScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { addNote, addChecklist, addIdea } = useNotesStore();

  const { type: typeParam } = useLocalSearchParams<{ type: NoteType }>();
  const [type, setType] = useState<NoteType>((typeParam as NoteType) || 'note');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [items, setItems] = useState<string[]>(['']);
  const [tags, setTags] = useState<string[]>(['']);
  const [selectedColor, setSelectedColor] = useState(IDEA_COLORS[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleSave = () => {
    setErrors({});

    if (type === 'note') {
      const result = noteSchema.safeParse({ title, content });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((e) => {
          fieldErrors[String(e.path[0])] = e.message;
        });
        setErrors(fieldErrors);
        return;
      }
      const note: Note = {
        id: generateId(),
        title,
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      addNote(note);

    } else if (type === 'checklist') {
      const filteredItems = items.filter((i) => i.trim() !== '');
      const result = checklistSchema.safeParse({ title, items: filteredItems });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((e) => {
          fieldErrors[String(e.path[0])] = e.message;
        });
        setErrors(fieldErrors);
        return;
      }
      const checklist: ChecklistNote = {
        id: generateId(),
        title,
        items: filteredItems.map((text) => ({
          id: generateId(),
          text,
          isCompleted: false,
        })),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      addChecklist(checklist);

    } else if (type === 'idea') {
      const filteredTags = tags.filter((t) => t.trim() !== '');
      const result = ideaSchema.safeParse({ title, tags: filteredTags });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((e) => {
          fieldErrors[String(e.path[0])] = e.message;
        });
        setErrors(fieldErrors);
        return;
      }
      const idea: IdeaNote = {
        id: generateId(),
        title,
        tags: filteredTags,
        color: selectedColor,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      addIdea(idea);
    }

    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.typeSelector}>
          {(['note', 'checklist', 'idea'] as NoteType[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.typeButton,
                { borderColor: theme.border },
                type === t && { backgroundColor: theme.primary, borderColor: theme.primary },
              ]}
              onPress={() => setType(t)}
            >
              <Text style={[
                styles.typeText,
                { color: theme.textSecondary },
                type === t && { color: 'white' },
              ]}>
                {t === 'note' ? '📔 Reflexión' : t === 'checklist' ? '✅ Hábito' : '💡 Idea'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: theme.text }]}>Título</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.surface,
              borderColor: errors.title ? theme.error : theme.border,
              color: theme.text,
            },
          ]}
          placeholder="¿De qué trata?"
          placeholderTextColor={theme.textSecondary}
          value={title}
          onChangeText={setTitle}
        />
        {errors.title && (
          <Text style={[styles.error, { color: theme.error }]}>{errors.title}</Text>
        )}

        {type === 'note' && (
          <>
            <Text style={[styles.label, { color: theme.text }]}>Contenido</Text>
            <TextInput
              style={[
                styles.textarea,
                {
                  backgroundColor: theme.surface,
                  borderColor: errors.content ? theme.error : theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="Escribe tu reflexión..."
              placeholderTextColor={theme.textSecondary}
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            {errors.content && (
              <Text style={[styles.error, { color: theme.error }]}>{errors.content}</Text>
            )}
          </>
        )}

        {type === 'checklist' && (
          <>
            <Text style={[styles.label, { color: theme.text }]}>Elementos</Text>
            {items.map((item, index) => (
              <TextInput
                key={index}
                style={[
                  styles.input,
                  { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text },
                ]}
                placeholder={`Elemento ${index + 1}`}
                placeholderTextColor={theme.textSecondary}
                value={item}
                onChangeText={(text) => {
                  const newItems = [...items];
                  newItems[index] = text;
                  setItems(newItems);
                }}
              />
            ))}
            {errors.items && (
              <Text style={[styles.error, { color: theme.error }]}>{errors.items}</Text>
            )}
            <TouchableOpacity
              style={[styles.addButton, { borderColor: theme.primary }]}
              onPress={() => setItems([...items, ''])}
            >
              <Text style={[styles.addButtonText, { color: theme.primary }]}>+ Añadir elemento</Text>
            </TouchableOpacity>
          </>
        )}

        {type === 'idea' && (
          <>
            <Text style={[styles.label, { color: theme.text }]}>Etiquetas</Text>
            {tags.map((tag, index) => (
              <TextInput
                key={index}
                style={[
                  styles.input,
                  { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text },
                ]}
                placeholder={`Etiqueta ${index + 1}`}
                placeholderTextColor={theme.textSecondary}
                value={tag}
                onChangeText={(text) => {
                  const newTags = [...tags];
                  newTags[index] = text;
                  setTags(newTags);
                }}
              />
            ))}
            {errors.tags && (
              <Text style={[styles.error, { color: theme.error }]}>{errors.tags}</Text>
            )}
            <TouchableOpacity
              style={[styles.addButton, { borderColor: theme.primary }]}
              onPress={() => setTags([...tags, ''])}
            >
              <Text style={[styles.addButtonText, { color: theme.primary }]}>+ Añadir etiqueta</Text>
            </TouchableOpacity>

            <Text style={[styles.label, { color: theme.text }]}>Color</Text>
            <View style={styles.colorSelector}>
              {IDEA_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorSelected,
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
          </>
        )}

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>Cancelar</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  typeSelector: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  typeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    alignItems: 'center',
  },
  typeText: { fontSize: typography.fontSizes.xs, fontWeight: '500' },
  label: {
    fontSize: typography.fontSizes.sm,
    fontWeight: '600',
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    fontSize: typography.fontSizes.md,
    marginBottom: spacing.xs,
  },
  textarea: {
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    fontSize: typography.fontSizes.md,
    height: 140,
    marginBottom: spacing.xs,
  },
  error: {
    fontSize: typography.fontSizes.xs,
    marginBottom: spacing.xs,
  },
  addButton: {
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    borderStyle: 'dashed',
    padding: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  addButtonText: { fontSize: typography.fontSizes.sm, fontWeight: '500' },
  colorSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: '#2D3B2E',
  },
  saveButton: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  saveButtonText: {
    color: 'white',
    fontSize: typography.fontSizes.md,
    fontWeight: '600',
  },
  cancelButton: {
    padding: spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: typography.fontSizes.md,
  },
});