import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function DefensesCard() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push('/defesas')}
      className="rounded-3xl border border-slate-700 bg-slate-800/70 px-6 py-6 active:opacity-90"
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-white">
          Defesas administrativas
        </Text>

        <Ionicons name="folder-open-outline" size={20} color="#cbd5f5" />
      </View>

      <Text className="mt-2 text-sm text-slate-400">
        Acompanhar defesas geradas e seus estados atuais.
      </Text>
    </Pressable>
  );
}
