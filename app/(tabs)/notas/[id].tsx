import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme, spacing, typography } from '../../../constants/theme';
import { useNotesStore } from '../../../store/notesStore';

export default function NotaDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const notes = useNotesStore((state) => state.notes);
  const note = notes.find((n) => n.id === id);

  if (!note) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Nota no encontrada</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>{note.title}</Text>
      <Text style={[styles.content, { color: theme.textSecondary }]}>{note.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md },
  title: { fontSize: typography.fontSizes.xl, fontWeight: '700', marginBottom: spacing.md },
  content: { fontSize: typography.fontSizes.md, lineHeight: 24 },
});