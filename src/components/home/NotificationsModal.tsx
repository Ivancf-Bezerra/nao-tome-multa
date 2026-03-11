import { useRouter } from 'expo-router';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { useThemeClasses } from '../../context/ThemeContext';
import type {
    StatusMultaEnviada,
    StatusMultaEnviadaCode,
} from '../../data/status/types';
import { STATUS_LABELS } from '../../data/status/types';

/** Título exibido na notificação conforme o tipo de atualização. */
function getNotificationTitle(status: StatusMultaEnviadaCode): string {
  switch (status) {
    case 'enviada':
      return 'Nova defesa enviada';
    case 'em_analise':
      return 'Novo status: Em análise';
    case 'deferido':
      return 'Novo status: Deferido';
    case 'indeferido':
      return 'Novo status: Indeferido';
    case 'cancelado':
      return 'Novo status: Cancelado';
    default:
      return 'Novo status de defesa';
  }
}

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
  /** Itens de status não lidos (multas enviadas com atualizações) para resumo. */
  unreadItems?: StatusMultaEnviada[];
}

function formatDateShort(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export default function NotificationsModal({
  visible,
  onClose,
  unreadItems = [],
}: NotificationsModalProps) {
  const router = useRouter();
  const tc = useThemeClasses();

  function handleClose() {
    onClose();
  }

  function handleGoToStatus() {
    onClose();
    router.push('/(tabs)/status');
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className={`w-full max-w-md rounded-2xl px-6 pt-6 pb-5 max-h-[80%] ${tc.modalBg} ${tc.border}`}>
          <Text className={`text-base font-semibold ${tc.text}`}>
            Atualizações recentes
          </Text>
          <Text className={`${tc.textSubtle} text-xs mt-1`}>
            Status das multas enviadas
          </Text>

          {unreadItems.length === 0 ? (
            <Text className={`mt-3 text-sm leading-relaxed ${tc.textMuted}`}>
              Nenhuma atualização recente no momento.
            </Text>
          ) : (
            <ScrollView
              className="mt-3 max-h-48"
              showsVerticalScrollIndicator={false}
            >
              {unreadItems.slice(0, 10).map((item) => (
                <View
                  key={item.id}
                  className={`mb-3 rounded-xl p-3 ${tc.cardAlt}`}
                >
                  <Text className="text-amber-500 text-xs font-semibold uppercase tracking-wide">
                    {getNotificationTitle(item.status)}
                  </Text>
                  <Text className={`font-semibold text-sm mt-1.5 ${tc.text}`}>
                    AIT #{item.aitNumber}
                  </Text>
                  {item.description ? (
                    <Text
                      className={`${tc.textMuted} text-xs mt-0.5`}
                      numberOfLines={1}
                    >
                      {item.description}
                    </Text>
                  ) : null}
                  <View className="flex-row items-center justify-between mt-2">
                    <Text className={`${tc.textMuted} text-xs font-medium`}>
                      {STATUS_LABELS[item.status]}
                    </Text>
                    <Text className={`${tc.textSubtle} text-[10px]`}>
                      {formatDateShort(item.updatedAt)}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          <View className="mt-5 flex-row items-center justify-between">
            <Pressable
              onPress={handleGoToStatus}
              className="rounded-xl border border-amber-400/50 bg-amber-400/10 py-2.5 px-4"
            >
              <Text className="text-amber-500 text-sm font-semibold">
                Ver aba Status
              </Text>
            </Pressable>
            <Pressable onPress={handleClose}>
              <Text className={`text-sm font-medium ${tc.textMuted}`}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
