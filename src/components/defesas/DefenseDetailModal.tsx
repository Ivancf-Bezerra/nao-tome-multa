import React, { useState } from 'react';
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

import { AnalyzedInfractionRecord, InconsistencySeverity } from './types';

type Props = {
  visible: boolean;
  record: AnalyzedInfractionRecord | null;
  isSaving: boolean;
  saveFeedback?: boolean;
  onClose: () => void;
  onGenerateDefense: () => void;
  onSaveDefense?: () => void;
  onDelete: () => void;
};

type Tab = 'defesa' | 'jari';

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

export default function DefenseDetailModal({
  visible,
  record,
  isSaving,
  saveFeedback = false,
  onClose,
  onGenerateDefense,
  onSaveDefense,
  onDelete,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('defesa');

  const hasDefesa = Boolean(record?.defense?.defesaPrevia?.trim());
  const hasJARI = Boolean(record?.defense?.recursoJARI?.trim());

  const displayText =
    activeTab === 'defesa'
      ? record?.defense?.defesaPrevia ?? ''
      : record?.defense?.recursoJARI ?? '';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/60">
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className="rounded-t-3xl border-t border-slate-800 bg-slate-900 px-6 pt-6 pb-8 max-h-[85%]">
          {!record ? (
            <View className="py-10 items-center justify-center">
              <ActivityIndicator />
            </View>
          ) : (
            <ScrollView contentContainerStyle={{ paddingBottom: 18 }} showsVerticalScrollIndicator={false}>
              {/* HEADER */}
              <Text className="text-base font-semibold text-white">
                Análise técnica
              </Text>
              <Text className="text-slate-400 text-xs mt-1">
                Conteúdo técnico-informacional. Não constitui orientação legal.
              </Text>

              {/* INFO DA MULTA */}
              <View className="mt-4 rounded-2xl border border-slate-800 bg-slate-800/50 p-4">
                <Text className="text-white font-semibold">
                  AIT #{record.input.aitNumber || record.id}
                </Text>
                {Boolean(record.input.description) && (
                  <Text className="text-slate-400 text-sm mt-1">
                    {record.input.description}
                  </Text>
                )}
                <View className="flex-row items-center mt-2">
                  <Ionicons name="time-outline" size={14} color="#94a3b8" />
                  <Text className="text-slate-300 text-xs ml-2">
                    {formatDate(record.analyzedAt)}
                  </Text>
                </View>
              </View>

              {/* ACHADOS */}
              <View className="mt-5">
                <Text className="text-white font-semibold mb-3">
                  Inconsistências detectadas ({record.result.findings.length})
                </Text>

                {record.result.findings.map((f) => (
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

              {/* DEFESA PRÉVIA (inicial só defesa; JARI em botão separado) */}
              {hasDefesa && (
                <View className="mt-5">
                  {/* Tabs só quando já tem Recurso JARI gerado */}
                  {hasJARI ? (
                    <View className="flex-row rounded-xl border border-slate-700 bg-slate-800 p-1 mb-4">
                      <Pressable
                        onPress={() => setActiveTab('defesa')}
                        className={`flex-1 rounded-lg py-2 items-center ${
                          activeTab === 'defesa' ? 'bg-slate-700' : ''
                        }`}
                      >
                        <Text
                          className={`text-xs font-semibold ${
                            activeTab === 'defesa' ? 'text-white' : 'text-slate-500'
                          }`}
                        >
                          Defesa Prévia
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => setActiveTab('jari')}
                        className={`flex-1 rounded-lg py-2 items-center ${
                          activeTab === 'jari' ? 'bg-slate-700' : ''
                        }`}
                      >
                        <Text
                          className={`text-xs font-semibold ${
                            activeTab === 'jari' ? 'text-white' : 'text-slate-500'
                          }`}
                        >
                          Recurso JARI
                        </Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Text className="text-amber-400/90 text-xs font-semibold mb-3">
                      Defesa Prévia
                    </Text>
                  )}

                  <View className="rounded-2xl border border-slate-800 bg-slate-800/50 p-4">
                    <TextInput
                      value={displayText}
                      editable={false}
                      multiline
                      textAlignVertical="top"
                      className="text-slate-300 text-xs leading-relaxed min-h-[200px]"
                      selectTextOnFocus
                    />
                  </View>

                  {record.defense?.updatedAt && (
                    <Text className="text-center text-xs text-slate-600 mt-2">
                      Gerada em {formatDate(record.defense.updatedAt)}
                    </Text>
                  )}

                  {/* Salvar defesa (fecha o modal após salvar) */}
                  {onSaveDefense && (
                    <Pressable
                      onPress={onSaveDefense}
                      className="mt-4 rounded-xl border border-slate-600 bg-slate-800 py-3 flex-row items-center justify-center gap-2 active:opacity-90"
                    >
                      <Ionicons name="save-outline" size={18} color="#e2e8f0" />
                      <Text className="text-sm font-semibold text-slate-200">
                        Salvar defesa
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

              {/* AÇÕES */}
              {!hasDefesa && (
                <Pressable
                  disabled={isSaving}
                  onPress={onGenerateDefense}
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
                      Gerar defesa técnica
                    </Text>
                  )}
                </Pressable>
              )}

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
