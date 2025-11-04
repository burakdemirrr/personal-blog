import { View, Text } from 'react-native';

type Props = {
  rating: number;
};

const MAX_STARS = 5;

export const RatingStars = ({ rating }: Props) => {
  const active = Math.round(rating);
  return (
    <View className="flex-row items-center">
      {Array.from({ length: MAX_STARS }).map((_, index) => (
        <Text key={index} className={index < active ? 'text-accent' : 'text-muted'}>
          ★
        </Text>
      ))}
      <Text className="ml-2 text-xs text-muted">{rating.toFixed(1)}</Text>
    </View>
  );
};

