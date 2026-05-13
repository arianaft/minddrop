import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../constants/theme';

export default function ChecklistsScreen() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text }]}>
        Mis Hábitos
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 24, fontWeight: '600' },
});