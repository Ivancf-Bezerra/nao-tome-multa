import React from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { StatusMultaEnviada } from '../../data/status/types';
import { STATUS_LABELS } from '../../data/status/types';
import type { InconsistencySeverity } from '../../data/inconsistencies/types';

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
  const hasRecurso = Boolean(item?.recursoJARI?.trim());

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/60">
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className="rounded-t-3xl border-t border-slate-800 bg-slate-900 px-6 pt-6 pb-8 max-h-[85%]">
          {!item ? (
            <View className="py-10 items-center justify-center">
              <ActivityIndicator />
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={{ paddingBottom: 18 }}
              showsVerticalScrollIndicator={false}
            >
              <Text className="text-base font-semibold text-white">
                Recurso à JARI
              </Text>
              <Text className="text-slate-400 text-xs mt-1">
                Conteúdo técnico-informacional. Não constitui orientação legal. Disponível quando a defesa foi indeferida.
              </Text>

              {/* INFO DA MULTA */}
              <View className="mt-4 rounded-2xl border border-slate-800 bg-slate-800/50 p-4">
                <Text className="text-white font-semibold">
                  AIT #{item.aitNumber || item.id}
                </Text>
                {item.description ? (
                  <Text className="text-slate-400 text-sm mt-1">
                    {item.description}
                  </Text>
                ) : null}
                <View className="flex-row items-center justify-between mt-2">
                  <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={14} color="#94a3b8" />
                    <Text className="text-slate-300 text-xs ml-2">
                      {formatDate(item.updatedAt)}
                    </Text>
                  </View>
                  <View
                    className="rounded-lg px-2 py-1"
                    style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                  >
                    <Text className="text-xs font-semibold text-red-400">
                      {STATUS_LABELS[item.status]}
                    </Text>
                  </View>
                </View>
              </View>

              {/* ACHADOS (inconsistências) */}
              {item.findings && item.findings.length > 0 && (
                <View className="mt-5">
                  <Text className="text-white font-semibold mb-3">
                    Inconsistências detectadas ({item.findings.length})
                  </Text>
                  {item.findings.map((f) => (
                    <View
                      key={f.code}
                      className="rounded-2xl border border-slate-800 bg-slate-900 p-4 mb-3"
                    >
                      <View className="flex-row items-center gap-2">
                        <Ionicons
                          name={getSeverityIcon(f.severity)}
                          size={16}
                          color={getSeverityColor(f.severity)}
                        />
                        <View className="flex-1">
                          <Text className="text-white font-semibold text-sm">
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
                      <Text className="text-slate-400 text-sm mt-2">
                        {f.description}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* RECURSO JARI (texto gerado) */}
              {hasRecurso && (
                <View className="mt-5">
                  <Text className="text-amber-400/90 text-xs font-semibold mb-3">
                    Recurso à JARI
                  </Text>
                  <View className="rounded-2xl border border-slate-800 bg-slate-800/50 p-4">
                    <TextInput
                      value={item.recursoJARI ?? ''}
                      editable={false}
                      multiline
                      textAlignVertical="top"
                      className="text-slate-300 text-xs leading-relaxed min-h-[200px]"
                      selectTextOnFocus
                    />
                  </View>

                  {/* Salvar e enviar recurso à JARI */}
                  {onSaveAndSendRecurso && (
                    <Pressable
                      onPress={onSaveAndSendRecurso}
                      className="mt-4 rounded-xl border border-amber-400/50 bg-amber-400/20 py-3 flex-row items-center justify-center gap-2 active:opacity-90"
                    >
                      <Ionicons name="send" size={18} color="#fbbf24" />
                      <Text className="text-sm font-semibold text-amber-400">
                        Salvar e enviar recurso à JARI
                      </Text>
                      {saveFeedback && (
                        <Text className="text-emerald-400 text-xs font-medium ml-1">
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
                    isSaving ? 'bg-slate-800' : 'bg-amber-400 active:opacity-90'
                  }`}
                >
                  {isSaving ? (
                    <View className="flex-row items-center justify-center gap-3">
                      <ActivityIndicator color="#0f172a" />
                      <Text className="text-sm font-semibold text-slate-500">
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
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-800 py-4 active:opacity-90"
                >
                  <View className="flex-row items-center justify-center gap-2">
                    <Ionicons name="arrow-back" size={18} color="#e2e8f0" />
                    <Text className="text-sm font-semibold text-slate-200">
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
