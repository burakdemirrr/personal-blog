import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

const TabLayout = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme !== 'light';
  const backgroundColor = isDark ? '#0f172a' : '#f8fafc';
  const tabBackground = isDark ? '#111827' : '#e2e8f0';
  const tintColor = isDark ? '#22d3ee' : '#0891b2';

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor },
        headerShadowVisible: false,
        headerTintColor: '#e2e8f0',
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: tabBackground,
          borderTopColor: 'transparent'
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="games/index"
        options={{
          title: 'Games',
          tabBarIcon: ({ color, size }) => <Ionicons name="game-controller" color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />
        }}
      />
    </Tabs>
  );
};

export default TabLayout;

