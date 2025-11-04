import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native';
import { useGameDetailsQuery } from '../services/hooks';
import { RatingStars } from '../components/RatingStars';
import { EmptyState } from '../components/EmptyState';

export const GameDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const gameId = Number(params.id);
  const { data, isLoading, isError } = useGameDetailsQuery(gameId);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#22d3ee" />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View className="flex-1 bg-background px-4 pt-12">
        <EmptyState title="Game not found" description="Please return to the games list." />
      </View>
    );
  }

  return (
    <ScrollView className="bg-background" contentContainerStyle={{ paddingBottom: 32 }}>
      <View className="px-4 pt-12">
        <View className="mb-6 items-center">
          {data.game.coverImage ? (
            <Image
              source={{ uri: data.game.coverImage }}
              className="mb-4 h-48 w-36 rounded-3xl"
              resizeMode="cover"
            />
          ) : null}
          <Text className="mb-2 text-2xl font-bold text-white text-center">
            {data.game.title}
          </Text>
          <Text className="text-sm text-muted">
            {data.game.platform} • {data.game.genre}
          </Text>
          <View className="mt-4 flex-row items-center space-x-3">
            {data.averageRating ? (
              <RatingStars rating={data.averageRating} />
            ) : (
              <Text className="text-muted">No ratings yet</Text>
            )}
            <Text className="text-xs text-muted">
              {data.reviewCount} review{data.reviewCount === 1 ? '' : 's'}
            </Text>
          </View>
        </View>

        <View className="mb-4 rounded-2xl bg-surface/80 p-4">
          <Text className="mb-2 text-lg font-semibold text-white">About this game</Text>
          <Text className="text-sm text-muted">
            Stay tuned! Detailed descriptions will appear here when we integrate with a
            public games database.
          </Text>
        </View>

        <View className="mb-4 rounded-2xl bg-surface/80 p-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-white">Reviews</Text>
            <Text
              className="text-sm text-accent"
              onPress={() => router.push({ pathname: '/reviews/new', params: { gameId: data.game.id } })}
            >
              Add yours
            </Text>
          </View>
          {data.reviews.length === 0 ? (
            <EmptyState title="No reviews yet" description="Be the first to rate this game." />
          ) : (
            data.reviews.map((item) => (
              <View key={item.review.id} className="mb-4 rounded-2xl bg-background/60 p-4">
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="font-semibold text-white">{item.user.username}</Text>
                  <RatingStars rating={item.review.rating} />
                </View>
                <Text className="text-sm text-muted">{item.review.comment}</Text>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
};

