import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme, spacing, typography, borderRadius } from '../../../constants/theme';
import { useNotesStore } from '../../../store/notesStore';

export default function ChecklistDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const checklists = useNotesStore((state) => state.checklists);
  const toggleChecklistItem = useNotesStore((state) => state.toggleChecklistItem);
  const checklist = checklists.find((c) => c.id === id);

  if (!checklist) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Hábito no encontrado</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>{checklist.title}</Text>
      {checklist.items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.item, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => toggleChecklistItem(checklist.id, item.id)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md },
  title: { fontSize: typography.fontSizes.xl, fontWeight: '700', marginBottom: spacing.md },
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
});