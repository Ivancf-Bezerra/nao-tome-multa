// src/components/ui/CardHeader.tsx
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CardHeaderProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'default';
}

export default function CardHeader({
  title,
  icon,
  variant = 'default',
}: CardHeaderProps) {
  const isPrimary = variant === 'primary';

  return (
    <View className="flex-row items-start justify-between gap-4">
      <View className="flex-1">
        <Text
          className={
            isPrimary
              ? 'text-lg font-semibold text-slate-900'
              : 'text-base font-semibold text-white'
          }
        >
          {title}
        </Text>
      </View>

      <View
        className={`mt-0.5 h-10 w-10 items-center justify-center rounded-xl ${
          isPrimary ? 'bg-slate-900/10' : 'bg-slate-900'
        }`}
      >
        <Ionicons
          name={icon}
          size={22}
          color={isPrimary ? '#0f172a' : '#cbd5f5'}
        />
      </View>
    </View>
  );
}
