import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useTheme, spacing, typography } from '../../constants/theme';
import { useNotesStore } from '../../store/notesStore';
import ChecklistCard from '../../components/items/ChecklistCard';
import { ChecklistNote } from '../../types';

export default function ChecklistsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const checklists = useNotesStore((state) => state.checklists);

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>✅</Text>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        Sin hábitos aún
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        Pulsa + para crear tu primera lista de hábitos
      </Text>
    </View>
  );

  const renderItem: ListRenderItem<ChecklistNote> = ({ item }) => (
    <ChecklistCard
      checklist={item}
      onPress={() => router.push(`/checklists/${item.id}` as any)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlashList
        data={checklists}
        renderItem={renderItem}
        estimatedItemSize={130}
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