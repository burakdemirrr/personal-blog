import { Text, View } from 'react-native';

type Props = {
  title: string;
  description?: string;
};

export const EmptyState = ({ title, description }: Props) => (
  <View className="items-center justify-center rounded-2xl bg-surface/60 p-8">
    <Text className="mb-2 text-lg font-semibold text-white">{title}</Text>
    {description ? <Text className="text-center text-sm text-muted">{description}</Text> : null}
  </View>
);

