import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Legal() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-slate-900">
      <StatusBar style="light" />

      <LinearGradient colors={['#0f172a', '#1e293b']} style={{ flex: 1 }}>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          {/* Header */}
          <View className="px-6 pt-2 pb-4 flex-row items-center justify-between">
            <Pressable
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-full bg-slate-800 border border-slate-700 active:bg-slate-700"
            >
              <Ionicons name="chevron-back" size={18} color="#e5e7eb" />
            </Pressable>

            <Text className="text-white text-base font-semibold">
              Termos e privacidade
            </Text>

            <View className="h-10 w-10" />
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
            <View className="w-[90%] self-center">
              <View className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <Text className="text-white font-semibold text-sm">
                  Aviso institucional
                </Text>

                <Text className="text-slate-400 text-sm mt-3 leading-5">
                  O NÃO TOME MULTA é um aplicativo informacional para organização
                  e análise técnica de dados relacionados a autuações.
                </Text>

                <Text className="text-slate-400 text-sm mt-3 leading-5">
                  O aplicativo não presta consultoria jurídica, não representa o
                  usuário e não garante qualquer resultado administrativo ou
                  judicial.
                </Text>

                <View className="mt-5 pt-4 border-t border-slate-800">
                  <Text className="text-white font-semibold text-sm">
                    Privacidade
                  </Text>

                  <Text className="text-slate-400 text-sm mt-3 leading-5">
                    Os dados informados pelo usuário são utilizados para exibição
                    e organização dentro do aplicativo. O app não realiza
                    monitoramento automático de sistemas públicos.
                  </Text>
                </View>

                <View className="mt-5 pt-4 border-t border-slate-800">
                  <Text className="text-white font-semibold text-sm">
                    Responsabilidade
                  </Text>

                  <Text className="text-slate-400 text-sm mt-3 leading-5">
                    O usuário é responsável por validar informações com fontes
                    oficiais. O app atua como suporte de clareza técnica e
                    organização.
                  </Text>
                </View>
              </View>

              <View className="mt-4">
                <Text className="text-slate-500 text-xs">
                  Última atualização: 13/01/2026
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
