import { View, Pressable, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

type HomeHeaderProps = {
  onOpenNotifications?: () => void;
  /** Número de atualizações não lidas (status das multas enviadas) para exibir no badge. */
  unreadStatusCount?: number;
};

export default function HomeHeader({
  onOpenNotifications,
  unreadStatusCount = 0,
}: HomeHeaderProps) {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const showBadge = unreadStatusCount > 0;

  return (
    <View className="flex-row items-center justify-between px-6 py-2 w-full">
      {/* Engrenagem (Settings) */}
      <Pressable
        onPress={() => router.push('/settings')}
        className="h-10 w-10 items-center justify-center rounded-full bg-slate-800/40 border border-slate-700/30 active:bg-slate-700/40"
      >
        <Ionicons name="settings-outline" size={20} color="#94a3b8" />
      </Pressable>

      <View className="flex-row items-center">
        {/* Avatar */}
        <View className="h-10 w-10 overflow-hidden rounded-full border border-slate-700 bg-slate-800">
          {isLoaded && user?.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Ionicons name="person" size={18} color="#cbd5e1" />
            </View>
          )}
        </View>

        {/* Notificações */}
        <Pressable
          onPress={onOpenNotifications}
          style={{ marginLeft: 16 }}
          className="h-10 w-10 items-center justify-center rounded-full bg-slate-800 border border-slate-700 active:bg-slate-700"
        >
          <Ionicons name="notifications-outline" size={20} color="#e5e7eb" />
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
