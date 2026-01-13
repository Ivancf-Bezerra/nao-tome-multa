import {
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AnalysisResult } from '../../services/analysis/AnalysisResult';

interface TechnicalExtractModalProps {
  visible: boolean;
  analysis: AnalysisResult | null;
  onClose: () => void;
}

export default function TechnicalExtractModal({
  visible,
  analysis,
  onClose,
}: TechnicalExtractModalProps) {
  const router = useRouter();

  if (!visible || !analysis) {
    return null;
  }

  const totalInfractions =
    analysis.totalInfractions ?? 0;

  const findingsCount =
    analysis.findingsCount ?? 0;

  const hasRelevantFindings =
    analysis.hasRelevantFindings ?? false;

  function handleGoToDefense() {
    onClose();
    router.push('/defenses');
  }

  function handleRetry() {
    onClose();
  }

  return (
    <View className="absolute inset-0 z-50">
      {/* BACKDROP */}
      <Pressable
        onPress={onClose}
        className="absolute inset-0 bg-black/60"
      />

      {/* CONTEÚDO */}
      <View className="absolute bottom-0 w-full rounded-t-3xl bg-slate-900 px-6 pt-6 pb-8">
        {/* HEADER */}
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-base font-semibold text-white">
            Extrato técnico da análise
          </Text>

          <Pressable onPress={onClose}>
            <Ionicons
              name="close"
              size={22}
              color="#94a3b8"
            />
          </Pressable>
        </View>

        <Text className="mb-6 text-sm text-slate-500">
          Resumo formal com base nos dados informados
          manualmente.
        </Text>

        {/* CONTEÚDO */}
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-4">
            <Text className="text-xs uppercase tracking-wide text-slate-400">
              Infrações analisadas
            </Text>
            <Text className="mt-1 text-sm text-white">
              {totalInfractions}
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-xs uppercase tracking-wide text-slate-400">
              Achados técnicos
            </Text>
            <Text className="mt-1 text-sm text-white">
              {findingsCount}
            </Text>
          </View>

          <View className="mb-2">
            <Text className="text-xs uppercase tracking-wide text-slate-400">
              Situação geral
            </Text>
            <Text
              className={`mt-1 text-sm font-medium ${
                hasRelevantFindings
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {hasRelevantFindings
                ? 'Existem apontamentos técnicos'
                : 'Nenhum apontamento relevante'}
            </Text>
          </View>

          {!hasRelevantFindings && (
            <Text className="mt-4 text-xs leading-relaxed text-slate-500">
              Caso deseje, você pode revisar os dados
              informados e executar uma nova análise.
            </Text>
          )}
        </ScrollView>

        {/* AÇÕES */}
        <View className="mt-6 gap-3">
          {/* BOTÃO SEMPRE VISÍVEL */}
          <Pressable
            onPress={handleRetry}
            className="rounded-xl border border-slate-700 py-4"
          >
            <Text className="text-center text-xs font-semibold uppercase tracking-widest text-slate-300">
              Refazer análise
            </Text>
          </Pressable>

          {/* CTA CONDICIONAL */}
          {hasRelevantFindings && (
            <Pressable
              onPress={handleGoToDefense}
              className="rounded-xl bg-amber-400 py-4"
            >
              <Text className="text-center text-xs font-semibold uppercase tracking-widest text-slate-900">
                Ir para defesas
              </Text>
            </Pressable>
          )}
        </View>

        <Text className="mt-4 text-center text-[10px] leading-relaxed text-slate-600">
          Este extrato é informativo e não constitui
          orientação jurídica ou garantia de resultado.
        </Text>
      </View>
    </View>
  );
}
