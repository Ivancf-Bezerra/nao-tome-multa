import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useUser } from '@clerk/clerk-expo';

import { activateSubscription } from '../../services/subscription/subscriptionService';
import { useSubscription } from '../../context/SubscriptionContext';
import { useThemeClasses } from '../../context/ThemeContext';

const PLANS = [
  {
    id: 'starter' as const,
    title: 'Plano Básico',
    price: 'R$ 19,90',
    period: '/mês',
    highlight: 'Econômico',
    description: 'Para uso ocasional no mês.',
    features: [
      'Análises técnicas para uso eventual',
      'Geração de Defesa Prévia',
      'Histórico de defesas salvo',
    ],
  },
  {
    id: 'monthly' as const,
    title: 'Plano Ilimitado',
    price: 'R$ 39,90',
    period: '/mês',
    highlight: 'Recomendado',
    description: 'Para uso frequente e intenso.',
    features: [
      'Análises técnicas ilimitadas',
      'Defesa Prévia e Recurso à JARI',
      'Histórico completo salvo',
    ],
  },
];

export default function PlansScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { isActive, plan, refresh } = useSubscription();
  const tc = useThemeClasses();
  const [loading, setLoading] = useState(false);

  async function handleSubscribe(planId: 'starter' | 'monthly') {
    if (!user?.id || loading) return;
    setLoading(true);
    try {
      await activateSubscription(user.id, planId, 30);
      await refresh();
      router.replace('/(tabs)/home');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className={`flex-1 ${tc.screen}`}>
      <StatusBar style={tc.statusBar} />

      <LinearGradient colors={[...tc.screenGradient]} style={{ flex: 1 }}>
        <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            {/* HEADER */}
            <View className="px-6 pt-6 pb-2">
              <Pressable onPress={() => router.back()} className="mb-6">
                <Text className={`${tc.textMuted} text-sm`}>← Voltar</Text>
              </Pressable>

              <Text className={`${tc.text} text-2xl font-bold`}>
                Planos de acesso
              </Text>
              <Text className={`${tc.textMuted} text-sm mt-2 leading-relaxed`}>
                Tenha acesso à geração de defesas técnicas baseadas em inconsistências formais detectadas no auto de infração.
              </Text>
            </View>

            {/* CARDS DE PLANOS */}
            <View className="mx-6 mt-8 gap-4">
              {PLANS.map((p) => {
                const isCurrent = isActive && plan === p.id;
                const isOtherActive = isActive && plan !== p.id;
                const isDisabled = loading;
                const buttonLabel = isCurrent
                  ? 'Plano atual'
                  : isOtherActive
                  ? 'Mudar para este plano'
                  : 'Assinar plano';

                return (
                  <View
                    key={p.id}
                    className={`rounded-2xl p-6 border ${
                      p.id === 'monthly' ? 'border-amber-400/40' : tc.border
                    } ${tc.card}`}
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1">
                        <Text className="text-amber-500 text-xs font-semibold uppercase tracking-widest">
                          {p.highlight}
                        </Text>
                        <Text className={`${tc.text} text-xl font-bold mt-1`}>
                          {p.title}
                        </Text>
                        <Text className={`${tc.textMuted} text-xs mt-1`}>
                          {p.description}
                        </Text>
                      </View>

                      <View className="items-end">
                        <Text className={`${tc.text} text-2xl font-bold`}>
                          {p.price}
                        </Text>
                        <Text className={`${tc.textMuted} text-xs`}>{p.period}</Text>
                      </View>
                    </View>

                    <View className="mt-6 gap-3">
                      {p.features.map((feature) => (
                        <View key={feature} className="flex-row items-center gap-3">
                          <View className="w-5 h-5 rounded-full bg-amber-400/15 items-center justify-center">
                            <Text className="text-amber-500 text-xs font-bold">✓</Text>
                          </View>
                          <Text className={`${tc.buttonSecondaryText} text-sm flex-1`}>
                            {feature}
                          </Text>
                        </View>
                      ))}
                    </View>

                    <Pressable
                      onPress={() => handleSubscribe(p.id)}
                      disabled={isDisabled}
                      className={`mt-6 rounded-xl py-3 items-center ${
                        isCurrent
                          ? tc.buttonSecondary
                          : 'bg-amber-400 active:opacity-90'
                      }`}
                    >
                      {loading ? (
                        <ActivityIndicator color="#0f172a" />
                      ) : (
                        <Text
                          className={`text-sm font-bold ${
                            isCurrent ? tc.textSubtle : 'text-slate-900'
                          }`}
                        >
                          {buttonLabel}
                        </Text>
                      )}
                    </Pressable>
                  </View>
                );
              })}
            </View>

            {/* AVISO LEGAL */}
            <View className="mx-6 mt-8 mb-6">
              <Text className={`text-xs text-center leading-relaxed ${tc.textSubtle}`}>
                As defesas geradas são de caráter técnico-informacional e não constituem orientação jurídica.
                O serviço não garante êxito administrativo ou judicial.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
