import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme, spacing, typography, borderRadius } from '../../../constants/theme';
import { useNotesStore } from '../../../store/notesStore';

export default function IdeaDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const ideas = useNotesStore((state) => state.ideas);
  const idea = ideas.find((i) => i.id === id);

  if (!idea) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Idea no encontrada</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: idea.color }]}>
        <Text style={[styles.title, { color: theme.text }]}>{idea.title}</Text>
      </View>
      <View style={styles.tagsContainer}>
        {idea.tags.map((tag) => (
          <View key={tag} style={[styles.tag, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.tagText, { color: theme.text }]}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: spacing.xl },
  title: { fontSize: typography.fontSizes.xl, fontWeight: '700' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, padding: spacing.md },
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  tagText: { fontSize: typography.fontSizes.sm },
});