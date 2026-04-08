import { View, Pressable, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';

import { useThemeClasses } from '../../context/ThemeContext';
import { useSettingsModal } from '../../context/SettingsModalContext';

type HomeHeaderProps = {
  onOpenNotifications?: () => void;
  /** Número de atualizações não lidas (status das multas enviadas) para exibir no badge. */
  unreadStatusCount?: number;
};

export default function HomeHeader({
  onOpenNotifications,
  unreadStatusCount = 0,
}: HomeHeaderProps) {
  const { open: openSettings, isOpen: isSettingsOpen, close: closeSettings } = useSettingsModal();
  const { user, isLoaded } = useUser();
  const tc = useThemeClasses();
  const showBadge = unreadStatusCount > 0;

  const btnClass = tc.header;

  function handlePressSettings() {
    if (isSettingsOpen) {
      closeSettings();
    } else {
      openSettings();
    }
  }

  return (
    <View className="flex-row items-center justify-between px-6 py-2 w-full">
      {/* Engrenagem (Settings) */}
      <Pressable
          onPress={handlePressSettings}
        className={`h-10 w-10 items-center justify-center rounded-full border active:opacity-80 ${btnClass}`}
      >
        <Ionicons name="settings-outline" size={20} color={tc.iconMuted} />
      </Pressable>

      <View className="flex-row items-center">
        {/* Avatar */}
        <View className={`h-10 w-10 overflow-hidden rounded-full border ${tc.header}`}>
          {isLoaded && user?.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Ionicons name="person" size={18} color={tc.iconPrimary} />
            </View>
          )}
        </View>

        {/* Notificações */}
        <Pressable
          onPress={onOpenNotifications}
          style={{ marginLeft: 16 }}
          className={`h-10 w-10 items-center justify-center rounded-full border active:opacity-80 ${btnClass}`}
        >
          <Ionicons name="notifications-outline" size={20} color={tc.iconPrimary} />
          {showBadge && (
            <View className="absolute -right-1 -top-1 min-w-[18px] h-[18px] rounded-full bg-amber-400 items-center justify-center px-1">
              <Text className="text-[10px] font-bold text-slate-900">
                {unreadStatusCount > 99 ? '99+' : unreadStatusCount}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}
