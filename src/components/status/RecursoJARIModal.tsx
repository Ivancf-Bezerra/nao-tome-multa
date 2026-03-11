import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';

import { useThemeClasses } from '../../context/ThemeContext';
import type { InconsistencySeverity } from '../../data/inconsistencies/types';
import type { StatusMultaEnviada } from '../../data/status/types';
import { STATUS_LABELS } from '../../data/status/types';

type Props = {
  visible: boolean;
  item: StatusMultaEnviada | null;
  isSaving: boolean;
  saveFeedback?: boolean;
  onClose: () => void;
  onGenerateJARI: () => void;
  onSaveAndSendRecurso?: () => void;
  onDelete: () => void;
};

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

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('pt-BR');
  } catch {
    return iso;
  }
}

export default function RecursoJARIModal({
  visible,
  item,
  isSaving,
  saveFeedback = false,
  onClose,
  onGenerateJARI,
  onSaveAndSendRecurso,
  onDelete,
}: Props) {
  const tc = useThemeClasses();
  const hasRecurso = Boolean(item?.recursoJARI?.trim());

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className={`flex-1 justify-end ${tc.modalOverlay}`}>
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className={`rounded-t-3xl border-t px-6 pt-6 pb-8 max-h-[85%] ${tc.modalBg} ${tc.border}`}>
          {!item ? (
            <View className="py-10 items-center justify-center">
              <ActivityIndicator />
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={{ paddingBottom: 18 }}
              showsVerticalScrollIndicator={false}
            >
              <Text className={`text-base font-semibold ${tc.text}`}>
                Recurso à JARI
              </Text>
              <Text className={`${tc.textMuted} text-xs mt-1`}>
                Conteúdo técnico-informacional. Não constitui orientação legal. Disponível quando a defesa foi indeferida.
              </Text>

              {/* INFO DA MULTA */}
              <View className={`mt-4 rounded-2xl p-4 ${tc.cardAlt}`}>
                <Text className={`font-semibold ${tc.text}`}>
                  AIT #{item.aitNumber || item.id}
                </Text>
                {item.description ? (
                  <Text className={`${tc.textMuted} text-sm mt-1`}>
                    {item.description}
                  </Text>
                ) : null}
                <View className="flex-row items-center justify-between mt-2">
                  <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={14} color={tc.iconMuted} />
                    <Text className={`${tc.buttonSecondaryText} text-xs ml-2`}>
                      {formatDate(item.updatedAt)}
                    </Text>
                  </View>
                  <View
                    className="rounded-lg px-2 py-1"
                    style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                  >
                    <Text className="text-xs font-semibold text-red-500">
                      {STATUS_LABELS[item.status]}
                    </Text>
                  </View>
                </View>
              </View>

              {/* ACHADOS (inconsistências) */}
              {item.findings && item.findings.length > 0 && (
                <View className="mt-5">
                  <Text className={`font-semibold mb-3 ${tc.text}`}>
                    Inconsistências detectadas ({item.findings.length})
                  </Text>
                  {item.findings.map((f) => (
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
                            {getSeverityLabel(f.severity)} · {f.legalBasis}
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

              {/* RECURSO JARI (texto gerado) */}
              {hasRecurso && (
                <View className="mt-5">
                  <Text className="text-amber-500 text-xs font-semibold mb-3">
                    Recurso à JARI
                  </Text>
                  <View className={`rounded-2xl p-4 ${tc.cardAlt}`}>
                    <TextInput
                      value={item.recursoJARI ?? ''}
                      editable={false}
                      multiline
                      textAlignVertical="top"
                      className={`text-xs leading-relaxed min-h-[200px] ${tc.buttonSecondaryText}`}
                      selectTextOnFocus
                    />
                  </View>

                  {/* Salvar e enviar recurso à JARI */}
                  {onSaveAndSendRecurso && (
                    <Pressable
                      onPress={onSaveAndSendRecurso}
                      className="mt-4 rounded-xl border border-amber-400/50 bg-amber-400/20 py-3 flex-row items-center justify-center gap-2 active:opacity-90"
                    >
                      <Ionicons name="send" size={18} color="#f59e0b" />
                      <Text className="text-sm font-semibold text-amber-500">
                        Salvar e enviar recurso à JARI
                      </Text>
                      {saveFeedback && (
                        <Text className="text-emerald-500 text-xs font-medium ml-1">
                          Salvo!
                        </Text>
                      )}
                    </Pressable>
                  )}
                </View>
              )}

              {/* BOTÃO GERAR (igual ao Gerar defesa técnica) */}
              {!hasRecurso && (
                <Pressable
                  disabled={isSaving}
                  onPress={onGenerateJARI}
                  className={`mt-6 rounded-xl py-4 ${
                    isSaving ? tc.buttonSecondary : 'bg-amber-400 active:opacity-90'
                  }`}
                >
                  {isSaving ? (
                    <View className="flex-row items-center justify-center gap-3">
                      <ActivityIndicator color="#0f172a" />
                      <Text className={`text-sm font-semibold ${tc.textSubtle}`}>
                        Gerando…
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-center text-sm font-semibold text-slate-900">
                      Gerar recurso à JARI
                    </Text>
                  )}
                </Pressable>
              )}

              {/* VOLTAR e EXCLUIR (mesmos botões do modal de defesa) */}
              <View className="mt-3 flex-row gap-3">
                <Pressable
                  onPress={onClose}
                  className={`flex-1 rounded-xl py-4 active:opacity-90 border ${tc.buttonSecondary}`}
                >
                  <View className="flex-row items-center justify-center gap-2">
                    <Ionicons name="arrow-back" size={18} color={tc.iconPrimary} />
                    <Text className={`text-sm font-semibold ${tc.buttonSecondaryText}`}>
                      Voltar
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={onDelete}
                  className="flex-1 rounded-xl border border-red-500/40 bg-red-500/10 py-4 active:opacity-90"
                >
                  <View className="flex-row items-center justify-center gap-2">
                    <Ionicons name="trash-outline" size={18} color="#f87171" />
                    <Text className="text-sm font-semibold text-red-400">
                      Excluir registro
                    </Text>
                  </View>
                </Pressable>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}
