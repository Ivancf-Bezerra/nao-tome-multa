import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme, useThemeClasses } from '../context/ThemeContext';

type RowProps = {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  onPress?: () => void;
  rightText?: string;
  danger?: boolean;
  cardClass?: string;
  titleClass?: string;
  subtitleClass?: string;
  rightTextClass?: string;
  iconBgClass?: string;
  chevronColor?: string;
};

function SettingsRow({
  title,
  subtitle,
  icon,
  iconColor = '#e5e7eb',
  onPress,
  rightText,
  danger = false,
  cardClass = 'rounded-2xl border border-slate-800 bg-slate-900 px-4 py-4 mb-3',
  titleClass = 'text-white',
  subtitleClass = 'text-slate-400',
  rightTextClass = 'text-slate-400',
  iconBgClass = 'bg-slate-800',
  chevronColor = '#94a3b8',
}: RowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className={`${cardClass} ${onPress ? 'active:opacity-80' : ''}`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1 pr-4">
          <View className={`h-10 w-10 items-center justify-center rounded-xl ${iconBgClass}`}>
            <Ionicons name={icon} size={18} color={iconColor} />
          </View>

          <View className="ml-3 flex-1">
            <Text
              className={`text-sm font-semibold ${
                danger ? 'text-red-400' : titleClass
              }`}
            >
              {title}
            </Text>

            {subtitle ? (
              <Text className={`${subtitleClass} text-xs mt-1`}>{subtitle}</Text>
            ) : null}
          </View>
        </View>

        <View className="flex-row items-center">
          {rightText ? (
            <Text className={`${rightTextClass} text-xs mr-2`}>{rightText}</Text>
          ) : null}

          {onPress ? (
            <Ionicons name="chevron-forward" size={16} color={chevronColor} />
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
  const { theme, toggleTheme } = useTheme();
  const tc = useThemeClasses();

  const email =
    isLoaded && user?.primaryEmailAddress?.emailAddress
      ? user.primaryEmailAddress.emailAddress
      : '—';

  const cardClass = `rounded-2xl border px-4 py-4 mb-3 ${tc.card}`;
  const iconBgClass = theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100';

  return (
    <View className={`flex-1 ${tc.screen}`}>
      <StatusBar style={tc.statusBar} />

      <LinearGradient colors={[...tc.screenGradient]} style={{ flex: 1 }}>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          {/* Header */}
          <View className="px-6 pt-2 pb-4 flex-row items-center justify-between">
            <Pressable
              onPress={() => router.back()}
              className={`h-10 w-10 items-center justify-center rounded-full border active:opacity-80 ${tc.header}`}
            >
              <Ionicons name="chevron-back" size={18} color={tc.iconPrimary} />
            </Pressable>

            <Text className={`${tc.text} text-base font-semibold`}>
              Configurações
            </Text>

            <View className="h-10 w-10" />
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
            <View className="w-[90%] self-center">
              {/* Copy institucional */}
              <View className="mb-4">
                <Text className={`${tc.textMuted} text-sm`}>
                  Preferências do aplicativo e informações institucionais.
                </Text>
              </View>

              {/* Conta */}
              <Text className={`${tc.sectionLabel} text-xs mb-2`}>CONTA</Text>

              <SettingsRow
                title="Conta"
                subtitle={email}
                icon="person-outline"
                iconColor="#60a5fa"
                cardClass={cardClass}
                titleClass={tc.text}
                subtitleClass={tc.textMuted}
                iconBgClass={iconBgClass}
                chevronColor={tc.iconMuted}
              />

              <SettingsRow
                title="Autenticação"
                subtitle="Sessão gerenciada pelo Clerk"
                icon="shield-checkmark-outline"
                iconColor="#22c55e"
                cardClass={cardClass}
                titleClass={tc.text}
                subtitleClass={tc.textMuted}
                iconBgClass={iconBgClass}
                chevronColor={tc.iconMuted}
              />

              {/* Preferências */}
              <Text className={`${tc.sectionLabel} text-xs mt-4 mb-2`}>
                PREFERÊNCIAS
              </Text>

              <SettingsRow
                title="Tema"
                subtitle={theme === 'dark' ? 'Modo escuro (padrão)' : 'Modo claro'}
                icon={theme === 'dark' ? 'moon-outline' : 'sunny-outline'}
                iconColor="#fbbf24"
                rightText={theme === 'dark' ? 'Escuro' : 'Claro'}
                onPress={toggleTheme}
                cardClass={cardClass}
                titleClass={tc.text}
                subtitleClass={tc.textMuted}
                rightTextClass={tc.textMuted}
                iconBgClass={iconBgClass}
                chevronColor={tc.iconMuted}
              />

              {/* Legal */}
              <Text className={`${tc.sectionLabel} text-xs mt-4 mb-2`}>LEGAL</Text>

              <SettingsRow
                title="Termos e privacidade"
                subtitle="Uso informacional. Sem promessa de resultado."
                icon="document-text-outline"
                iconColor="#a78bfa"
                onPress={() => router.push('/legal')}
                cardClass={cardClass}
                titleClass={tc.text}
                subtitleClass={tc.textMuted}
                iconBgClass={iconBgClass}
                chevronColor={tc.iconMuted}
              />

              {/* Ações */}
              <Text className={`${tc.sectionLabel} text-xs mt-4 mb-2`}>AÇÕES</Text>

              <SettingsRow
                title="Sair"
                subtitle="Encerrar sessão neste dispositivo"
                icon="log-out-outline"
                iconColor="#ef4444"
                danger
                cardClass={cardClass}
                subtitleClass={tc.textMuted}
                iconBgClass={iconBgClass}
                chevronColor={tc.iconMuted}
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
