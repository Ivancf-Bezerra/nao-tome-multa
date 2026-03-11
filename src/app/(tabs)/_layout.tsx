import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../context/ThemeContext';

export default function TabLayout() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
          borderTopColor: isDark ? '#1e293b' : '#e2e8f0',
          borderTopWidth: 1,
          height: 64,
        },
        tabBarActiveTintColor: isDark ? '#ffffff' : '#0f172a',
        tabBarInactiveTintColor: isDark ? '#94a3b8' : '#64748b',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.5,
          marginBottom: 6,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={20}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="defesas"
        options={{
          title: 'Defesas',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'shield' : 'shield-outline'}
              size={20}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="status"
        options={{
          title: 'Status',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'document-text' : 'document-text-outline'}
              size={20}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="planos"
        options={{
          title: 'Planos',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'pricetag' : 'pricetag-outline'}
              size={20}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
