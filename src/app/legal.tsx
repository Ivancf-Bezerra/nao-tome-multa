import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeClasses } from '../context/ThemeContext';
import GlobalHeader from '../components/layout/GlobalHeader';

export default function Legal() {
  const router = useRouter();
  const tc = useThemeClasses();

  return (
    <View className={`flex-1 ${tc.screen}`}>
      <StatusBar style={tc.statusBar} />

      <LinearGradient colors={[...tc.screenGradient]} style={{ flex: 1 }}>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <GlobalHeader />

          {/* Header local com botão voltar (submenu) */}
          <View className="px-6 pt-4 pb-4 flex-row items-center justify-between">
            <Pressable
              onPress={() => router.back()}
              className={`h-10 w-10 items-center justify-center rounded-full border active:opacity-80 ${tc.header}`}
            >
              <Ionicons name="chevron-back" size={18} color={tc.iconPrimary} />
            </Pressable>
            <Text className={`${tc.text} text-base font-semibold`}>
              Termos e privacidade
            </Text>
            <View className="h-10 w-10" />
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
            <View className="w-[90%] self-center">
              <View className={`rounded-2xl p-5 ${tc.cardAlt}`}>
                <Text className={`${tc.text} font-semibold text-sm`}>
                  Aviso institucional
                </Text>

                <Text className={`${tc.textMuted} text-sm mt-3 leading-5`}>
                  O NÃO TOME MULTA é um aplicativo informacional para organização
                  e análise técnica de dados relacionados a autuações.
                </Text>

                <Text className={`${tc.textMuted} text-sm mt-3 leading-5`}>
                  O aplicativo não presta consultoria jurídica, não representa o
                  usuário e não garante qualquer resultado administrativo ou
                  judicial.
                </Text>

                <View className={`mt-5 pt-4 ${tc.borderB}`}>
                  <Text className={`${tc.text} font-semibold text-sm`}>
                    Privacidade
                  </Text>

                <Text className={`${tc.textMuted} text-base mt-3 leading-relaxed`}>
                    Os dados informados pelo usuário são utilizados para exibição
                    e organização dentro do aplicativo. O app não realiza
                    monitoramento automático de sistemas públicos.
                  </Text>
                </View>

                <View className={`mt-5 pt-4 ${tc.borderB}`}>
                  <Text className={`${tc.text} font-semibold text-sm`}>
                    Responsabilidade
                  </Text>

                  <Text className={`${tc.textMuted} text-base mt-3 leading-relaxed`}>
                    O usuário é responsável por validar informações com fontes
                    oficiais. O app atua como suporte de clareza técnica e
                    organização.
                  </Text>
                </View>
              </View>

              <View className="mt-4">
                <Text className={`${tc.textSubtle} text-xs`}>
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
