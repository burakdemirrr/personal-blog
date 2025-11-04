import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useLoginMutation } from '../services/hooks';
import { useSessionStore } from '../store/sessionStore';

export const LoginScreen = () => {
  const router = useRouter();
  const { setUser } = useSessionStore();
  const { mutateAsync, isPending } = useLoginMutation();
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!username.trim()) {
      setError('Username is required.');
      return;
    }
    try {
      const user = await mutateAsync(username.trim());
      if (user) {
        setUser(user);
        router.replace('/');
      } else {
        setError('No user found. Sign up to create an account.');
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <View className="flex-1 justify-center bg-background px-4">
      <Text className="mb-6 text-3xl font-bold text-white">Welcome back</Text>
      <Text className="mb-2 text-sm text-muted">Username</Text>
      <TextInput
        className="mb-4 rounded-2xl bg-surface/80 px-4 py-3 text-white"
        placeholder="playerone"
        placeholderTextColor="#64748b"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />

      {error ? <Text className="mb-4 text-sm text-red-400">{error}</Text> : null}

      <Pressable className="rounded-full bg-accent px-4 py-3" onPress={handleSubmit} disabled={isPending}>
        <Text className="text-center text-base font-semibold text-black">
          {isPending ? 'Signing in...' : 'Sign in'}
        </Text>
      </Pressable>

      <View className="mt-6 flex-row justify-center">
        <Text className="text-sm text-muted">New here?</Text>
        <Link href="/auth/signup" asChild>
          <Pressable>
            <Text className="ml-2 text-sm font-semibold text-accent">Create an account</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
};

