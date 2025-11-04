import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';
import { useGamesQuery, useCreateReviewMutation } from '../services/hooks';
import { useSessionStore } from '../store/sessionStore';

export const AddReviewScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const preselectedGameId = params.gameId ? Number(params.gameId) : undefined;
  const { user } = useSessionStore();
  const { data: games, isLoading: isLoadingGames } = useGamesQuery();
  const { mutateAsync, isPending } = useCreateReviewMutation();

  const [selectedGameId, setSelectedGameId] = useState<number | undefined>(preselectedGameId);
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedGameId && games?.length) {
      setSelectedGameId(games[0].id);
    }
  }, [games, selectedGameId]);

  const selectedGame = useMemo(
    () => games?.find((game) => game.id === selectedGameId),
    [games, selectedGameId]
  );

  const handleSubmit = async () => {
    if (!user) {
      setError('You need to sign in to log a review.');
      return;
    }
    if (!selectedGameId) {
      setError('Please select a game first.');
      return;
    }
    if (!comment.trim()) {
      setError('Tell us what you thought about the game.');
      return;
    }

    try {
      await mutateAsync({
        userId: user.id,
        gameId: selectedGameId,
        rating,
        comment: comment.trim()
      });
      router.back();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-4">
        <Text className="mb-4 text-lg font-semibold text-white">Sign in required</Text>
        <Text className="text-center text-sm text-muted">
          Create an account or log in to start logging your game reviews.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="px-4 pt-12">
        <Text className="mb-4 text-2xl font-bold text-white">Log a new review</Text>

        {isLoadingGames ? (
          <ActivityIndicator color="#22d3ee" />
        ) : (
          <View className="mb-6">
            <Text className="mb-2 text-sm text-muted">Select game</Text>
            <View className="rounded-2xl bg-surface/80">
              {games?.map((game) => {
                const isActive = game.id === selectedGameId;
                return (
                  <Pressable
                    key={game.id}
                    className={`border-b border-white/5 px-4 py-3 ${isActive ? 'bg-accent/10' : ''}`}
                    onPress={() => setSelectedGameId(game.id)}
                  >
                    <Text className="font-semibold text-white">{game.title}</Text>
                    <Text className="text-xs text-muted">
                      {game.platform} • {game.genre}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        <View className="mb-6">
          <Text className="mb-2 text-sm text-muted">Rating</Text>
          <View className="flex-row items-center">
            {Array.from({ length: 5 }).map((_, index) => {
              const value = index + 1;
              const isActive = value <= rating;
              return (
                <Pressable key={value} onPress={() => setRating(value)}>
                  <Text className={isActive ? 'text-4xl text-accent' : 'text-4xl text-muted'}>★</Text>
                </Pressable>
              );
            })}
            <Text className="ml-3 text-sm text-muted">{rating} / 5</Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="mb-2 text-sm text-muted">Your thoughts</Text>
          <TextInput
            multiline
            numberOfLines={6}
            className="min-h-[140px] rounded-2xl bg-surface/80 p-4 text-sm text-white"
            placeholder="Share what stood out about this game..."
            placeholderTextColor="#64748b"
            value={comment}
            onChangeText={setComment}
            textAlignVertical="top"
          />
        </View>

        {error ? (
          <Text className="mb-4 text-sm text-red-400">{error}</Text>
        ) : null}

        <Pressable
          className="rounded-full bg-accent px-6 py-3"
          onPress={handleSubmit}
          disabled={isPending}
        >
          <Text className="text-center text-base font-semibold text-black">
            {isPending ? 'Saving...' : `Save review${selectedGame ? ` for ${selectedGame.title}` : ''}`}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

