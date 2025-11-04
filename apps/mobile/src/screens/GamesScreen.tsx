import { useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SearchBar } from '../components/SearchBar';
import { GameCard } from '../components/GameCard';
import { EmptyState } from '../components/EmptyState';
import { useGamesQuery, useSearchGamesQuery } from '../services/hooks';

export const GamesScreen = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const gamesQuery = useGamesQuery();
  const searchQuery = useSearchGamesQuery(query);

  const isSearching = Boolean(query.trim());
  const isLoading = isSearching ? searchQuery.isLoading : gamesQuery.isLoading;
  const data = isSearching ? searchQuery.data : gamesQuery.data;

  const handleSearch = (text: string) => {
    setQuery(text);
  };

  return (
    <View className="flex-1 bg-background px-4 pt-12">
      <SearchBar
        placeholder="Search games, genres, or platforms"
        onSubmit={handleSearch}
        onClear={() => setQuery('')}
        initialValue={query}
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#22d3ee" />
        </View>
      ) : data && data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <GameCard
              game={item}
              onPress={() => router.push(`/games/${item.id}`)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      ) : (
        <EmptyState
          title="No games found"
          description="Try a different search term or check back later."
        />
      )}
    </View>
  );
};

