import { View, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';

type HomeHeaderProps = {
  onOpenNotifications: () => void;
};

export default function HomeHeader({
  onOpenNotifications,
}: HomeHeaderProps) {
  const router = useRouter();
  const { user } = useUser();

  return (
    <View className="flex-row items-center justify-between px-6 pt-4 pb-6">
      {/* AJUSTES */}
      <Pressable
        onPress={() => router.push('/sistema')}
        className="h-10 w-10 items-center justify-center rounded-full bg-slate-800"
      >
        <Ionicons
          name="settings-outline"
          size={18}
          color="#e5e7eb"
        />
      </Pressable>

      {/* AVATAR + NOTIFICAÇÕES */}
      <View className="flex-row items-center space-x-3">
        {/* AVATAR */}
        <View className="h-9 w-9 rounded-full overflow-hidden bg-slate-700">
          {user?.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              className="h-full w-full"
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Ionicons
                name="person-outline"
                size={18}
                color="#e5e7eb"
              />
            </View>
          )}
        </View>

        {/* NOTIFICAÇÕES */}
        <Pressable
          onPress={onOpenNotifications}
          className="h-10 w-10 items-center justify-center rounded-full bg-slate-800"
        >
          <Ionicons
            name="notifications-outline"
            size={18}
            color="#e5e7eb"
          />
        </Pressable>
      </View>
    </View>
  );
}
