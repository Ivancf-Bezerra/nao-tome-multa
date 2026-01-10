import { View, Text, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import HomeHeader from '../../components/home/HomeHeader';
import WelcomeMessage from '../../components/home/WelcomeMessage';
import TechnicalProfileCard from '../../components/home/TechnicalProfileCard';
import TechnicalProfilePreviewCard from '../../components/home/TechnicalProfilePreviewCard';
import FineSearchCard from '../../components/home/FineSearchCard';
import NotificationsModal from '../../components/home/NotificationsModal';

import { useTechnicalProfile } from '../../context/TechnicalProfileContext';

export default function Home() {
  const router = useRouter();
  const { profile, clearProfile } = useTechnicalProfile();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);

  const hasTechnicalProfile = Boolean(profile);

  function handleConfirmDelete() {
    clearProfile();
    setConfirmDeleteOpen(false);
    setFeedbackVisible(true);
  }

  // Auto-dismiss do feedback
  useEffect(() => {
    if (!feedbackVisible) return;

    const timer = setTimeout(() => {
      setFeedbackVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [feedbackVisible]);

  return (
    <View className="flex-1 bg-slate-900">
      <StatusBar style="light" />

      <LinearGradient
        colors={['#0f172a', '#1e293b']}
        style={{ flex: 1 }}
      >
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <HomeHeader
            onOpenNotifications={() => setNotificationsOpen(true)}
          />

          <View className="h-6" />

          <WelcomeMessage />

          <View className="w-full self-center">
            {!hasTechnicalProfile && (
              <TechnicalProfileCard
                onPress={() =>
                  router.push('/profile/TechnicalProfileScreen')
                }
              />
            )}

            {hasTechnicalProfile && (
              <>
                <TechnicalProfilePreviewCard
                  onDeleteProfile={() =>
                    setConfirmDeleteOpen(true)
                  }
                />
                <FineSearchCard />
              </>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* CONFIRMAÇÃO DE EXCLUSÃO */}
      <Modal
        visible={confirmDeleteOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setConfirmDeleteOpen(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="rounded-t-2xl bg-slate-900 px-6 pt-4 pb-6 border-t border-slate-800">
            <View className="mb-3 h-1 w-10 self-center rounded-full bg-slate-600" />

            <Text className="text-base font-semibold text-white mb-2">
              Excluir cadastro técnico
            </Text>

            <Text className="text-sm text-slate-400 mb-6">
              Esta ação remove permanentemente os dados técnicos
              do condutor e do veículo deste dispositivo.
            </Text>

            <Pressable
              onPress={handleConfirmDelete}
              className="rounded-lg bg-red-500 px-4 py-3 mb-3 active:opacity-90"
            >
              <Text className="text-center text-sm font-semibold text-white">
                Excluir cadastro
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setConfirmDeleteOpen(false)}
              className="rounded-lg border border-slate-700 px-4 py-3"
            >
              <Text className="text-center text-sm text-slate-300">
                Cancelar
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* FEEDBACK PÓS-EXCLUSÃO */}
      {feedbackVisible && (
        <View className="absolute bottom-6 self-center rounded-full bg-slate-800 px-4 py-2 border border-slate-700">
          <Text className="text-xs text-slate-200">
            Cadastro técnico removido com sucesso.
          </Text>
        </View>
      )}

      <NotificationsModal
        visible={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </View>
  );
}
