import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function CheckoutScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-slate-900">
      <StatusBar style="light" />

      <LinearGradient colors={['#0f172a', '#1e293b']} style={{ flex: 1 }}>
        <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
          <View className="flex-1 items-center justify-center px-8">
            <View className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 items-center justify-center mb-6">
              <Text className="text-2xl">🔧</Text>
            </View>

            <Text className="text-white text-xl font-bold text-center">
              Pagamento em breve
            </Text>

            <Text className="text-slate-400 text-sm text-center mt-3 leading-relaxed">
              A integração com gateway de pagamento está em desenvolvimento.
              Em breve você poderá realizar o pagamento diretamente pelo aplicativo.
            </Text>

            <Pressable
              onPress={() => router.back()}
              className="mt-8 rounded-xl border border-slate-700 bg-slate-800 px-8 py-4"
            >
              <Text className="text-slate-200 text-sm font-semibold">
                Voltar
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
