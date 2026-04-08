import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
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
import { AnalyzedInfractionRecord, InconsistencySeverity } from './types';
import TouchableScale from '../ui/TouchableScale';

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
  const tc = useThemeClasses();

  const hasDefesa = Boolean(record?.defense?.defesaPrevia?.trim());
  const displayText = record?.defense?.defesaPrevia ?? '';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className={`flex-1 justify-end ${tc.modalOverlay}`}>
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className={`rounded-t-3xl border-t px-6 pt-6 pb-8 max-h-[85%] ${tc.modalBg} ${tc.border}`}>
          {!record ? (
            <View className="py-10 items-center justify-center">
              <ActivityIndicator />
            </View>
          ) : (
            <ScrollView contentContainerStyle={{ paddingBottom: 18 }} showsVerticalScrollIndicator={false}>
              {/* HEADER */}
              <Text className={`text-base font-semibold ${tc.text}`}>
                Análise técnica
              </Text>
              <Text className={`${tc.textMuted} text-xs mt-1`}>
                Conteúdo técnico-informacional. Não constitui orientação legal.
              </Text>

              {/* INFO DA MULTA */}
              <View className={`mt-4 rounded-2xl p-4 ${tc.cardAlt}`}>
                <Text className={`font-semibold ${tc.text}`}>
                  AIT #{record.input.aitNumber || record.id}
                </Text>
                {Boolean(record.input.description) && (
                  <Text className={`${tc.textMuted} text-sm mt-1`}>
                    {record.input.description}
                  </Text>
                )}
                <View className="flex-row items-center mt-2">
                  <Ionicons name="time-outline" size={14} color={tc.iconMuted} />
                  <Text className={`${tc.buttonSecondaryText} text-xs ml-2`}>
                    {formatDate(record.analyzedAt)}
                  </Text>
                </View>
              </View>

              {/* ACHADOS */}
              <View className="mt-5">
                <Text className={`font-semibold mb-3 ${tc.text}`}>
                  Inconsistências detectadas ({record.result.findings.length})
                </Text>

                {record.result.findings.map((f) => (
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

              {/* DEFESA PRÉVIA (Recurso à JARI só na aba Status quando indeferido) */}
              {hasDefesa && (
                <View className="mt-5">
                  <Text className="text-amber-500 text-xs font-semibold mb-3">
                    Defesa Prévia
                  </Text>

                  <View className={`rounded-2xl p-4 ${tc.cardAlt}`}>
                    <TextInput
                      value={displayText}
                      editable={false}
                      multiline
                      textAlignVertical="top"
                      className={`text-xs leading-relaxed min-h-[200px] ${tc.buttonSecondaryText}`}
                      selectTextOnFocus
                    />
                  </View>

                  {record.defense?.updatedAt && (
                    <Text className={`text-center text-xs mt-2 ${tc.textSubtle}`}>
                      Gerada em {formatDate(record.defense.updatedAt)}
                    </Text>
                  )}

                  {/* Salvar e Enviar defesa (salva, abre share, adiciona ao Status e redireciona) */}
                  {onSaveDefense && (
                    <TouchableScale
                      onPress={onSaveDefense}
                      disabled={saveFeedback}
                      style={{ marginTop: 16 }}
                    >
                      <View
                        className={`rounded-xl py-3 flex-row items-center justify-center gap-2 border ${tc.buttonSecondary} ${
                          saveFeedback ? 'opacity-70' : ''
                        }`}
                      >
                        <Ionicons name="send" size={18} color={tc.iconPrimary} />
                        <Text className={`text-sm font-semibold ${tc.buttonSecondaryText}`}>
                          {saveFeedback ? 'Enviando…' : 'Salvar e Enviar Defesa'}
                        </Text>
                        {saveFeedback && (
                          <Text className="text-emerald-500 text-xs font-medium ml-1">
                            …
                          </Text>
                        )}
                      </View>
                    </TouchableScale>
                  )}
                </View>
              )}

              {/* AÇÕES */}
              {!hasDefesa && (
                <TouchableScale
                  disabled={isSaving}
                  onPress={onGenerateDefense}
                  style={{ marginTop: 24 }}
                >
                  <View
                    className={`rounded-xl py-4 ${
                      isSaving ? tc.buttonSecondary : 'bg-amber-400'
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
                        Gerar defesa técnica
                      </Text>
                    )}
                  </View>
                </TouchableScale>
              )}

              <View className="mt-3 flex-row gap-3">
                <TouchableScale onPress={onClose} style={{ flex: 1 }}>
                  <View className={`rounded-xl py-4 border ${tc.buttonSecondary}`}>
                    <View className="flex-row items-center justify-center gap-2">
                      <Ionicons name="arrow-back" size={18} color={tc.iconPrimary} />
                      <Text className={`text-sm font-semibold ${tc.buttonSecondaryText}`}>
                        Voltar
                      </Text>
                    </View>
                  </View>
                </TouchableScale>
                <TouchableScale onPress={onDelete} style={{ flex: 1 }}>
                  <View className="rounded-xl border border-red-500/40 bg-red-500/10 py-4">
                    <View className="flex-row items-center justify-center gap-2">
                      <Ionicons name="trash-outline" size={18} color="#f87171" />
                      <Text className="text-sm font-semibold text-red-400">
                        Excluir registro
                      </Text>
                    </View>
                  </View>
                </TouchableScale>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}
