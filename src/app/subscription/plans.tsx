import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useUser } from '@clerk/clerk-expo';

import { activateSubscription } from '../../services/subscription/subscriptionService';
import { useSubscription } from '../../context/SubscriptionContext';

const PLAN = {
  id: 'monthly',
  title: 'Plano Mensal',
  price: 'R$ 29,90',
  period: '/mês',
  features: [
    'Análise técnica de infrações ilimitada',
    'Geração de Defesa Prévia',
    'Geração de Recurso à JARI',
    'Histórico de defesas salvo',
    'Compartilhamento de documentos',
  ],
};

export default function PlansScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { isActive, refresh } = useSubscription();
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    if (!user?.id || loading) return;
    setLoading(true);
    try {
      await activateSubscription(user.id, 'monthly', 30);
      await refresh();
      router.replace('/(tabs)/home');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-slate-900">
      <StatusBar style="light" />

      <LinearGradient colors={['#0f172a', '#1e293b']} style={{ flex: 1 }}>
        <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            {/* HEADER */}
            <View className="px-6 pt-6 pb-2">
              <Pressable onPress={() => router.back()} className="mb-6">
                <Text className="text-slate-400 text-sm">← Voltar</Text>
              </Pressable>

              <Text className="text-white text-2xl font-bold">
                Planos de acesso
              </Text>
              <Text className="text-slate-400 text-sm mt-2 leading-relaxed">
                Tenha acesso à geração de defesas técnicas baseadas em inconsistências formais detectadas no auto de infração.
              </Text>
            </View>

            {/* CARD DE PLANO */}
            <View className="mx-6 mt-8 rounded-2xl border border-amber-400/30 bg-slate-800 p-6">
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <Text className="text-amber-400 text-xs font-semibold uppercase tracking-widest">
                    Mais popular
                  </Text>
                  <Text className="text-white text-xl font-bold mt-1">
                    {PLAN.title}
                  </Text>
                </View>

                <View className="items-end">
                  <Text className="text-white text-2xl font-bold">
                    {PLAN.price}
                  </Text>
                  <Text className="text-slate-400 text-xs">{PLAN.period}</Text>
                </View>
              </View>

              <View className="mt-6 gap-3">
                {PLAN.features.map((feature) => (
                  <View key={feature} className="flex-row items-center gap-3">
                    <View className="w-5 h-5 rounded-full bg-amber-400/20 items-center justify-center">
                      <Text className="text-amber-400 text-xs font-bold">✓</Text>
                    </View>
                    <Text className="text-slate-300 text-sm flex-1">{feature}</Text>
                  </View>
                ))}
              </View>

              <Pressable
                onPress={handleSubscribe}
                disabled={loading || isActive}
                className={`mt-8 rounded-xl py-4 items-center ${
                  isActive ? 'bg-slate-700' : 'bg-amber-400 active:opacity-90'
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="#0f172a" />
                ) : (
                  <Text
                    className={`text-sm font-bold ${
                      isActive ? 'text-slate-500' : 'text-slate-900'
                    }`}
                  >
                    {isActive ? 'Plano já ativo' : 'Assinar agora'}
                  </Text>
                )}
              </Pressable>

              {!isActive && (
                <Text className="text-center text-xs text-slate-500 mt-3">
                  Cancele a qualquer momento. Sem fidelidade.
                </Text>
              )}
            </View>

            {/* AVISO LEGAL */}
            <View className="mx-6 mt-8 mb-6">
              <Text className="text-xs text-slate-600 text-center leading-relaxed">
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
