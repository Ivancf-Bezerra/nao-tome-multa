import React, { useState } from 'react';
import { Modal, Pressable, Text, View, Alert, Linking, Share } from 'react-native';

import { useThemeClasses } from '../../context/ThemeContext';
import type { StatusMultaEnviada } from '../../data/status/types';
import TouchableScale from '../ui/TouchableScale';

type Props = {
  visible: boolean;
  item: StatusMultaEnviada | null;
  onClose: () => void;
};

function buildRecursoBody(item: StatusMultaEnviada): string {
  const header = 'RECURSO À JARI — NÃO TOME MULTA\n\n';

  const aitLine = `AIT: ${item.aitNumber}\n`;
  const descLine = item.description ? `Descrição: ${item.description}\n` : '';
  const orgaoLine = item.input?.issuingBody
    ? `Órgão autuador: ${item.input.issuingBody}\n`
    : '';

  const divider = '\n' + '-'.repeat(50) + '\n\n';

  const corpo = item.recursoJARI ?? '';

  return header + aitLine + descLine + orgaoLine + divider + corpo;
}

export default function JARIExportSheet({ visible, item, onClose }: Props) {
  const tc = useThemeClasses();
  const [copied, setCopied] = useState(false);

  const disabled = !item || !item.recursoJARI?.trim();

  async function handleCopy() {
    if (disabled || !item) return;
    try {
      const body = buildRecursoBody(item);
      await Share.share({ message: body });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      Alert.alert('Não foi possível compartilhar o recurso.');
    }
  }

  function handleEmail() {
    if (disabled || !item) return;

    const subject = `Recurso à JARI - AIT ${item.aitNumber}`;
    const body = buildRecursoBody(item);
    const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      body,
    )}`;

    Linking.openURL(mailto).catch(() => {
      Alert.alert(
        'Não foi possível abrir o e-mail',
        'Verifique se há um app de e-mail configurado neste dispositivo.',
      );
    });
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className={`flex-1 justify-end ${tc.modalOverlay}`}>
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className={`rounded-t-3xl border-t px-6 pt-5 pb-6 ${tc.modalBg} ${tc.border}`}>
          <View className="items-center">
            <View className={`h-1.5 w-14 rounded-full ${tc.divider}`} />
          </View>

          <View className="mt-4">
            <Text className={`${tc.text} text-base font-semibold`}>
              Como você quer usar o recurso à JARI?
            </Text>
            <Text className={`${tc.textMuted} text-xs mt-1`}>
              Copie o texto ou abra um rascunho de e-mail para colar o recurso no sistema do órgão.
            </Text>
          </View>

          <View className="mt-5 gap-3">
            <TouchableScale disabled={disabled} onPress={handleCopy}>
              <View
                className={`rounded-xl py-3 items-center border ${
                  disabled ? tc.buttonDisabled : tc.buttonSecondary
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    disabled ? tc.buttonDisabledText : tc.buttonSecondaryText
                  }`}
                >
                  {copied ? 'Compartilhado!' : 'Compartilhar / Copiar recurso'}
                </Text>
              </View>
            </TouchableScale>

            <TouchableScale disabled={disabled} onPress={handleEmail}>
              <View
                className={`rounded-xl py-3 items-center ${
                  disabled ? tc.buttonDisabled : 'bg-amber-400'
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    disabled ? tc.buttonDisabledText : 'text-slate-900'
                  }`}
                >
                  Abrir e-mail com recurso preenchido
                </Text>
              </View>
            </TouchableScale>
          </View>

          <TouchableScale onPress={onClose}>
            <View className="mt-4 items-center">
              <Text className={`${tc.textSubtle} text-xs`}>Fechar</Text>
            </View>
          </TouchableScale>
        </View>
      </View>
    </Modal>
  );
}

