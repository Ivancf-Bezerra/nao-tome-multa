import { View, Text } from 'react-native';
import { useAnalysis } from '../../context/AnalysisContext';

export default function AnalysisResultCard() {
  const { currentAnalysis } = useAnalysis();

  if (!currentAnalysis) {
    return (
      <View className="mb-6 rounded-2xl bg-slate-800 px-6 py-5">
        <Text className="text-sm text-slate-400">
          Nenhuma análise em andamento no momento.
        </Text>
      </View>
    );
  }

  if (currentAnalysis.status === 'processing') {
    return (
      <View className="mb-6 rounded-2xl bg-slate-800 px-6 py-5">
        <Text className="text-sm font-medium text-white">
          Análise em andamento
        </Text>

        <Text className="mt-2 text-sm text-slate-400">
          O sistema está verificando os requisitos formais do auto
          de infração.
        </Text>
      </View>
    );
  }

  if (currentAnalysis.status === 'completed') {
    return (
      <View className="mb-6 rounded-2xl bg-slate-800 px-6 py-5">
        <Text className="text-sm font-medium text-white">
          Análise concluída
        </Text>

        <Text className="mt-2 text-sm text-slate-400">
          Resultado:{' '}
          {currentAnalysis.result === 'regular'
            ? 'Nenhuma inconsistência identificada.'
            : 'Foram identificadas possíveis inconsistências formais.'}
        </Text>
      </View>
    );
  }

  return null;
}
