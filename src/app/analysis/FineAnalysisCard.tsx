import { View, Text, Pressable } from 'react-native';

interface FineAnalysisCardProps {
  onStartAnalysis: () => void;
}

export default function FineAnalysisCard({
  onStartAnalysis,
}: FineAnalysisCardProps) {
  return (
    <View className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 px-5 py-5">
      <Text className="text-sm font-semibold text-white">
        Análise técnica de multa
      </Text>

      <Text className="mt-1 text-sm text-slate-500 leading-relaxed">
        Informe manualmente os dados da multa para
        executar uma análise técnica formal.
      </Text>

      <Pressable
        onPress={onStartAnalysis}
        className="mt-4 rounded-xl bg-amber-400 py-4 active:opacity-90"
      >
        <Text className="text-center text-xs font-semibold uppercase tracking-widest text-slate-900">
          Adicionar multa para análise
        </Text>
      </Pressable>

      <Text className="mt-3 text-center text-[10px] leading-relaxed text-slate-600">
        A análise não garante êxito administrativo
        ou jurídico.
      </Text>
    </View>
  );
}
