import React, { useMemo, useState } from 'react';
import { Modal, ScrollView, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useThemeClasses } from '../../context/ThemeContext';
import type { StatusMultaEnviada } from '../../data/status/types';
import { buildJARILink } from '../../services/jari/JARILinkBuilder';
import TouchableScale from '../ui/TouchableScale';

type Props = {
  visible: boolean;
  item: StatusMultaEnviada | null;
  requireConfirmation: boolean;
  onConfirmAndGenerate: () => void;
  onClose: () => void;
};

export default function JARIGuideModal({
  visible,
  item,
  requireConfirmation,
  onConfirmAndGenerate,
  onClose,
}: Props) {
  const tc = useThemeClasses();
  const [ack, setAck] = useState(false);

  const link = useMemo(
    () =>
      item
        ? buildJARILink(
            item.input?.issuingBodyCode,
            item.input?.issuingBody,
            undefined,
          )
        : null,
    [item],
  );

  const canConfirm = !requireConfirmation || ack;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className={`flex-1 justify-end ${tc.modalOverlay}`}>
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className={`rounded-t-3xl border-t max-h-[90%] px-6 pt-5 pb-6 ${tc.modalBg} ${tc.border}`}>
          <View className="items-center">
            <View className={`h-1.5 w-14 rounded-full ${tc.divider}`} />
          </View>

          <View className="mt-4 mb-2">
            <Text className={`${tc.text} text-base font-semibold`}>
              Antes de gerar o recurso à JARI
            </Text>
            <Text className={`${tc.textMuted} text-sm mt-1 leading-relaxed`}>
              Entenda como o recurso funciona e como enviar no sistema do órgão após a geração.
            </Text>
          </View>

          <ScrollView
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            {item && (
              <View className={`mb-4 rounded-2xl p-4 ${tc.cardAlt}`}>
                <Text className={`font-semibold ${tc.text}`}>
                  AIT #{item.aitNumber || item.id}
                </Text>
                {item.description ? (
                  <Text className={`${tc.textMuted} text-xs mt-1`}>
                    {item.description}
                  </Text>
                ) : null}
              </View>
            )}

            {link && (
              <View className="mb-4 rounded-2xl border border-amber-400/40 bg-amber-50/40 px-3 py-3">
                <Text className="text-[11px] font-semibold text-amber-700">
                  Sistema do órgão para envio
                </Text>
                <Text className="text-[11px] mt-1 text-amber-800">
                  {link.label}
                </Text>
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

            {/* Passos */}
            <View className="mt-1">
              <View className="mb-4">
                <Text className={`${tc.text} text-sm font-semibold`}>1. Prepare o recurso</Text>
                <Text className={`${tc.textMuted} text-xs mt-1 leading-relaxed`}>
                  Gere o texto do recurso à JARI no aplicativo. Depois, copie o texto ou use o botão
                  de e-mail para ter o recurso pronto para colar no sistema do órgão.
                </Text>
              </View>

              <View className="mb-4">
                <Text className={`${tc.text} text-sm font-semibold`}>2. Acesse o sistema do órgão</Text>
                <Text className={`${tc.textMuted} text-xs mt-1 leading-relaxed`}>
                  Use o endereço indicado acima no navegador ou no aplicativo oficial do órgão
                  responsável pela autuação. Faça login com seus dados de acesso.
                </Text>
              </View>

              <View className="mb-4">
                <Text className={`${tc.text} text-sm font-semibold`}>3. Localize a multa (AIT)</Text>
                <Text className={`${tc.textMuted} text-xs mt-1 leading-relaxed`}>
                  Dentro do sistema, procure a área de consultas ou multas em andamento e localize a
                  AIT correspondente ao recurso que foi gerado.
                </Text>
              </View>

              <View className="mb-4">
                <Text className={`${tc.text} text-sm font-semibold`}>4. Inicie o recurso à JARI</Text>
                <Text className={`${tc.textMuted} text-xs mt-1 leading-relaxed`}>
                  No painel da multa, procure pela opção de &quot;Recurso à JARI&quot;, &quot;2ª instância&quot;
                  ou termo semelhante. Siga as instruções da tela até chegar ao campo de texto ou
                  envio de documento.
                </Text>
              </View>

              <View className="mb-4">
                <Text className={`${tc.text} text-sm font-semibold`}>5. Cole ou anexe o recurso</Text>
                <Text className={`${tc.textMuted} text-xs mt-1 leading-relaxed`}>
                  Cole o texto do recurso que o app gerou ou anexe o arquivo correspondente, conforme
                  a opção oferecida pelo sistema do órgão.
                </Text>
              </View>

              <View className="mb-4">
                <Text className={`${tc.text} text-sm font-semibold`}>6. Revise e confirme o envio</Text>
                <Text className={`${tc.textMuted} text-xs mt-1 leading-relaxed`}>
                  Revise todos os dados, confirme o envio do recurso e salve o número de protocolo
                  exibido pelo sistema (anote ou faça uma captura de tela).
                </Text>
              </View>
            </View>

            <View className="mt-2 rounded-2xl border border-amber-500/40 bg-amber-500/5 p-3">
              <Text className="text-[10px] text-amber-800 leading-relaxed">
                Aviso: o NÃO TOME MULTA gera apenas o conteúdo técnico-informacional do recurso. O
                envio efetivo no sistema do órgão é de responsabilidade do usuário e não há garantia
                de resultado administrativo ou judicial.
              </Text>
            </View>

            {requireConfirmation && (
              <Pressable
                onPress={() => setAck((v) => !v)}
                className="mt-4 flex-row items-center gap-2"
              >
                <Ionicons
                  name={ack ? 'checkbox-outline' : 'square-outline'}
                  size={18}
                  color={tc.iconPrimary}
                />
                <Text className={`${tc.textMuted} text-xs flex-1`}>
                  Confirmo que li e entendi as instruções acima para envio do recurso à JARI.
                </Text>
              </Pressable>
            )}
          </ScrollView>

          <View className="mt-3 gap-3">
            <TouchableScale
              disabled={!canConfirm}
              onPress={onConfirmAndGenerate}
            >
              <View
                className={`rounded-xl py-4 items-center ${
                  canConfirm ? 'bg-amber-400' : tc.buttonDisabled
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    canConfirm ? 'text-slate-900' : tc.buttonDisabledText
                  }`}
                >
                  {requireConfirmation
                    ? 'Entendi — gerar recurso à JARI'
                    : 'Prosseguir e gerar recurso'}
                </Text>
              </View>
            </TouchableScale>
            {requireConfirmation && (
              <Text className={`${tc.textMuted} text-[11px] text-center leading-relaxed`}>
                Após confirmar, o texto do recurso será gerado automaticamente.
              </Text>
            )}

            <TouchableScale onPress={onClose}>
              <View className={`rounded-xl py-3 items-center border ${tc.buttonSecondary}`}>
                <Text className={`text-sm font-semibold ${tc.buttonSecondaryText}`}>
                  Cancelar
                </Text>
              </View>
            </TouchableScale>
          </View>
        </View>
      </View>
    </Modal>
  );
}

