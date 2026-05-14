import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme, spacing, typography, borderRadius } from '../../../constants/theme';
import { useNotesStore } from '../../../store/notesStore';

export default function NotaDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const notes = useNotesStore((state) => state.notes);
  const deleteNote = useNotesStore((state) => state.deleteNote);
  const note = notes.find((n) => n.id === id);

  const handleDelete = () => {
    Alert.alert(
      'Eliminar reflexión',
      '¿Estás seguro? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            deleteNote(id!);
            router.back();
          },
        },
      ]
    );
  };

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
      <Text style={[styles.date, { color: theme.textSecondary }]}>
        {new Date(note.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
      </Text>
      <Text style={[styles.content, { color: theme.text }]}>{note.content}</Text>

      <TouchableOpacity
        style={[styles.deleteButton, { borderColor: theme.error }]}
        onPress={handleDelete}
      >
        <Text style={[styles.deleteText, { color: theme.error }]}>🗑 Eliminar reflexión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md },
  title: { fontSize: typography.fontSizes.xl, fontWeight: '700', marginBottom: spacing.xs },
  date: { fontSize: typography.fontSizes.sm, marginBottom: spacing.lg },
  content: { fontSize: typography.fontSizes.md, lineHeight: 24, flex: 1 },
  deleteButton: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  deleteText: { fontSize: typography.fontSizes.md, fontWeight: '500' },
});