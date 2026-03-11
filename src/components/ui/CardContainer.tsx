// src/components/ui/CardContainer.tsx
import { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { useThemeClasses } from '../../context/ThemeContext';

interface CardContainerProps {
  children: ReactNode;
  variant?: 'primary' | 'default';
  onPress?: () => void;
}

export default function CardContainer({
  children,
  variant = 'default',
  onPress,
}: CardContainerProps) {
  const Container = onPress ? Pressable : View;
  const tc = useThemeClasses();

  const variants = {
    primary:
      'mb-6 rounded-3xl bg-amber-400 px-6 py-6 active:opacity-90',
    default:
      `mb-6 rounded-3xl px-6 py-6 ${tc.card}`,
  };

  return (
    <Container
      onPress={onPress}
      className={variants[variant]}
    >
      {children}
    </Container>
  );
}
