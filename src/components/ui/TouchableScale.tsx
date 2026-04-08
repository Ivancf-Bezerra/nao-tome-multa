import React, { useRef } from 'react';
import { Animated, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

type Props = PressableProps & {
  children: React.ReactNode;
  scaleFrom?: number;
  opacityPressed?: number;
  style?: StyleProp<ViewStyle>;
};

export default function TouchableScale({
  children,
  scaleFrom = 0.96,
  opacityPressed = 0.7,
  style,
  onPressIn,
  onPressOut,
  ...rest
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  function animate(to: number) {
    Animated.spring(scale, {
      toValue: to,
      useNativeDriver: true,
      friction: 9,
      tension: 90,
    }).start();
    Animated.timing(opacity, {
      toValue: to === 1 ? 1 : opacityPressed,
      duration: 120,
      useNativeDriver: true,
    }).start();
  }

  return (
    <Animated.View style={[{ transform: [{ scale }], opacity }, style]}>
      <Pressable
        {...rest}
        onPressIn={(e) => {
          animate(scaleFrom);
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          animate(1);
          onPressOut?.(e);
        }}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

