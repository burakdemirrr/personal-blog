import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useSignupMutation } from '../services/hooks';
import { useSessionStore } from '../store/sessionStore';

export const SignupScreen = () => {
  const router = useRouter();
  const { setUser } = useSessionStore();
  const { mutateAsync, isPending } = useSignupMutation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!username.trim() || !email.trim()) {
      setError('Both username and email are required.');
      return;
    }
    try {
      const user = await mutateAsync({
        username: username.trim(),
        email: email.trim(),
        avatar: avatar.trim() || undefined
      });
      setUser(user);
      router.replace('/');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <View className="flex-1 justify-center bg-background px-4">
      <Text className="mb-6 text-3xl font-bold text-white">Create your profile</Text>

      <Text className="mb-2 text-sm text-muted">Username</Text>
      <TextInput
        className="mb-4 rounded-2xl bg-surface/80 px-4 py-3 text-white"
        placeholder="arcadequeen"
        placeholderTextColor="#64748b"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />

      <Text className="mb-2 text-sm text-muted">Email</Text>
      <TextInput
        className="mb-4 rounded-2xl bg-surface/80 px-4 py-3 text-white"
        placeholder="you@example.com"
        placeholderTextColor="#64748b"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Text className="mb-2 text-sm text-muted">Avatar URL (optional)</Text>
      <TextInput
        className="mb-4 rounded-2xl bg-surface/80 px-4 py-3 text-white"
        placeholder="https://..."
        placeholderTextColor="#64748b"
        autoCapitalize="none"
        value={avatar}
        onChangeText={setAvatar}
      />

      {error ? <Text className="mb-4 text-sm text-red-400">{error}</Text> : null}

      <Pressable className="rounded-full bg-accent px-4 py-3" onPress={handleSubmit} disabled={isPending}>
        <Text className="text-center text-base font-semibold text-black">
          {isPending ? 'Creating account...' : 'Sign up'}
        </Text>
      </Pressable>

      <View className="mt-6 flex-row justify-center">
        <Text className="text-sm text-muted">Already have an account?</Text>
        <Link href="/auth/login" asChild>
          <Pressable>
            <Text className="ml-2 text-sm font-semibold text-accent">Sign in</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
};

