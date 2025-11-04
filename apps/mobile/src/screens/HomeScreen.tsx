import { Link, useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { useRecentReviewsQuery } from '../services/hooks';
import { ReviewCard } from '../components/ReviewCard';
import { EmptyState } from '../components/EmptyState';

export const HomeScreen = () => {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useRecentReviewsQuery();

  return (
    <View className="flex-1 bg-background px-4 pt-12">
      <View className="mb-6 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-bold text-white">Games Journal</Text>
          <Text className="text-sm text-muted">Track, rate, and share your playthroughs.</Text>
        </View>
        <Pressable
          className="rounded-full bg-accent px-4 py-2"
          onPress={() => router.push('/reviews/new')}
        >
          <Text className="font-semibold text-black">Log Game</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#22d3ee" />
        </View>
      ) : isError ? (
        <EmptyState
          title="Something went wrong"
          description="Pull to refresh or try again later."
        />
      ) : data && data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.review.id)}
          renderItem={({ item }) => <ReviewCard item={item} />}
          refreshing={isLoading}
          onRefresh={refetch}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      ) : (
        <EmptyState
          title="No reviews yet"
          description="Log your first game to start building your feed."
        />
      )}

      <View className="mt-8 items-center">
        <Link href="/games" asChild>
          <Pressable className="rounded-full border border-accent px-4 py-2">
            <Text className="text-accent">Browse Games</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
};

