import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';

import { useStatusMultas } from '../../context/StatusMultasContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { useThemeClasses } from '../../context/ThemeContext';
import { usePlanUpgrade } from '../../context/PlanUpgradeContext';
import { addStatusMulta } from '../../storage/statusStorage';
import { buildSampleStatusIndeferidos } from '../../data/status/sampleStatusMultas';
import { useTechnicalProfile } from '../../context/TechnicalProfileContext';
import { buildDefense } from '../../services/analysis/DefenseBuilder';
import RecursoJARIModal from '../../components/status/RecursoJARIModal';
import JARIGuideModal from '../../components/status/JARIGuideModal';
import {
  STATUS_LABELS,
  STATUS_DESCRIPTIONS,
  type StatusMultaEnviada,
  type StatusMultaEnviadaCode,
} from '../../data/status/types';
import type { InconsistencySeverity } from '../../data/inconsistencies/types';
import TouchableScale from '../../components/ui/TouchableScale';
import GlobalHeader from '../../components/layout/GlobalHeader';

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

function getSeverityIcon(severity: InconsistencySeverity) {
  if (severity === 'critical') return 'alert-circle' as const;
  if (severity === 'high') return 'warning' as const;
  return 'information-circle' as const;
}

function getSeverityColor(severity: InconsistencySeverity): string {
  if (severity === 'critical') return '#ef4444';
  if (severity === 'high') return '#f97316';
  if (severity === 'medium') return '#fbbf24';
  return '#94a3b8';
}

function getSeverityLabel(severity: InconsistencySeverity): string {
  if (severity === 'critical') return 'Crítico';
  if (severity === 'high') return 'Alto';
  if (severity === 'medium') return 'Médio';
  return 'Baixo';
}

/** Opção de recurso JARI só quando indeferida com dados suficientes para gerar. */
function canShowJARIOption(item: StatusMultaEnviada): boolean {
  return item.status === 'indeferido' && Boolean(item.findings?.length) && Boolean(item.input);
}

function hasRecursoJARI(item: StatusMultaEnviada): boolean {
  return Boolean(item.recursoJARI?.trim());
}

function statusDetailTitle(status: StatusMultaEnviadaCode): string {
  switch (status) {
    case 'enviada':     return 'Defesa enviada';
    case 'em_analise':  return 'Defesa em análise';
    case 'deferido':    return 'Defesa aceita';
    case 'indeferido':  return 'Defesa indeferida';
    case 'cancelado':   return 'Registro cancelado';
  }
}

type StatusCardProps = {
  item: StatusMultaEnviada;
  onOpenJARIModal: (item: StatusMultaEnviada) => void;
  canUseJARI: boolean;
  onPressView: (item: StatusMultaEnviada) => void;
  onShowUpgrade: () => void;
};

function StatusCard({ item, onOpenJARIModal, canUseJARI, onPressView, onShowUpgrade }: StatusCardProps) {
  const tc = useThemeClasses();
  const color = statusColor(item.status);
  const eligibleForJARI = canShowJARIOption(item);
  const hasRecurso = hasRecursoJARI(item);
  const secondaryText = item.lastMessage || STATUS_DESCRIPTIONS[item.status];

  return (
    <TouchableScale onPress={() => onPressView(item)} style={{ marginBottom: 16 }}>
      <View className={`rounded-2xl p-4 ${tc.cardAlt}`}>
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className={`font-semibold ${tc.text}`}>
              AIT #{item.aitNumber || item.id}
            </Text>
            {item.description ? (
              <Text className={`${tc.textMuted} text-xs mt-1`} numberOfLines={1}>
                {item.description}
              </Text>
            ) : null}
          </View>
          <View className="rounded-lg px-2.5 py-1 border border-slate-300">
            <Text className="text-xs font-semibold" style={{ color }}>
              {STATUS_LABELS[item.status]}
            </Text>
          </View>
        </View>

        <Text className={`${tc.buttonSecondaryText} text-xs mt-3 leading-5`} numberOfLines={2}>
          {secondaryText}
        </Text>

        <View className="flex-row items-center mt-3">
          <Ionicons name="time-outline" size={12} color={tc.iconMuted} />
          <Text className={`${tc.textSubtle} text-xs ml-2`}>
            Atualizado em {formatDate(item.updatedAt)}
          </Text>
        </View>

        {/* CTA de recurso à JARI — apenas indeferido com dados e plano ativo */}
        {eligibleForJARI && canUseJARI && (
          <Pressable
            onPress={(e) => { e.stopPropagation?.(); onOpenJARIModal(item); }}
            className="mt-4 rounded-xl bg-amber-400 py-3 active:opacity-90"
          >
            <Text className="text-sm font-semibold text-center text-slate-900">
              {hasRecurso ? 'Ver recurso à JARI' : 'Iniciar recurso à JARI'}
            </Text>
          </Pressable>
        )}

        {/* Aviso clicável para indeferido sem plano mensal */}
        {eligibleForJARI && !canUseJARI && (
          <Pressable
            onPress={(e) => { e.stopPropagation?.(); onShowUpgrade(); }}
            className="mt-3 flex-row items-center gap-1.5 active:opacity-70"
          >
            <Ionicons name="lock-closed-outline" size={12} color="#f59e0b" />
            <Text className="text-xs text-amber-600 underline">
              Recurso à JARI — disponível no plano mensal
            </Text>
          </Pressable>
        )}
      </View>
    </TouchableScale>
  );
}

