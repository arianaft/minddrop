import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, typography, spacing, borderRadius } from '../../constants/theme';
import { Note } from '../../types';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
}

export default function NoteCard({ note, onPress }: NoteCardProps) {
  const theme = useTheme();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Ionicons name="journal-outline" size={16} color={theme.primary} />
        <Text style={[styles.date, { color: theme.textSecondary }]}>
          {formatDate(note.createdAt)}
        </Text>
      </View>
      <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
        {note.title}
      </Text>
      <Text style={[styles.content, { color: theme.textSecondary }]} numberOfLines={2}>
        {note.content}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semibold,
    marginBottom: spacing.xs,
  },
  content: {
    fontSize: typography.fontSizes.sm,
    lineHeight: 20,
  },
  date: {
    fontSize: typography.fontSizes.xs,
  },
});