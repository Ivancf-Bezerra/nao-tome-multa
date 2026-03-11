import { View, Text, Pressable } from 'react-native';

import { useThemeClasses } from '../../context/ThemeContext';

interface FineAnalysisCardProps {
  onStartAnalysis: () => void;
}

export default function FineAnalysisCard({
  onStartAnalysis,
}: FineAnalysisCardProps) {
  const tc = useThemeClasses();

  return (
    <View className={`mt-6 rounded-2xl px-5 py-5 ${tc.cardAlt}`}>
      <Text className={`text-sm font-semibold ${tc.text}`}>
        Análise técnica de multa
      </Text>

      <Text className={`mt-1 text-sm leading-relaxed ${tc.textSubtle}`}>
        Informe os dados da multa para gerar o parecer técnico.
      </Text>

      <Pressable
        onPress={onStartAnalysis}
        className="mt-4 rounded-xl bg-amber-400 py-4 active:opacity-90"
      >
        <Text className="text-center text-xs font-semibold uppercase tracking-widest text-slate-900">
          Adicionar multa para análise
        </Text>
      </Pressable>

      <Text className={`mt-3 text-center text-[10px] leading-relaxed ${tc.textSubtle}`}>
        A análise não garante resultado administrativo ou judicial.
      </Text>
    </View>
  );
}
