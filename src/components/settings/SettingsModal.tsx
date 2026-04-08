import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme, useThemeClasses } from '../../context/ThemeContext';
import { useSettingsModal } from '../../context/SettingsModalContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

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
          <View className="h-10 w-10 items-center justify-center">
            <Ionicons name={icon} size={24} color={iconColor} />
          </View>
          <View className="ml-3 flex-1">
            <Text
              className={`text-sm font-semibold ${danger ? 'text-red-400' : titleClass}`}
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
            <Ionicons name="chevron-forward" size={20} color={chevronColor} />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

export default function SettingsModal() {
  const { isOpen, close } = useSettingsModal();
  const insets = useSafeAreaInsets();
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const tc = useThemeClasses();
  const [showLegal, setShowLegal] = useState(false);
  const [internalVisible, setInternalVisible] = useState(false);

  const translateX = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isOpen) {
      translateX.setValue(-SCREEN_WIDTH);
      setInternalVisible(true);
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        damping: 22,
        mass: 0.9,
        stiffness: 130,
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: -SCREEN_WIDTH,
        duration: 230,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setInternalVisible(false);
          setShowLegal(false);
        }
      });
    }
  }, [isOpen]);

  const email =
    isLoaded && user?.primaryEmailAddress?.emailAddress
      ? user.primaryEmailAddress.emailAddress
      : '—';

  const cardClass = `rounded-2xl border px-4 py-4 mb-3 ${tc.card}`;
  const iconBgClass = theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100';

  function handleClose() {
    if (showLegal) {
      setShowLegal(false);
    } else {
      close();
    }
  }

  return (
    <Modal
      visible={internalVisible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={{ flex: 1 }}>
        <Pressable className="absolute inset-0 bg-black/60" onPress={handleClose} />

        <Animated.View
          className={`rounded-r-3xl rounded-tl-3xl ${tc.modalBg}`}
          style={{
            marginTop: insets.top,
            flex: 1,
            width: '80%',
            transform: [{ translateX }],
          }}
        >
          <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
            {/* Barra de navegação */}
            <View className="flex-row items-center pt-3 pb-3" style={{ height: 52 }}>
              <Pressable
                onPress={handleClose}
                hitSlop={16}
                className="px-4 active:opacity-70"
              >
                <Ionicons name="chevron-back" size={26} color={tc.iconMuted} />
              </Pressable>
              <Text className={`flex-1 text-center text-sm font-semibold ${tc.text}`}>
                {showLegal ? 'Termos e privacidade' : 'Configurações'}
              </Text>
              <View style={{ width: 50 }} />
            </View>

            {showLegal ? (
              <ScrollView
                contentContainerStyle={{
                  paddingTop: 16,
                  paddingHorizontal: 24,
                  paddingBottom: 32,
                }}
                showsVerticalScrollIndicator={false}
              >
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
                    <Text className={`${tc.textMuted} text-sm mt-3 leading-5`}>
                      Os dados informados pelo usuário são utilizados para exibição
                      e organização dentro do aplicativo. O app não realiza
                      monitoramento automático de sistemas públicos.
                    </Text>
                  </View>
                  <View className={`mt-5 pt-4 ${tc.borderB}`}>
                    <Text className={`${tc.text} font-semibold text-sm`}>
                      Responsabilidade
                    </Text>
                    <Text className={`${tc.textMuted} text-sm mt-3 leading-5`}>
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
              </ScrollView>
            ) : (
              <ScrollView
                contentContainerStyle={{
                  paddingTop: 16,
                  paddingHorizontal: 24,
                  paddingBottom: 32,
                }}
                showsVerticalScrollIndicator={false}
              >
                <View className="mb-5">
                  <Text className={`${tc.textMuted} text-base leading-relaxed`}>
                    Preferências do aplicativo e informações institucionais.
                  </Text>
                </View>

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

                <Text className={`${tc.sectionLabel} text-xs mt-4 mb-2`}>LEGAL</Text>
                <SettingsRow
                  title="Termos e privacidade"
                  subtitle="Uso informacional. Sem promessa de resultado."
                  icon="document-text-outline"
                  iconColor="#a78bfa"
                  onPress={() => setShowLegal(true)}
                  cardClass={cardClass}
                  titleClass={tc.text}
                  subtitleClass={tc.textMuted}
                  iconBgClass={iconBgClass}
                  chevronColor={tc.iconMuted}
                />

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
                              'Não foi possível encerrar a sessão.',
                            );
                          }
                        },
                      },
                    ]);
                  }}
                />
              </ScrollView>
            )}
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}
