import { View, Text, Pressable, Modal } from 'react-native';

interface FineSearchResultModalProps {
  visible: boolean;
  hasFines: boolean;
  onClose: () => void;
}

export default function FineSearchResultModal({
  visible,
  hasFines,
  onClose,
}: FineSearchResultModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View className="flex-1 items-center justify-center bg-black/60 px-6">
        <View className="w-full rounded-xl bg-slate-900 px-6 py-5">
          <Text className="text-base font-semibold text-white">
            Resultado da pesquisa
          </Text>

          {!hasFines && (
            <Text className="mt-3 text-sm text-slate-400">
              Não foram identificados registros de multas
              com base nos dados informados no cadastro técnico.
            </Text>
          )}

          {hasFines && (
            <Text className="mt-3 text-sm text-slate-400">
              Foram identificados registros que podem indicar
              a existência de multas associadas ao veículo.
              Recomenda-se análise técnica detalhada.
            </Text>
          )}

          <Pressable
            onPress={onClose}
            className="mt-5 rounded-lg border border-slate-700 py-3"
          >
            <Text className="text-center text-sm font-medium text-slate-300">
              Fechar
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
