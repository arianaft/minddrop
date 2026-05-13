import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useTheme, spacing, typography } from '../../constants/theme';
import { useNotesStore } from '../../store/notesStore';
import IdeaCard from '../../components/items/IdeaCard';
import { IdeaNote } from '../../types';

export default function IdeasScreen() {
  const theme = useTheme();
  const router = useRouter();
  const ideas = useNotesStore((state) => state.ideas);

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>💡</Text>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        Sin ideas aún
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        Pulsa + para capturar tu primera idea
      </Text>
    </View>
  );

  const renderItem: ListRenderItem<IdeaNote> = ({ item }) => (
    <IdeaCard
      idea={item}
      onPress={() => router.push(`/ideas/${item.id}` as any)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlashList
        data={ideas}
        renderItem={renderItem}
        estimatedItemSize={110}
        ListEmptyComponent={EmptyState}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={() => router.push('/nueva-nota' as any)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingVertical: spacing.md },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
  },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: typography.fontSizes.sm,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    color: 'white',
    fontSize: 28,
    fontWeight: '300',
  },
});