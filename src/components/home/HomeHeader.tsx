import { View, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';

type HomeHeaderProps = {
  onOpenNotifications?: () => void;
};

export default function HomeHeader({
  onOpenNotifications,
}: HomeHeaderProps) {
  const { user, isLoaded } = useUser();

  return (
    <View className="flex-row items-center justify-between px-6 py-2 w-full">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-slate-800/40 border border-slate-700/30">
        <Ionicons
          name="settings-outline"
          size={20}
          color="#94a3b8"
        />
      </View>

      <View className="flex-row items-center">
        <View className="h-10 w-10 overflow-hidden rounded-full border border-slate-700 bg-slate-800">
          {isLoaded && user?.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Ionicons
                name="person"
                size={18}
                color="#cbd5e1"
              />
            </View>
          )}
        </View>

        <Pressable
          onPress={onOpenNotifications}
          style={{ marginLeft: 16 }}
          className="h-10 w-10 items-center justify-center rounded-full bg-slate-800 border border-slate-700 active:bg-slate-700"
        >
          <Ionicons
            name="notifications-outline"
            size={20}
            color="#e5e7eb"
          />
        </Pressable>
      </View>
    </View>
  );
}
