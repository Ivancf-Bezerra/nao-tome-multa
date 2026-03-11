import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';

import { useStatusMultas } from '../../context/StatusMultasContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { useThemeClasses } from '../../context/ThemeContext';
import { addStatusMulta } from '../../storage/statusStorage';
import { buildSampleStatusIndeferidos } from '../../data/status/sampleStatusMultas';
import { useTechnicalProfile } from '../../context/TechnicalProfileContext';
import { buildDefense } from '../../services/analysis/DefenseBuilder';
import RecursoJARIModal from '../../components/status/RecursoJARIModal';
import {
  STATUS_LABELS,
  STATUS_DESCRIPTIONS,
  type StatusMultaEnviada,
  type StatusMultaEnviadaCode,
} from '../../data/status/types';

function statusColor(code: StatusMultaEnviadaCode): string {
  switch (code) {
    case 'deferido':
      return '#22c55e';
    case 'indeferido':
      return '#ef4444';
    case 'em_analise':
      return '#fbbf24';
    case 'enviada':
      return '#60a5fa';
    default:
      return '#94a3b8';
  }
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

/** Opção de recurso JARI só quando o status indica resposta à defesa (defesa indeferida). */
function canShowJARIOption(item: StatusMultaEnviada): boolean {
  return item.status === 'indeferido' && Boolean(item.findings?.length) && Boolean(item.input);
}

function hasRecursoJARI(item: StatusMultaEnviada): boolean {
  return Boolean(item.recursoJARI?.trim());
}

type StatusCardProps = {
  item: StatusMultaEnviada;
  onOpenJARIModal: (item: StatusMultaEnviada) => void;
  canUseJARI: boolean;
};

function StatusCard({ item, onOpenJARIModal, canUseJARI }: StatusCardProps) {
  const tc = useThemeClasses();
  const color = statusColor(item.status);
  const eligibleForJARI = canShowJARIOption(item);
  const showJARIOption = canUseJARI && eligibleForJARI;
  const hasRecurso = hasRecursoJARI(item);

  return (
    <View className={`mb-4 rounded-2xl p-4 ${tc.cardAlt}`}>
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className={`font-semibold ${tc.text}`}>
            AIT #{item.aitNumber || item.id}
          </Text>
          {item.description ? (
            <Text className={`${tc.textMuted} text-sm mt-1`} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
        </View>
        <View
          className="rounded-lg px-2.5 py-1"
          style={{ backgroundColor: `${color}20` }}
        >
          <Text
            className="text-xs font-semibold"
            style={{ color }}
          >
            {STATUS_LABELS[item.status]}
          </Text>
        </View>
      </View>
      <Text className={`${tc.textSubtle} text-xs mt-3 leading-5`}>
        {STATUS_DESCRIPTIONS[item.status]}
      </Text>
      {item.lastMessage ? (
        <Text className={`${tc.buttonSecondaryText} text-sm mt-2`}>
          {item.lastMessage}
        </Text>
      ) : null}
      <View className="flex-row items-center mt-3">
        <Ionicons name="time-outline" size={12} color={tc.iconMuted} />
        <Text className={`${tc.textSubtle} text-xs ml-2`}>
          Atualizado em {formatDate(item.updatedAt)}
        </Text>
      </View>

      {showJARIOption && (
        <Pressable
          onPress={() => onOpenJARIModal(item)}
          className="mt-4 rounded-xl border border-amber-400/50 bg-amber-400/10 py-3 flex-row items-center justify-center gap-2 active:opacity-90"
        >
          <Ionicons name="document-text-outline" size={18} color="#f59e0b" />
          <Text className="text-sm font-semibold text-amber-500">
            {hasRecurso ? 'Ver / editar recurso à JARI' : 'Gerar recurso à JARI'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

export default function StatusScreen() {
  const { user } = useUser();
  const { items, isLoaded, refresh, markAsRead, updateStatus, deleteStatus } =
    useStatusMultas();
  const { profile } = useTechnicalProfile();
  const { plan, isActive } = useSubscription();
  const tc = useThemeClasses();
  const canUseJARI = isActive && plan === 'monthly';
  const [selectedJARIItem, setSelectedJARIItem] = useState<StatusMultaEnviada | null>(null);
  const [isSavingJARI, setIsSavingJARI] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);
  const [isLoadingSamples, setIsLoadingSamples] = useState(false);

  async function handleLoadSamples() {
    if (!user?.id || isLoadingSamples) return;
    setIsLoadingSamples(true);
    try {
      const samples = buildSampleStatusIndeferidos();
      for (const item of samples) {
        await addStatusMulta(user.id, item);
      }
      await refresh();
    } finally {
      setIsLoadingSamples(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      refresh();
      markAsRead();
    }, [refresh, markAsRead]),
  );

  async function handleGenerateJARI() {
    if (!selectedJARIItem?.findings?.length || !selectedJARIItem?.input) return;
    setIsSavingJARI(true);
    try {
      const built = buildDefense(
        selectedJARIItem.findings,
        profile,
        selectedJARIItem.input,
      );
      await updateStatus(selectedJARIItem.id, { recursoJARI: built.recursoJARI });
      setSelectedJARIItem((prev) =>
        prev ? { ...prev, recursoJARI: built.recursoJARI } : null,
      );
    } finally {
      setIsSavingJARI(false);
    }
  }

  async function handleSaveAndSendRecurso() {
    if (!selectedJARIItem?.recursoJARI?.trim()) return;
    setSaveFeedback(true);
    await updateStatus(selectedJARIItem.id, {
      recursoJARI: selectedJARIItem.recursoJARI ?? '',
    });
    try {
      const message =
        `RECURSO À JARI — NÃO TOME MULTA\n\n` +
        `AIT: ${selectedJARIItem.aitNumber}\n` +
        `${selectedJARIItem.description ?? ''}\n\n` +
        selectedJARIItem.recursoJARI;
      await Share.share({ message });
    } catch {
      Alert.alert(
        'Falha ao compartilhar',
        'Não foi possível abrir o compartilhamento.',
      );
    }
    setTimeout(() => {
      setSaveFeedback(false);
      setSelectedJARIItem(null);
    }, 400);
  }

  function handleDeleteJARIRecord() {
    if (!selectedJARIItem) return;
    deleteStatus(selectedJARIItem.id);
    setSelectedJARIItem(null);
  }

  return (
    <View className={`flex-1 ${tc.screen}`}>
      <StatusBar style={tc.statusBar} />

      <LinearGradient colors={[...tc.screenGradient]} style={{ flex: 1 }}>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <View className="w-[90%] self-center pt-4 pb-6">
            <Text className={`${tc.text} text-xl font-semibold`}>
              Status das multas
            </Text>
            <Text className={`${tc.textMuted} text-sm mt-2`}>
              Veja o andamento das defesas enviadas.
            </Text>
            {__DEV__ && (
              <Pressable
                onPress={handleLoadSamples}
                disabled={isLoadingSamples}
                className="mt-4 rounded-xl border border-amber-400/50 bg-amber-400/10 py-3 active:opacity-90"
              >
                <Text className="text-center text-sm font-semibold text-amber-500">
                  {isLoadingSamples ? 'Carregando…' : 'Carregar exemplos de status (indeferido)'}
                </Text>
              </Pressable>
            )}
          </View>

          {!isLoaded ? (
            <View className="flex-1 items-center justify-center">
              <Text className={`${tc.textSubtle} text-sm`}>Carregando…</Text>
            </View>
          ) : items.length === 0 ? (
            <View className="flex-1 items-center justify-center px-8">
              <View className={`h-16 w-16 rounded-full items-center justify-center mb-4 border ${tc.buttonSecondary}`}>
                <Ionicons name="send-outline" size={28} color={tc.iconMuted} />
              </View>
              <Text className={`${tc.text} text-base font-semibold text-center`}>
                Nenhuma multa enviada ainda
              </Text>
              <Text className={`${tc.textMuted} text-sm text-center mt-2 leading-relaxed`}>
                Quando você compartilhar uma defesa pela aba Defesas, ela aparecerá aqui para acompanhamento de status.
              </Text>
            </View>
          ) : (
            <ScrollView
              className="flex-1 px-6"
              contentContainerStyle={{ paddingBottom: 32 }}
              showsVerticalScrollIndicator={false}
            >
              {items.map((item) => (
                <StatusCard
                  key={item.id}
                  item={item}
                  onOpenJARIModal={setSelectedJARIItem}
                    canUseJARI={canUseJARI}
                />
              ))}
            </ScrollView>
          )}
        </SafeAreaView>
      </LinearGradient>

      <RecursoJARIModal
        visible={Boolean(selectedJARIItem)}
        item={selectedJARIItem}
        isSaving={isSavingJARI}
        saveFeedback={saveFeedback}
        onClose={() => setSelectedJARIItem(null)}
        onGenerateJARI={handleGenerateJARI}
        onSaveAndSendRecurso={handleSaveAndSendRecurso}
        onDelete={handleDeleteJARIRecord}
      />
    </View>
  );
}
