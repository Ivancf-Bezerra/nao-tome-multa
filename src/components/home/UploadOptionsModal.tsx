import { Modal, View, Text, Pressable, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

import { useAnalysis } from '../../context/AnalysisContext';

type Option = 'attach' | 'scan' | null;

interface UploadOptionsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function UploadOptionsModal({
  visible,
  onClose,
}: UploadOptionsModalProps) {
  const router = useRouter();
  const { startAnalysis } = useAnalysis();

  const [selected, setSelected] = useState<Option>(null);
  const [hasFile, setHasFile] = useState(false);

  useEffect(() => {
    if (!visible) {
      setSelected(null);
      setHasFile(false);
    }
  }, [visible]);

  /**
   * ANEXAR DOCUMENTO
   * Inicia a análise assim que o arquivo é selecionado.
   *
   * FUTURO:
   * - substituir por upload real
   * - validar tipo/tamanho
   * - persistir arquivo
   */
  async function handleAttach() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      // 🚨 SIMULAÇÃO — inicia análise local
      startAnalysis(); // REMOVER quando análise real for implementada

      setSelected('attach');
      setHasFile(true);
    } catch {
      Alert.alert('Erro', 'Não foi possível acessar o documento.');
    }
  }

  /**
   * DIGITALIZAR DOCUMENTO
   *
   * FUTURO:
   * - substituir por captura + preview
   * - OCR
   * - persistência
   */
  async function handleScan() {
    try {
      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permissão necessária',
          'A câmera é necessária para digitalizar o documento.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
      });

      if (result.canceled) return;

      // 🚨 SIMULAÇÃO — inicia análise local
      startAnalysis(); // REMOVER quando análise real for implementada

      setSelected('scan');
      setHasFile(true);
    } catch {
      Alert.alert('Erro', 'Não foi possível acessar a câmera.');
    }
  }

  /**
   * CONFIRMAÇÃO
   * Apenas navega. A análise já começou antes.
   *
   * FUTURO:
   * - pode redirecionar para preview
   */
  function handleConfirm() {
    if (!hasFile || !selected) return;

    onClose();
    router.replace('/analise');
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="w-full max-w-md rounded-2xl bg-slate-800 px-6 pt-6 pb-5">
          <Text className="text-base font-semibold text-white">
            Adicionar auto de infração
          </Text>

          {/* OPÇÕES */}
          <View className="mt-6">
            <Pressable
              onPress={handleAttach}
              className="mb-5 flex-row items-start gap-4 rounded-xl border border-slate-600 px-4 py-4 active:opacity-90"
            >
              <Ionicons
                name="document-attach-outline"
                size={22}
                color="#e5e7eb"
              />

              <View className="flex-1">
                <Text className="text-sm font-medium text-white">
                  Anexar documento
                </Text>

                <Text className="mt-1 text-xs leading-relaxed text-slate-400">
                  Selecionar um arquivo PDF ou imagem já existente no dispositivo.
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={handleScan}
              className="flex-row items-start gap-4 rounded-xl border border-slate-600 px-4 py-4 active:opacity-90"
            >
              <Ionicons
                name="camera-outline"
                size={22}
                color="#e5e7eb"
              />

              <View className="flex-1">
                <Text className="text-sm font-medium text-white">
                  Digitalizar documento
                </Text>

                <Text className="mt-1 text-xs leading-relaxed text-slate-400">
                  Capturar o documento físico utilizando a câmera do aparelho.
                </Text>
              </View>
            </Pressable>
          </View>

          {/* ESTADO */}
          {hasFile && selected && (
            <View className="mt-5 flex-row items-center gap-2">
              <Ionicons
                name="checkmark-circle-outline"
                size={16}
                color="#fbbf24"
              />
              <Text className="text-xs text-slate-400">
                Documento selecionado via{' '}
                {selected === 'attach' ? 'arquivo' : 'câmera'}.
              </Text>
            </View>
          )}

          {/* AÇÕES */}
          <View className="mt-8 flex-row justify-end items-center gap-8">
            <Pressable disabled={hasFile} onPress={onClose}>
              <Text
                className={`text-sm font-medium ${
                  hasFile ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                Cancelar
              </Text>
            </Pressable>

            {hasFile && (
              <Pressable onPress={handleConfirm}>
                <Text className="text-sm font-semibold text-amber-400">
                  Confirmar
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
