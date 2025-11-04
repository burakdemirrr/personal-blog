import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Image, Pressable, Text, View } from 'react-native';
import { useSessionStore } from '../store/sessionStore';
import { useUserReviewsQuery } from '../services/hooks';
import { EmptyState } from '../components/EmptyState';
import { ReviewCard } from '../components/ReviewCard';

export const ProfileScreen = () => {
  const router = useRouter();
  const { user, logout } = useSessionStore();
  const { data, isLoading } = useUserReviewsQuery(user?.id ?? null);

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-4">
        <EmptyState
          title="You are not logged in"
          description="Sign in to sync your reviews and ratings."
        />
        <Pressable
          className="mt-4 rounded-full bg-accent px-4 py-2"
          onPress={() => router.push('/auth/login')}
        >
          <Text className="font-semibold text-black">Go to Auth</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-4 pt-12">
      <View className="mb-6 flex-row items-center">
        {user.avatar ? (
          <Image source={{ uri: user.avatar }} className="mr-4 h-16 w-16 rounded-full" />
        ) : (
          <View className="mr-4 h-16 w-16 items-center justify-center rounded-full bg-muted/20">
            <Text className="text-xl font-semibold text-white">
              {user.username.slice(0, 2).toUpperCase()}
            </Text>
          </View>
        )}
        <View className="flex-1">
          <Text className="text-2xl font-bold text-white">{user.username}</Text>
          <Text className="text-sm text-muted">{user.email}</Text>
        </View>
        <Pressable className="rounded-full border border-accent px-4 py-2" onPress={logout}>
          <Text className="text-accent">Logout</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#22d3ee" />
        </View>
      ) : data && data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.review.id)}
          renderItem={({ item }) => <ReviewCard item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      ) : (
        <EmptyState
          title="No activity yet"
          description="Log a game review to populate your profile."
        />
      )}
    </View>
  );
};

