import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme, spacing, typography, borderRadius } from '../../../constants/theme';
import { useNotesStore } from '../../../store/notesStore';

export default function ChecklistDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const checklists = useNotesStore((state) => state.checklists);
  const toggleChecklistItem = useNotesStore((state) => state.toggleChecklistItem);
  const archiveChecklist = useNotesStore((state) => state.archiveChecklist);
  const deleteChecklist = useNotesStore((state) => state.deleteChecklist);
  const checklist = checklists.find((c) => c.id === id);

  const handleToggle = (itemId: string) => {
    const willBeCompleted = checklist?.items.every(
      (i) => i.id === itemId ? !i.isCompleted : i.isCompleted
    );
    toggleChecklistItem(id!, itemId);
    if (willBeCompleted) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleArchive = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    archiveChecklist(id!);
    router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar hábito',
      'Esta acción es permanente y no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            deleteChecklist(id!);
            router.back();
          },
        },
      ]
    );
  };

  if (!checklist) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Hábito no encontrado</Text>
      </View>
    );
  }

  const completed = checklist.items.filter((i) => i.isCompleted).length;
  const total = checklist.items.length;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>{checklist.title}</Text>
      <Text style={[styles.progress, { color: theme.textSecondary }]}>
        {completed}/{total} completados
      </Text>

      {checklist.items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.item, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => handleToggle(item.id)}
        >
          <Text style={[styles.checkbox, { color: theme.primary }]}>
            {item.isCompleted ? '✅' : '⬜'}
          </Text>
          <Text style={[
            styles.itemText,
            { color: item.isCompleted ? theme.textSecondary : theme.text },
            item.isCompleted && styles.completed,
          ]}>
            {item.text}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.archiveButton, { backgroundColor: theme.primary }]}
        onPress={handleArchive}
      >
        <Text style={styles.archiveText}>📦 Archivar hábito</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.deleteButton, { borderColor: theme.error }]}
        onPress={handleDelete}
      >
        <Text style={[styles.deleteText, { color: theme.error }]}>🗑 Eliminar permanentemente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md },
  title: { fontSize: typography.fontSizes.xl, fontWeight: '700', marginBottom: spacing.xs },
  progress: { fontSize: typography.fontSizes.sm, marginBottom: spacing.lg },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  checkbox: { fontSize: 20 },
  itemText: { fontSize: typography.fontSizes.md, flex: 1 },
  completed: { textDecorationLine: 'line-through' },
  archiveButton: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  archiveText: { color: 'white', fontSize: typography.fontSizes.md, fontWeight: '500' },
  deleteButton: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  deleteText: { fontSize: typography.fontSizes.md, fontWeight: '500' },
});
