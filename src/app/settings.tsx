import React from 'react';
import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser, useAuth } from '@clerk/clerk-expo';

type RowProps = {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  onPress?: () => void;
  rightText?: string;
  danger?: boolean;
};

function SettingsRow({
  title,
  subtitle,
  icon,
  iconColor = '#e5e7eb',
  onPress,
  rightText,
  danger = false,
}: RowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className={`rounded-2xl border border-slate-800 bg-slate-900 px-4 py-4 mb-3 ${
        onPress ? 'active:bg-slate-800' : ''
      }`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1 pr-4">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-slate-800">
            <Ionicons name={icon} size={18} color={iconColor} />
          </View>

          <View className="ml-3 flex-1">
            <Text
              className={`text-sm font-semibold ${
                danger ? 'text-red-400' : 'text-white'
              }`}
            >
              {title}
            </Text>

            {subtitle ? (
              <Text className="text-slate-400 text-xs mt-1">{subtitle}</Text>
            ) : null}
          </View>
        </View>

        <View className="flex-row items-center">
          {rightText ? (
            <Text className="text-slate-400 text-xs mr-2">{rightText}</Text>
          ) : null}

          {onPress ? (
            <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

export default function Settings() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();

  const email =
    isLoaded && user?.primaryEmailAddress?.emailAddress
      ? user.primaryEmailAddress.emailAddress
      : '—';

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
              Configurações
            </Text>

            <View className="h-10 w-10" />
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
            <View className="w-[90%] self-center">
              {/* Copy institucional */}
              <View className="mb-4">
                <Text className="text-slate-400 text-sm">
                  Preferências do aplicativo e informações institucionais.
                </Text>
              </View>

              {/* Conta */}
              <Text className="text-slate-300 text-xs mb-2">CONTA</Text>

              <SettingsRow
                title="Conta"
                subtitle={email}
                icon="person-outline"
                iconColor="#60a5fa"
              />

              <SettingsRow
                title="Autenticação"
                subtitle="Sessão gerenciada pelo Clerk"
                icon="shield-checkmark-outline"
                iconColor="#22c55e"
              />

              {/* Preferências */}
              <Text className="text-slate-300 text-xs mt-4 mb-2">
                PREFERÊNCIAS
              </Text>

              <SettingsRow
                title="Tema"
                subtitle="Modo escuro (padrão institucional)"
                icon="moon-outline"
                iconColor="#fbbf24"
              />

              {/* Legal */}
              <Text className="text-slate-300 text-xs mt-4 mb-2">LEGAL</Text>

              <SettingsRow
                title="Termos e privacidade"
                subtitle="Uso informacional. Sem promessa de resultado."
                icon="document-text-outline"
                iconColor="#a78bfa"
                onPress={() => router.push('/legal')}
              />

              {/* Ações */}
              <Text className="text-slate-300 text-xs mt-4 mb-2">AÇÕES</Text>

              <SettingsRow
                title="Sair"
                subtitle="Encerrar sessão neste dispositivo"
                icon="log-out-outline"
                iconColor="#ef4444"
                danger
                onPress={() => {
                  Alert.alert('Sair', 'Deseja encerrar sua sessão?', [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                      text: 'Sair',
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          await signOut();
                        } catch {
                          Alert.alert(
                            'Falha ao sair',
                            'Não foi possível encerrar a sessão.'
                          );
                        }
                      },
                    },
                  ]);
                }}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
