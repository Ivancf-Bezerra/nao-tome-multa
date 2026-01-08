import { Modal, View, Text, Pressable } from 'react-native';

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function NotificationsModal({
  visible,
  onClose,
}: NotificationsModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="w-full max-w-md bg-slate-800 rounded-2xl px-6 pt-6 pb-5">
          <Text className="text-base font-semibold text-white">
            Atualizações recentes
          </Text>

          <Text className="mt-3 text-sm text-slate-400 leading-relaxed">
            Nenhuma atualização recente no momento.
          </Text>

          <View className="mt-6 items-end">
            <Pressable onPress={onClose}>
              <Text className="text-sm font-medium text-amber-400">
                Fechar
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
