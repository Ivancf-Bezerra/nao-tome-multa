import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import InfractionForm, { InfractionFormData } from './InfractionForm';

import { buildAnalysisResult } from '../../services/analysis/AnalysisResult';
import { analyzeInfractions } from '../../services/analysis/TechnicalAnalyzer';
import { useInfractionSearch } from '../../services/infractions/useInfractionSearch';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.9;

export default function InfractionAnalysisScreen() {
  const router = useRouter();
  const { state, startManualAnalysis } = useInfractionSearch();

  const [form, setForm] = useState<InfractionFormData>({
    id: '',
    description: '',
    notes: '',
  });

  const canAnalyze =
    form.id.trim().length >= 3 && form.description.trim().length >= 5;

  /* =======================
     RESULTADO DA ANÁLISE
     ======================= */
  useEffect(() => {
    if (state.status !== 'success' || !state.data) return;

    console.log('==============================');
    console.log('[ANÁLISE TÉCNICA] INÍCIO');
    console.log('Multa informada pelo usuário:');
    console.log(JSON.stringify(state.data.infraction, null, 2));

    const analyzed = analyzeInfractions([state.data.infraction]);

    console.log('Resultado da análise técnica:');
    console.log(JSON.stringify(analyzed, null, 2));

    const result = buildAnalysisResult(analyzed);

    console.log('Resumo consolidado:');
    console.log(JSON.stringify(result, null, 2));

    console.log('[ANÁLISE TÉCNICA] FIM');
    console.log('==============================');

    // ⚠️ NÃO navega
    // ⚠️ NÃO salva
    // ⚠️ NÃO fecha modal
  }, [state.status, state.data]);

  return (
    <View className="flex-1 bg-black/50">
      <StatusBar style="light" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-end"
      >
        <SafeAreaView
          edges={['bottom']}
          className="flex-1 rounded-t-3xl bg-slate-900"
          style={{ maxHeight: SHEET_MAX_HEIGHT }}
        >
          {/* HEADER */}
          <View className="border-b border-slate-800 px-6 pt-4 pb-4">
            <View className="mb-3 h-1 w-10 self-center rounded-full bg-slate-600" />

            <View className="flex-row items-center justify-between">
              <Text className="text-base font-semibold text-white">
                Dados da multa
              </Text>

              <Pressable onPress={() => router.back()}>
                <Text className="text-sm text-slate-500">Fechar</Text>
              </Pressable>
            </View>

            <Text className="mt-1 text-sm text-slate-500">
              Informe os dados conforme constam na notificação oficial.
            </Text>
          </View>

          {/* CONTEÚDO */}
          <ScrollView
            className="px-6"
            contentContainerStyle={{
              paddingBottom: 24,
            }}
            showsVerticalScrollIndicator={false}
          >
            <InfractionForm data={form} onChange={setForm} />
          </ScrollView>

          {/* FOOTER */}
          <View className="border-t border-slate-800 px-6 py-4">
            <Pressable
              disabled={!canAnalyze}
              onPress={() =>
                startManualAnalysis({
                  id: form.id.trim(),
                  description: form.description.trim(),
                  notes: form.notes.trim(),
                })
              }
              className={`rounded-xl py-4 ${
                canAnalyze ? 'bg-amber-400' : 'bg-slate-800'
              }`}
            >
              <Text
                className={`text-center text-sm font-semibold ${
                  canAnalyze ? 'text-slate-900' : 'text-slate-500'
                }`}
              >
                Iniciar análise técnica
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}
