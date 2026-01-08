import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopColor: '#1e293b',
          borderTopWidth: 1,
          height: 64,
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#94a3b8',
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
          title: 'Painel',
          tabBarIcon: ({ color }) => (
            <View className="items-center justify-center">
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderWidth: 1.5,
                  borderColor: color,
                  borderRadius: 4,
                }}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="ativas"
        options={{
          title: 'Ativas',
          tabBarIcon: ({ color }) => (
            <View className="items-center justify-center">
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderWidth: 1.5,
                  borderColor: color,
                  borderRadius: 9,
                }}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="concluidas"
        options={{
          title: 'Concluídas',
          tabBarIcon: ({ color }) => (
            <View className="items-center justify-center">
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderWidth: 1.5,
                  borderColor: color,
                }}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="sistema"
        options={{
          title: 'Sistema',
          tabBarIcon: ({ color }) => (
            <View className="items-center justify-center">
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color,
                }}
              >
                i
              </Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
