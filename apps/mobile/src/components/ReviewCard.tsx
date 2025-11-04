import { Image, Text, View } from 'react-native';
import type { ReviewDetail } from '../types';
import { formatRelativeDate } from '../utils/date';
import { RatingStars } from './RatingStars';

type Props = {
  item: ReviewDetail;
};

export const ReviewCard = ({ item }: Props) => (
  <View className="mb-4 rounded-2xl bg-surface/80 p-4">
    <View className="mb-3 flex-row items-center">
      {item.user.avatar ? (
        <Image source={{ uri: item.user.avatar }} className="mr-3 h-10 w-10 rounded-full" />
      ) : (
        <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-muted/20">
          <Text className="text-sm font-semibold text-white">
            {item.user.username.slice(0, 2).toUpperCase()}
          </Text>
        </View>
      )}
      <View className="flex-1">
        <Text className="font-semibold text-white">{item.user.username}</Text>
        <Text className="text-xs text-muted">{formatRelativeDate(item.review.createdAt)}</Text>
      </View>
      <RatingStars rating={item.review.rating} />
    </View>

    <Text className="mb-2 text-base font-semibold text-white">
      {item.game.title}
    </Text>
    <Text className="text-sm text-muted" numberOfLines={4}>
      {item.review.comment}
    </Text>
  </View>
);

