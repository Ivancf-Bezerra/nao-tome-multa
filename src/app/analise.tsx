import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

import { useAnalysis } from '../context/AnalysisContext';

export default function Analise() {
  const router = useRouter();
  const { currentAnalysis, completeAnalysis } = useAnalysis();

  /**
   * SIMULAÇÃO DE PROCESSAMENTO
   *
   * FUTURO:
   * - remover setTimeout
   * - substituir por chamada real (backend ou engine local)
   * - lidar com erro e timeout
   */
  useEffect(() => {
    if (!currentAnalysis || currentAnalysis.status !== 'processing') {
      return;
    }

    const timer = setTimeout(() => {
      const simulatedResult =
        Math.random() > 0.5 ? 'regular' : 'inconsistent';

      // 🚨 SIMULAÇÃO — conclusão artificial
      completeAnalysis(simulatedResult); // REMOVER quando análise real existir

      router.replace('/(tabs)/home');
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentAnalysis]);

  return (
    <View className="flex-1 bg-slate-900">
      <StatusBar style="light" />

      <LinearGradient colors={['#0f172a', '#1e293b']} style={{ flex: 1 }}>
        <SafeAreaView className="flex-1 px-6 pt-8">
          <Text className="text-lg font-semibold text-white">
            Análise do auto de infração
          </Text>

          <Text className="mt-3 text-sm leading-relaxed text-slate-400">
            O documento foi recebido e está sendo analisado com base
            em critérios técnicos formais.
          </Text>

          <View className="mt-10 items-center">
            <ActivityIndicator size="small" color="#fbbf24" />

            <Text className="mt-4 text-sm text-slate-400">
              Análise em andamento…
            </Text>

            <Text className="mt-2 text-xs text-slate-500">
              Este processo é realizado localmente.
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
