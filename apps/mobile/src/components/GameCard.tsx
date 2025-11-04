import { Image, Pressable, Text, View } from 'react-native';
import type { Game } from '../types';

type Props = {
  game: Game;
  onPress?: () => void;
  metadata?: string;
};

export const GameCard = ({ game, onPress, metadata }: Props) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    className="mb-4 flex-row items-center rounded-2xl bg-surface/80 p-4"
  >
    {game.coverImage ? (
      <Image
        source={{ uri: game.coverImage }}
        className="mr-4 h-20 w-20 rounded-xl bg-muted/30"
        resizeMode="cover"
      />
    ) : (
      <View className="mr-4 h-20 w-20 items-center justify-center rounded-xl bg-muted/20">
        <Text className="text-muted">No Art</Text>
      </View>
    )}
    <View className="flex-1">
      <Text className="text-lg font-semibold text-white" numberOfLines={1}>
        {game.title}
      </Text>
      <Text className="text-sm text-muted" numberOfLines={1}>
        {game.platform} • {game.genre}
      </Text>
      {metadata ? <Text className="mt-2 text-xs text-accent">{metadata}</Text> : null}
    </View>
  </Pressable>
);

