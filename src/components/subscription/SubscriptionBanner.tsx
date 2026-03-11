import { View, Text, Pressable } from 'react-native';

import { useThemeClasses } from '../../context/ThemeContext';

interface SubscriptionBannerProps {
  onSubscribe: () => void;
}

export default function SubscriptionBanner({ onSubscribe }: SubscriptionBannerProps) {
  const tc = useThemeClasses();

  return (
    <View className={`mt-6 rounded-2xl border border-amber-400/20 px-5 py-5 ${tc.card}`}>
      <View className="flex-row items-center gap-3 mb-3">
        <View className="w-8 h-8 rounded-full bg-amber-400/10 items-center justify-center">
          <Text className="text-amber-500 text-sm">🔒</Text>
        </View>
        <Text className={`text-sm font-semibold flex-1 ${tc.text}`}>
          Recurso disponível no plano ativo
        </Text>
      </View>

      <Text className={`${tc.textMuted} text-sm leading-relaxed`}>
        A análise técnica de infrações e a geração de defesas estão disponíveis apenas para assinantes.
      </Text>

      <Pressable
        onPress={onSubscribe}
        className="mt-4 rounded-xl bg-amber-400 py-3 items-center active:opacity-90"
      >
        <Text className="text-slate-900 text-sm font-bold">
          Ver planos de acesso
        </Text>
      </Pressable>

      <Text className={`text-center text-[10px] mt-3 leading-relaxed ${tc.textSubtle}`}>
        Sem fidelidade. Cancele a qualquer momento.
      </Text>
    </View>
  );
}
