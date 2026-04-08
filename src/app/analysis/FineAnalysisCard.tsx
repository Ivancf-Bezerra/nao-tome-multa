import { View, Text } from 'react-native';

import { useThemeClasses } from '../../context/ThemeContext';
import TouchableScale from '../../components/ui/TouchableScale';

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

      <TouchableScale onPress={onStartAnalysis} style={{ marginTop: 16 }}>
        <View className="rounded-xl bg-amber-400 py-4">
          <Text className="text-center text-xs font-semibold uppercase tracking-widest text-slate-900">
            Adicionar multa para análise
          </Text>
        </View>
      </TouchableScale>

      <Text className={`mt-3 text-center text-[10px] leading-relaxed ${tc.textSubtle}`}>
        A análise não garante resultado administrativo ou judicial.
      </Text>
    </View>
  );
}
