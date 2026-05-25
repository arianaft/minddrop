import { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import FlashListWrapper from '../../components/FlashListWrapper';
import { useTheme, spacing, typography, borderRadius } from '../../constants/theme';
import { useNotesStore } from '../../store/notesStore';
import { AnyNote, isNote, isChecklist, isIdea } from '../../types';

type ArchivedItem = AnyNote & { _type: 'note' | 'checklist' | 'idea' };

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

export default function ArchavadasScreen() {
  const theme = useTheme();
  const notes = useNotesStore((state) => state.notes);
  const checklists = useNotesStore((state) => state.checklists);
  const ideas = useNotesStore((state) => state.ideas);
  const restoreNote = useNotesStore((state) => state.restoreNote);
  const restoreChecklist = useNotesStore((state) => state.restoreChecklist);
  const restoreIdea = useNotesStore((state) => state.restoreIdea);
  const deleteNote = useNotesStore((state) => state.deleteNote);
  const deleteChecklist = useNotesStore((state) => state.deleteChecklist);
  const deleteIdea = useNotesStore((state) => state.deleteIdea);

  const archived: ArchivedItem[] = [
    ...notes.filter((n) => n.archived).map((n) => ({ ...n, _type: 'note' as const })),
    ...checklists.filter((c) => c.archived).map((c) => ({ ...c, _type: 'checklist' as const })),
    ...ideas.filter((i) => i.archived).map((i) => ({ ...i, _type: 'idea' as const })),
  ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handleRestore = (item: ArchivedItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (item._type === 'note') restoreNote(item.id);
    else if (item._type === 'checklist') restoreChecklist(item.id);
    else restoreIdea(item.id);
  };

  const handleDelete = (item: ArchivedItem) => {
    Alert.alert(
      'Eliminar permanentemente',
      `¿Eliminar "${item.title}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            if (item._type === 'note') deleteNote(item.id);
            else if (item._type === 'checklist') deleteChecklist(item.id);
            else deleteIdea(item.id);
          },
        },
      ]
    );
  };

  const typeLabel = (type: ArchivedItem['_type']) => {
    if (type === 'note') return { label: 'Reflexión', icon: '📔' };
    if (type === 'checklist') return { label: 'Hábito', icon: '✅' };
    return { label: 'Idea', icon: '💡' };
  };

  const getAccentColor = (item: ArchivedItem) =>
    isIdea(item) ? item.color : theme.surface;

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📦</Text>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>Sin archivados</Text>
      <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        Las reflexiones, hábitos e ideas que archivas aparecerán aquí
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: ArchivedItem }) => {
    const { label, icon } = typeLabel(item._type);
    const bg = getAccentColor(item);

    return (
      <FadeInCard>
        <View style={[styles.card, { backgroundColor: bg, borderColor: theme.border }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>{icon}</Text>
            <Text style={[styles.cardType, { color: theme.textSecondary }]}>{label}</Text>
            <Text style={[styles.cardDate, { color: theme.textSecondary }]}>
              {new Date(item.updatedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
            </Text>
          </View>
          <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1}>
            {item.title}
          </Text>
          {isNote(item) && (
            <Text style={[styles.cardPreview, { color: theme.textSecondary }]} numberOfLines={2}>
              {item.content}
            </Text>
          )}
          {isChecklist(item) && (
            <Text style={[styles.cardPreview, { color: theme.textSecondary }]}>
              {item.items.filter((i) => i.isCompleted).length}/{item.items.length} completados
            </Text>
          )}
          {isIdea(item) && item.tags.length > 0 && (
            <View style={styles.tagsRow}>
              {item.tags.slice(0, 3).map((tag) => (
                <View key={tag} style={[styles.tag, { backgroundColor: theme.surface }]}>
                  <Text style={[styles.tagText, { color: theme.text }]}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={[styles.restoreBtn, { backgroundColor: theme.primary }]}
              onPress={() => handleRestore(item)}
            >
              <Text style={styles.restoreBtnText}>Restaurar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.deleteBtn, { borderColor: theme.error }]}
              onPress={() => handleDelete(item)}
            >
              <Text style={[styles.deleteBtnText, { color: theme.error }]}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </FadeInCard>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlashListWrapper
        data={archived}
        renderItem={renderItem}
        keyExtractor={(item) => `${item._type}-${item.id}`}
        ListEmptyComponent={EmptyState}
        contentContainerStyle={styles.list}
        estimatedItemSize={160}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingVertical: spacing.md, flexGrow: 1 },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
  },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: { fontSize: typography.fontSizes.lg, fontWeight: '600', marginBottom: spacing.xs },
  emptySubtitle: {
    fontSize: typography.fontSizes.sm,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  card: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: spacing.xs,
  },
  cardIcon: { fontSize: 14 },
  cardType: { fontSize: typography.fontSizes.xs, flex: 1 },
  cardDate: { fontSize: typography.fontSizes.xs },
  cardTitle: { fontSize: typography.fontSizes.md, fontWeight: '600', marginBottom: spacing.xs },
  cardPreview: { fontSize: typography.fontSizes.sm, lineHeight: 18, marginBottom: spacing.sm },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.sm },
  tag: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full },
  tagText: { fontSize: typography.fontSizes.xs },
  cardActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  restoreBtn: {
    flex: 1,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  restoreBtnText: { color: 'white', fontSize: typography.fontSizes.sm, fontWeight: '500' },
  deleteBtn: {
    flex: 1,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  deleteBtnText: { fontSize: typography.fontSizes.sm, fontWeight: '500' },
});
