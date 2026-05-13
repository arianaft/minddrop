import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, typography, spacing, borderRadius } from '../../constants/theme';
import { IdeaNote } from '../../types';

interface IdeaCardProps {
  idea: IdeaNote;
  onPress: () => void;
}

export default function IdeaCard({ idea, onPress }: IdeaCardProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: idea.color, borderColor: theme.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Ionicons name="bulb-outline" size={16} color={theme.text} />
      </View>
      <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
        {idea.title}
      </Text>
      <View style={styles.tagsContainer}>
        {idea.tags.slice(0, 3).map((tag) => (
          <View
            key={tag}
            style={[styles.tag, { backgroundColor: theme.surface }]}
          >
            <Text style={[styles.tagText, { color: theme.text }]}>
              {tag}
            </Text>
          </View>
        ))}
      </View>
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
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semibold,
    marginBottom: spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  tagText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium,
  },
});