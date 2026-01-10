// src/components/ui/CardContainer.tsx
import { View, Pressable } from 'react-native';
import { ReactNode } from 'react';

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

  const variants = {
    primary:
      'mb-6 rounded-3xl bg-[#fbbf24] px-6 py-6 active:opacity-90',
    default:
      'mb-6 rounded-3xl border border-slate-700 bg-slate-800 px-6 py-6',
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
