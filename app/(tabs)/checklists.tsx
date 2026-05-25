import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated } from 'react-native';
import FlashListWrapper from '../../components/FlashListWrapper';
import { useRouter } from 'expo-router';
import { useTheme, spacing, typography, borderRadius } from '../../constants/theme';
import { useNotesStore } from '../../store/notesStore';
import ChecklistCard from '../../components/items/ChecklistCard';
import { ChecklistNote } from '../../types';

function FadeInCard({ children }: { children: React.ReactNode }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 280, useNativeDriver: true }),
    ]).start();
  }, []);
  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

export default function ChecklistsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const checklists = useNotesStore((state) => state.checklists);
  const [query, setQuery] = useState('');

  const filtered = checklists.filter(
    (c) =>
      !c.archived &&
      c.title.toLowerCase().includes(query.toLowerCase())
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>{query ? '🔍' : '✅'}</Text>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        {query ? 'Sin resultados' : 'Sin hábitos aún'}
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        {query ? 'Prueba con otro término' : 'Pulsa + para crear tu primera lista de hábitos'}
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: ChecklistNote }) => (
    <FadeInCard>
      <ChecklistCard
        checklist={item}
        onPress={() => router.push(`/checklists/${item.id}` as any)}
      />
    </FadeInCard>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.searchIcon, { color: theme.textSecondary }]}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Buscar hábitos..."
          placeholderTextColor={theme.textSecondary}
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Text style={[styles.clearButton, { color: theme.textSecondary }]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlashListWrapper
        data={filtered}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={EmptyState}
        contentContainerStyle={styles.list}
        estimatedItemSize={110}
      />
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={() => router.push('/nueva-nota?type=checklist' as any)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  searchIcon: { fontSize: 16, marginRight: spacing.xs },
  searchInput: { flex: 1, fontSize: typography.fontSizes.md, paddingVertical: 4 },
  clearButton: { fontSize: 16, paddingHorizontal: spacing.xs },
  list: { paddingVertical: spacing.xs },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
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
  fabText: { color: 'white', fontSize: 28, fontWeight: '300' },
});
