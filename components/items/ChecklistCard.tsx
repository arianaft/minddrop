import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, typography, spacing, borderRadius } from '../../constants/theme';
import { ChecklistNote } from '../../types';

interface ChecklistCardProps {
  checklist: ChecklistNote;
  onPress: () => void;
}

export default function ChecklistCard({ checklist, onPress }: ChecklistCardProps) {
  const theme = useTheme();

  const completed = checklist.items.filter((i) => i.isCompleted).length;
  const total = checklist.items.length;
  const progress = total > 0 ? completed / total : 0;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Ionicons name="checkbox-outline" size={16} color={theme.primary} />
        <Text style={[styles.counter, { color: theme.textSecondary }]}>
          {completed}/{total}
        </Text>
      </View>
      <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
        {checklist.title}
      </Text>
      <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
        <View
          style={[
            styles.progressFill,
            { backgroundColor: theme.primary, width: `${progress * 100}%` },
          ]}
        />
      </View>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        {progress === 1 && total > 0 ? '✅ Completado' : `${Math.round(progress * 100)}% completado`}
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
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 6,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  counter: {
    fontSize: typography.fontSizes.xs,
  },
  subtitle: {
    fontSize: typography.fontSizes.xs,
  },
});