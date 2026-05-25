import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme, spacing, typography, borderRadius } from '../../../constants/theme';
import { useNotesStore } from '../../../store/notesStore';

export default function IdeaDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const ideas = useNotesStore((state) => state.ideas);
  const archiveIdea = useNotesStore((state) => state.archiveIdea);
  const deleteIdea = useNotesStore((state) => state.deleteIdea);
  const idea = ideas.find((i) => i.id === id);

  const handleArchive = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    archiveIdea(id!);
    router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar idea',
      'Esta acción es permanente y no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            deleteIdea(id!);
            router.back();
          },
        },
      ]
    );
  };

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
        <Text style={[styles.date, { color: theme.text }]}>
          {new Date(idea.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
        </Text>
      </View>

      <View style={styles.tagsContainer}>
        {idea.tags.map((tag) => (
          <View key={tag} style={[styles.tag, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.tagText, { color: theme.text }]}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.archiveButton, { backgroundColor: theme.primary }]}
          onPress={handleArchive}
        >
          <Text style={styles.archiveText}>📦 Archivar idea</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.deleteButton, { borderColor: theme.error }]}
          onPress={handleDelete}
        >
          <Text style={[styles.deleteText, { color: theme.error }]}>🗑 Eliminar permanentemente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: spacing.xl },
  title: { fontSize: typography.fontSizes.xl, fontWeight: '700', marginBottom: spacing.xs },
  date: { fontSize: typography.fontSizes.sm },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, padding: spacing.md, flex: 1 },
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  tagText: { fontSize: typography.fontSizes.sm },
  actions: { padding: spacing.md, gap: spacing.sm },
  archiveButton: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
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
