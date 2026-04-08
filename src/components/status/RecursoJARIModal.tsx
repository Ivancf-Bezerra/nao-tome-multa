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
import type { InconsistencySeverity } from '../../data/inconsistencies/types';
import type { StatusMultaEnviada } from '../../data/status/types';
import { STATUS_LABELS } from '../../data/status/types';
import { buildJARILink } from '../../services/jari/JARILinkBuilder';
import JARIExportSheet from './JARIExportSheet';
import TouchableScale from '../ui/TouchableScale';

type Props = {
  visible: boolean;
  item: StatusMultaEnviada | null;
  isSaving: boolean;
  onClose: () => void;
  /** Chamado na primeira geração (quando !hasRecurso) */
  onGenerateJARI: () => void;
  /** Chamado para regenerar o texto (quando hasRecurso) */
  onRegenerateJARI: () => void;
  /** Limpa apenas o campo recursoJARI do registro */
  onClearRecurso: () => void;
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
  onClose,
  onGenerateJARI,
  onRegenerateJARI,
  onClearRecurso,
}: Props) {
  const tc = useThemeClasses();
  const hasRecurso = Boolean(item?.recursoJARI?.trim());
  const [exportVisible, setExportVisible] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const link = item
    ? buildJARILink(
        item.input?.issuingBodyCode,
        item.input?.issuingBody,
        undefined,
      )
    : null;

  function handleClose() {
    setShowGuide(false);
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View className={`flex-1 justify-end ${tc.modalOverlay}`}>
        <Pressable className="absolute inset-0" onPress={handleClose} />

        <View className={`rounded-t-3xl border-t px-6 pt-5 pb-8 max-h-[90%] ${tc.modalBg} ${tc.border}`}>
          {/* Drag handle */}
          <View className="items-center mb-3">
            <View className={`h-1.5 w-14 rounded-full ${tc.divider}`} />
          </View>

          {!item ? (
            <View className="py-10 items-center justify-center">
              <ActivityIndicator />
            </View>
          ) : showGuide ? (
            /* ── GUIA INLINE (passo a passo de envio) ── */
            <>
              <View className="mb-3 flex-row items-center gap-2">
                <TouchableScale onPress={() => setShowGuide(false)}>
                  <Ionicons name="arrow-back" size={22} color={tc.iconPrimary} />
                </TouchableScale>
                <Text className={`text-base font-semibold ${tc.text}`}>
                  Como enviar o recurso à JARI
                </Text>
              </View>

              <ScrollView
                contentContainerStyle={{ paddingBottom: 18 }}
                showsVerticalScrollIndicator={false}
              >
                {link && (
                  <View className="mb-4 rounded-2xl border border-amber-400/40 bg-amber-50/40 px-3 py-3">
                    <Text className="text-[11px] font-semibold text-amber-700">
                      Sistema do órgão para envio
                    </Text>
                    <Text className="text-[11px] mt-1 text-amber-800">{link.label}</Text>
                    <Text className="text-[10px] mt-1 text-amber-900/80" numberOfLines={2}>
                      {link.url}
                    </Text>
                    {link.isFallback && (
                      <Text className="text-[10px] mt-1 text-amber-700/80">
                        Dica: confirme se o site é o oficial do órgão responsável antes de fazer o envio.
                      </Text>
                    )}
                  </View>
                )}

                <View className="mb-4">
                  <Text className={`${tc.text} text-sm font-semibold`}>1. Prepare o recurso</Text>
                  <Text className={`${tc.textMuted} text-xs mt-1 leading-relaxed`}>
                    Gere o texto do recurso à JARI no aplicativo. Depois, copie o texto ou use o botão de e-mail para ter o recurso pronto para colar no sistema do órgão.
                  </Text>
                </View>
                <View className="mb-4">
                  <Text className={`${tc.text} text-sm font-semibold`}>2. Acesse o sistema do órgão</Text>
                  <Text className={`${tc.textMuted} text-xs mt-1 leading-relaxed`}>
                    Use o endereço indicado acima no navegador ou no aplicativo oficial do órgão responsável pela autuação. Faça login com seus dados de acesso.
                  </Text>
                </View>
                <View className="mb-4">
                  <Text className={`${tc.text} text-sm font-semibold`}>3. Localize a multa (AIT)</Text>
                  <Text className={`${tc.textMuted} text-xs mt-1 leading-relaxed`}>
                    Dentro do sistema, procure a área de consultas ou multas em andamento e localize a AIT correspondente ao recurso que foi gerado.
                  </Text>
                </View>
                <View className="mb-4">
                  <Text className={`${tc.text} text-sm font-semibold`}>4. Inicie o recurso à JARI</Text>
                  <Text className={`${tc.textMuted} text-xs mt-1 leading-relaxed`}>
                    No painel da multa, procure pela opção de &quot;Recurso à JARI&quot;, &quot;2ª instância&quot; ou termo semelhante. Siga as instruções da tela até chegar ao campo de texto ou envio de documento.
                  </Text>
                </View>
                <View className="mb-4">
                  <Text className={`${tc.text} text-sm font-semibold`}>5. Cole ou anexe o recurso</Text>
                  <Text className={`${tc.textMuted} text-xs mt-1 leading-relaxed`}>
                    Cole o texto do recurso que o app gerou ou anexe o arquivo correspondente, conforme a opção oferecida pelo sistema do órgão.
                  </Text>
                </View>
                <View className="mb-4">
                  <Text className={`${tc.text} text-sm font-semibold`}>6. Revise e confirme o envio</Text>
                  <Text className={`${tc.textMuted} text-xs mt-1 leading-relaxed`}>
                    Revise todos os dados, confirme o envio do recurso e salve o número de protocolo exibido pelo sistema (anote ou faça uma captura de tela).
                  </Text>
                </View>

                <View className="rounded-2xl border border-amber-500/40 bg-amber-500/5 p-3">
                  <Text className="text-[10px] text-amber-800 leading-relaxed">
                    Aviso: o NÃO TOME MULTA gera apenas o conteúdo técnico-informacional do recurso. O envio efetivo no sistema do órgão é de responsabilidade do usuário.
                  </Text>
                </View>

                <TouchableScale onPress={() => setShowGuide(false)} style={{ marginTop: 16 }}>
                  <View className={`rounded-xl py-3 items-center border ${tc.buttonSecondary}`}>
                    <Text className={`text-sm font-semibold ${tc.buttonSecondaryText}`}>
                      Fechar guia
                    </Text>
                  </View>
                </TouchableScale>
              </ScrollView>
            </>
          ) : (
            /* ── CONTEÚDO PRINCIPAL ── */
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

              {link && (
                <View className="mt-3 rounded-2xl border px-3 py-2 border-amber-400/40 bg-amber-50/40">
                  <Text className="text-[11px] font-semibold text-amber-700">
                    Sistema do órgão para envio
                  </Text>
                  <Text className="text-[11px] mt-1 text-amber-800" numberOfLines={2}>
                    {link.label}
                  </Text>
                  <Text className="text-[10px] mt-1 text-amber-900/80" numberOfLines={2}>
                    {link.url}
                  </Text>
                  {link.isFallback && (
                    <Text className="text-[10px] mt-1 text-amber-700/80">
                      Dica: confirme sempre se o site é o oficial do órgão responsável pela autuação antes de enviar o recurso.
                    </Text>
                  )}
                </View>
              )}

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

              {/* RECURSO JARI — texto já gerado */}
              {hasRecurso && (
                <View className="mt-5">
                  <Text className={`${tc.textMuted} text-xs font-semibold mb-3 uppercase tracking-wide`}>
                    Texto do recurso gerado
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

                  {/* Ação principal: exportar para envio */}
                  <TouchableScale onPress={() => setExportVisible(true)} style={{ marginTop: 16 }}>
                    <View className="rounded-xl bg-amber-400 py-4 items-center">
                      <Text className="text-sm font-semibold text-slate-900">
                        Compartilhar / enviar por e-mail
                      </Text>
                    </View>
                  </TouchableScale>

                  {/* Ações secundárias */}
                  <View className="mt-3 flex-row gap-3">
                    <TouchableScale onPress={() => setShowGuide(true)} style={{ flex: 1 }}>
                      <View className={`rounded-xl py-3 items-center border ${tc.buttonSecondary}`}>
                        <Text className={`text-xs font-semibold ${tc.buttonSecondaryText}`}>
                          Ver passo a passo
                        </Text>
                      </View>
                    </TouchableScale>
                    <TouchableScale
                      disabled={isSaving}
                      onPress={onRegenerateJARI}
                      style={{ flex: 1 }}
                    >
                      <View className={`rounded-xl py-3 items-center border ${isSaving ? tc.buttonDisabled : tc.buttonSecondary}`}>
                        {isSaving ? (
                          <ActivityIndicator size="small" color={tc.iconMuted} />
                        ) : (
                          <Text className={`text-xs font-semibold ${tc.buttonSecondaryText}`}>
                            Regenerar
                          </Text>
                        )}
                      </View>
                    </TouchableScale>
                  </View>

                  {/* Limpar recurso gerado */}
                  <TouchableScale onPress={onClearRecurso} style={{ marginTop: 8 }}>
                    <View className="items-center py-2">
                      <Text className={`${tc.textSubtle} text-xs underline`}>
                        Limpar recurso gerado
                      </Text>
                    </View>
                  </TouchableScale>
                </View>
              )}

              {/* BOTÃO GERAR — quando ainda não foi gerado */}
              {!hasRecurso && (
                <View className="mt-6">
                  <TouchableScale
                    disabled={isSaving}
                    onPress={onGenerateJARI}
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
                            Gerando recurso…
                          </Text>
                        </View>
                      ) : (
                        <Text className="text-center text-sm font-semibold text-slate-900">
                          Gerar recurso à JARI
                        </Text>
                      )}
                    </View>
                  </TouchableScale>

                  <Text className={`${tc.textMuted} text-[11px] text-center mt-3 leading-relaxed`}>
                    O texto será gerado com base nas inconsistências detectadas na análise da multa.
                  </Text>
                </View>
              )}

              {/* Fechar */}
              <TouchableScale onPress={handleClose} style={{ marginTop: 16 }}>
                <View className={`rounded-xl py-3 items-center border ${tc.buttonSecondary}`}>
                  <Text className={`text-sm font-semibold ${tc.buttonSecondaryText}`}>
                    Fechar
                  </Text>
                </View>
              </TouchableScale>
            </ScrollView>
          )}
        </View>
      </View>

      <JARIExportSheet
        visible={exportVisible}
        item={item}
        onClose={() => setExportVisible(false)}
      />
    </Modal>
  );
}
