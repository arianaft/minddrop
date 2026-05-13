import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../constants/theme';

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
        },
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
      }}
    >
      <Tabs.Screen
        name="notas"
        options={{
          title: 'Reflexiones',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="journal-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="checklists"
        options={{
          title: 'Hábitos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkbox-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="ideas"
        options={{
          title: 'Ideas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bulb-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}