import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

type Props = {
  placeholder?: string;
  onSubmit: (value: string) => void;
  onClear?: () => void;
  initialValue?: string;
};

export const SearchBar = ({ placeholder = 'Search', onSubmit, onClear, initialValue = '' }: Props) => {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = () => {
    onSubmit(value);
  };

  const handleClear = () => {
    setValue('');
    onClear?.();
  };

  return (
    <View className="mb-4 flex-row items-center rounded-2xl bg-surface/80 px-4 py-3">
      <Ionicons name="search" size={20} color="#64748b" style={{ marginRight: 8 }} />
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
        onSubmitEditing={handleSubmit}
        placeholderTextColor="#64748b"
        className="flex-1 text-base text-white"
        returnKeyType="search"
      />
      {value ? (
        <Pressable onPress={handleClear} accessibilityRole="button">
          <Ionicons name="close" size={18} color="#94a3b8" />
        </Pressable>
      ) : null}
    </View>
  );
};