export default function StatusScreen() {
  const { user } = useUser();
  const { items, isLoaded, refresh, markAsRead, updateStatus, deleteStatus } =
    useStatusMultas();
  const { profile } = useTechnicalProfile();
  const { plan, isActive } = useSubscription();
  const tc = useThemeClasses();
  const { showPlanUpgrade } = usePlanUpgrade();
  const canUseJARI = isActive && plan === 'monthly';
  const [selectedJARIItem, setSelectedJARIItem] = useState<StatusMultaEnviada | null>(null);
  const [isSavingJARI, setIsSavingJARI] = useState(false);
  const [isLoadingSamples, setIsLoadingSamples] = useState(false);
  const [viewItem, setViewItem] = useState<StatusMultaEnviada | null>(null);
  const [guideItem, setGuideItem] = useState<StatusMultaEnviada | null>(null);
  const [guideRequireConfirmation, setGuideRequireConfirmation] = useState(false);

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

  async function generateJARIForItem(target: StatusMultaEnviada) {
    if (!target.findings?.length || !target.input) return;
    setIsSavingJARI(true);
    try {
      const built = buildDefense(
        target.findings,
        profile,
        target.input,
      );
      await updateStatus(target.id, { recursoJARI: built.recursoJARI });
      setSelectedJARIItem((prev) =>
        prev && prev.id === target.id ? { ...prev, recursoJARI: built.recursoJARI } : prev,
      );
    } finally {
      setIsSavingJARI(false);
    }
  }

  async function handleGenerateJARI() {
    if (!selectedJARIItem) return;
    await generateJARIForItem(selectedJARIItem);
  }

  /**
   * Chamado ao clicar no botão do card de status.
   * Se o usuário ainda não confirmou as instruções → abre o guia primeiro.
   * Se já confirmou → abre o RecursoJARIModal diretamente.
   */
  function handleOpenJARIFlow(item: StatusMultaEnviada) {
    if (!item.ackJariInstructions) {
      setGuideItem(item);
      setGuideRequireConfirmation(true);
    } else {
      setSelectedJARIItem(item);
    }
  }

  async function handleConfirmGuideAndGenerate() {
    if (!guideItem) return;
    const capturedItem = guideItem;
    // 1. Salva confirmação no storage
    await updateStatus(capturedItem.id, { ackJariInstructions: true });
    const updatedItem: StatusMultaEnviada = { ...capturedItem, ackJariInstructions: true };
    // 2. Fecha guia e abre RecursoJARIModal imediatamente (com estado de carregamento)
    setGuideItem(null);
    setGuideRequireConfirmation(false);
    setSelectedJARIItem(updatedItem);
    // 3. Gera o recurso em background; generateJARIForItem atualiza selectedJARIItem via setSelectedJARIItem((prev) => ...)
    void generateJARIForItem(updatedItem);
  }

  function handleClearRecurso() {
    if (!selectedJARIItem) return;
    Alert.alert(
      'Limpar recurso gerado',
      'O texto do recurso à JARI será removido. Você poderá gerá-lo novamente. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            await updateStatus(selectedJARIItem.id, { recursoJARI: '' });
            setSelectedJARIItem((prev) =>
              prev ? { ...prev, recursoJARI: '' } : prev,
            );
          },
        },
      ],
    );
  }

  return (
    <View className={`flex-1 ${tc.screen}`}>
      <StatusBar style={tc.statusBar} />

      <LinearGradient colors={[...tc.screenGradient]} style={{ flex: 1 }}>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <GlobalHeader />

          <View className="h-4" />

          <View className="w-[90%] self-center" style={{ minHeight: 72 }}>
            <Text className={`${tc.text} text-xl font-semibold`}>
              Status das multas
            </Text>
            <Text
              className={`${tc.textMuted} text-base mt-2 leading-relaxed`}
              numberOfLines={3}
            >
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

          <View className="flex-1">
            <View className="flex-1 mt-4">
              <View
                className={`flex-1 rounded-t-3xl px-6 pt-5 pb-6 ${tc.modalBg} ${tc.border}`}
              >
                <View className="items-center">
                  <View className={`h-1.5 w-14 rounded-full ${tc.divider}`} />
                </View>

                <View className="mt-4 flex-row items-center justify-between">
                  <View className="flex-1 pr-4">
                    <Text className={`${tc.text} text-base font-semibold`}>
                      Histórico de status
                    </Text>
                    <Text className={`${tc.textMuted} text-sm mt-1 leading-relaxed`}>
                      Cada linha reúne AIT, situação e andamento da defesa.
                    </Text>
                  </View>

                  <View className="h-10 w-10 items-center justify-center">
                    <Ionicons name="document-text" size={26} color="#f59e0b" />
                  </View>
                </View>

                <View className="mt-4" style={{ flexGrow: 1 }}>
                  {!isLoaded ? (
                    <View className="flex-1 items-center justify-center">
                      <Text className={`${tc.textSubtle} text-sm`}>Carregando…</Text>
                    </View>
                  ) : items.length === 0 ? (
                    <View className="flex-1 items-center justify-center">
                      <Ionicons name="send-outline" size={28} color={tc.iconMuted} />
                      <Text className={`${tc.text} mt-3 font-semibold`}>
                        Nenhuma defesa enviada ainda
                      </Text>
                      <Text className={`${tc.textMuted} text-center mt-1 text-sm`}>
                        Quando você enviar uma defesa pela aba Defesas, ela aparecerá aqui.
                      </Text>
                    </View>
                  ) : (
                    <ScrollView
                      contentContainerStyle={{ paddingBottom: 24 }}
                      showsVerticalScrollIndicator={false}
                    >
                      {items.map((item) => (
                        <StatusCard
                          key={item.id}
                          item={item}
                          onOpenJARIModal={handleOpenJARIFlow}
                          canUseJARI={canUseJARI}
                          onPressView={(i) => setViewItem(i)}
                          onShowUpgrade={() =>
                            showPlanUpgrade({
                              feature: 'Recurso à JARI',
                              requiredPlan: 'monthly',
                            })
                          }
                        />
                      ))}
                    </ScrollView>
                  )}
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <RecursoJARIModal
        visible={Boolean(selectedJARIItem)}
        item={selectedJARIItem}
        isSaving={isSavingJARI}
        onClose={() => setSelectedJARIItem(null)}
        onGenerateJARI={handleGenerateJARI}
        onRegenerateJARI={handleGenerateJARI}
        onClearRecurso={handleClearRecurso}
      />

      <JARIGuideModal
        visible={Boolean(guideItem)}
        item={guideItem}
        requireConfirmation={guideRequireConfirmation}
        onConfirmAndGenerate={handleConfirmGuideAndGenerate}
        onClose={() => {
          setGuideItem(null);
          setGuideRequireConfirmation(false);
        }}
      />

      {/* DETALHES DA DEFESA — acessível para todos os status */}
      <Modal
        visible={Boolean(viewItem)}
        transparent
        animationType="slide"
        onRequestClose={() => setViewItem(null)}
      >
        <View className={`flex-1 justify-end ${tc.modalOverlay}`}>
          <Pressable
            className="absolute inset-0"
            onPress={() => setViewItem(null)}
          />
          <View className={`rounded-t-3xl border-t max-h-[90%] ${tc.modalBg} ${tc.border}`}>
            {viewItem && (
              <>
                {/* Header fixo */}
                <View
                  className={`absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between rounded-t-3xl px-5 pt-4 pb-3 ${tc.modalBg}`}
                >
                  <View className="flex-1 pr-4">
                    <Text className={`text-base font-semibold ${tc.text}`}>
                      {statusDetailTitle(viewItem.status)}
                    </Text>
                    <Text className={`${tc.textMuted} text-xs mt-0.5`}>
                      AIT #{viewItem.aitNumber || viewItem.id}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-3">
                    <View className="rounded-lg px-2.5 py-1 border border-slate-300">
                      <Text
                        className="text-xs font-semibold"
                        style={{ color: statusColor(viewItem.status) }}
                      >
                        {STATUS_LABELS[viewItem.status]}
                      </Text>
                    </View>
                    <Pressable onPress={() => setViewItem(null)} hitSlop={12}>
                      <Ionicons name="close" size={22} color={tc.iconMuted} />
                    </Pressable>
                  </View>
                </View>

                <ScrollView
                  contentContainerStyle={{
                    paddingTop: 72,
                    paddingHorizontal: 24,
                    paddingBottom: 32,
                  }}
                  showsVerticalScrollIndicator={false}
                >

                {/* Dados da multa */}
                <View className={`rounded-2xl p-4 mb-4 ${tc.cardAlt}`}>
                  {viewItem.description ? (
                    <Text className={`${tc.textMuted} text-sm`}>
                      {viewItem.description}
                    </Text>
                  ) : null}
                  {viewItem.input && (
                    <View className="mt-3 gap-1.5">
                      {viewItem.input.infractionDate ? (
                        <Text className={`${tc.textMuted} text-xs`}>
                          Data da infração: {viewItem.input.infractionDate}
                        </Text>
                      ) : null}
                      {viewItem.input.issuingBody ? (
                        <Text className={`${tc.textMuted} text-xs`}>
                          Órgão: {viewItem.input.issuingBody}
                        </Text>
                      ) : null}
                      {viewItem.input.renainf ? (
                        <Text className={`${tc.textMuted} text-xs`}>
                          RENAINF: {viewItem.input.renainf}
                        </Text>
                      ) : null}
                      {viewItem.input.infractionCode ? (
                        <Text className={`${tc.textMuted} text-xs`}>
                          Código: {viewItem.input.infractionCode}
                        </Text>
                      ) : null}
                    </View>
                  )}
                  <View className="flex-row items-center mt-3">
                    <Ionicons name="time-outline" size={14} color={tc.iconMuted} />
                    <Text className={`${tc.textSubtle} text-xs ml-2`}>
                      Atualizado em {formatDate(viewItem.updatedAt)}
                    </Text>
                  </View>
                </View>

                {/* Mensagem do órgão (se houver) */}
                {viewItem.lastMessage ? (
                  <View className={`rounded-2xl p-4 mb-4 border-l-4 ${tc.cardAlt}`}
                    style={{ borderLeftColor: statusColor(viewItem.status) }}
                  >
                    <Text className={`text-xs font-semibold mb-1`}
                      style={{ color: statusColor(viewItem.status) }}
                    >
                      Resposta do órgão
                    </Text>
                    <Text className={`${tc.buttonSecondaryText} text-sm leading-5`}>
                      {viewItem.lastMessage}
                    </Text>
                  </View>
                ) : null}

                {/* Resumo da análise */}
                {viewItem.summary?.trim() ? (
                  <View className={`rounded-2xl p-4 mb-4 ${tc.cardAlt}`}>
                    <Text className={`font-semibold mb-2 ${tc.text}`}>
                      Resumo
                    </Text>
                    <Text className={`${tc.buttonSecondaryText} text-sm leading-5`}>
                      {viewItem.summary}
                    </Text>
                  </View>
                ) : null}

                {viewItem.findings && viewItem.findings.length > 0 && (
                  <View className="mt-2">
                    <Text className={`font-semibold mb-2 ${tc.text}`}>
                      Inconsistências enviadas ({viewItem.findings.length})
                    </Text>
                    {viewItem.findings.map((f) => (
                      <View
                        key={f.code}
                        className={`rounded-2xl p-4 mb-3 ${tc.cardAlt}`}
                      >
                        <View className="flex-row items-center gap-2">
                          <Ionicons
                            name={getSeverityIcon(f.severity)}
                            size={16}
                            color={getSeverityColor(f.severity)}
                          />
                          <View className="flex-1">
                            <Text className={`font-semibold text-sm ${tc.text}`}>
                              {f.title}
                            </Text>
                            <Text
                              className="text-xs mt-0.5"
                              style={{ color: getSeverityColor(f.severity) }}
                            >
                              {getSeverityLabel(f.severity)}
                              {f.legalBasis ? ` · ${f.legalBasis}` : ''}
                            </Text>
                          </View>
                        </View>
                        <Text className={`${tc.textMuted} text-sm mt-2`}>
                          {f.description}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Texto completo da defesa enviada */}
                <View className="mt-5">
                  <Text className={`${tc.textMuted} text-xs font-semibold mb-3 uppercase tracking-wide`}>
                    Texto da defesa enviada
                  </Text>
                  {viewItem.defesaPrevia?.trim() ? (
                    <View className={`rounded-2xl p-4 ${tc.cardAlt}`}>
                      <TextInput
                        value={viewItem.defesaPrevia}
                        editable={false}
                        multiline
                        textAlignVertical="top"
                        className={`text-sm leading-relaxed min-h-[220px] ${tc.buttonSecondaryText}`}
                        selectTextOnFocus
                      />
                    </View>
                  ) : (
                    <View className={`rounded-2xl p-4 ${tc.cardAlt}`}>
                      <Text className={`${tc.textMuted} text-sm italic`}>
                        Defesa não foi gerada antes do envio.
                      </Text>
                    </View>
                  )}
                </View>

                {/* Aviso de plano para indeferido elegível sem assinatura mensal */}
                {canShowJARIOption(viewItem) && !canUseJARI && (
                  <View className="mt-6 mb-2">
                    <Pressable
                      onPress={() => {
                        setViewItem(null);
                        setTimeout(() =>
                          showPlanUpgrade({ feature: 'Recurso à JARI', requiredPlan: 'monthly' }),
                        300);
                      }}
                      className="rounded-2xl border border-amber-400/40 bg-amber-500/5 p-4 active:opacity-80"
                    >
                      <View className="flex-row items-center gap-2 mb-1">
                        <Ionicons name="lock-closed-outline" size={14} color="#f59e0b" />
                        <Text className="text-xs font-semibold text-amber-600">
                          Recurso à JARI disponível no plano mensal
                        </Text>
                      </View>
                      <Text className={`${tc.textMuted} text-xs leading-relaxed`}>
                        Você pode recorrer à JARI para contestar o indeferimento. Toque aqui para ver os planos disponíveis.
                      </Text>
                    </Pressable>
                  </View>
                )}

                {/* CTA de JARI — visível apenas para indeferido elegível com plano */}
                {canShowJARIOption(viewItem) && canUseJARI && (
                  <View className="mt-6 mb-2">
                    <View className="rounded-2xl border border-amber-400/40 bg-amber-500/5 p-4 mb-3">
                      <Text className={`text-xs font-semibold text-amber-600 mb-1`}>
                        Próximo passo disponível
                      </Text>
                      <Text className={`${tc.textMuted} text-xs leading-relaxed`}>
                        Sua defesa foi indeferida. Você pode apresentar recurso à JARI — o app gera o texto técnico e orienta o envio no sistema do órgão.
                      </Text>
                    </View>
                    <TouchableScale
                      onPress={() => {
                        setViewItem(null);
                        setTimeout(() => handleOpenJARIFlow(viewItem), 300);
                      }}
                    >
                      <View className="rounded-xl bg-amber-400 py-4 items-center">
                        <Text className="text-sm font-semibold text-slate-900">
                          {hasRecursoJARI(viewItem) ? 'Ver recurso à JARI' : 'Iniciar recurso à JARI'}
                        </Text>
                      </View>
                    </TouchableScale>
                  </View>
                )}
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
