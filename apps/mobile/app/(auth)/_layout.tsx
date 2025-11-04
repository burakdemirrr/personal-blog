import { Stack } from 'expo-router';

const AuthLayout = () => (
  <Stack screenOptions={{ headerShown: false, presentation: 'modal' }}>
    <Stack.Screen name="login" />
    <Stack.Screen name="signup" />
  </Stack>
);

export default AuthLayout;

