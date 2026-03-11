import { View, Text, Pressable, Modal, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';

import HomeHeader from '../../components/home/HomeHeader';
import WelcomeMessage from '../../components/home/WelcomeMessage';
import TechnicalProfileCard from '../../components/home/TechnicalProfileCard';
import TechnicalProfilePreviewCard from '../../components/home/TechnicalProfilePreviewCard';
import NotificationsModal from '../../components/home/NotificationsModal';
import FineAnalysisCard from '../analysis/FineAnalysisCard';
import InfractionForm, { InfractionFormData } from '../analysis/InfractionForm';
import SubscriptionBanner from '../../components/subscription/SubscriptionBanner';

import { useTechnicalProfile } from '../../context/TechnicalProfileContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { useStatusMultas } from '../../context/StatusMultasContext';
import { useInfractionSearch } from '../../services/infractions/useInfractionSearch';
import { addDefesa } from '../../components/defesas/storage';
import { AnalyzedInfractionRecord } from '../../components/defesas/types';
import { SAMPLE_INFRACTION_INPUT } from '../../data/infractions/sampleInfractionInput';

const EMPTY_FORM: InfractionFormData = {
  aitNumber: '',
  renainf: '',
  infractionCode: '',
  description: '',
  issuingBodyCode: '',
  issuingBody: '',
  competentBodyCode: '',
  competentBody: '',
  agentId: '',
  equipmentId: '',
  equipmentCalibrationDate: '',
  infractionDate: '',
  notes: '',
};

/** Em desenvolvimento: formulário inicia preenchido com dados de teste para fluxo rápido. */
const INITIAL_FORM: InfractionFormData = __DEV__
  ? { ...SAMPLE_INFRACTION_INPUT }
  : EMPTY_FORM;

export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  const { profile, clearProfile } = useTechnicalProfile();
  const { isActive } = useSubscription();
  const { items: statusItems, lastReadAt, unreadCount: statusUnreadCount } = useStatusMultas();
  const unreadStatusItems =
    !lastReadAt || lastReadAt === ''
      ? statusItems
      : statusItems.filter((i) => i.updatedAt > lastReadAt);
  const { state, startManualAnalysis, reset } = useInfractionSearch();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isDeletingProfile, setIsDeletingProfile] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [infractionModalOpen, setInfractionModalOpen] = useState(false);
  const [infractionForm, setInfractionForm] = useState<InfractionFormData>(INITIAL_FORM);

  const hasTechnicalProfile = Boolean(profile);
  const canAnalyze =
    infractionForm.aitNumber.trim().length >= 3 &&
    infractionForm.description.trim().length >= 5;

  useEffect(() => {
    if (state.status !== 'success' || !state.data || !user?.id) return;

    const { input, result } = state.data;

    if (!result.hasInconsistencies) {
      setInfractionModalOpen(false);
      reset();
      return;
    }

    const record: AnalyzedInfractionRecord = {
      id: `inf_${input.aitNumber}_${Date.now()}`,
      input,
      analyzedAt: new Date().toISOString(),
      result,
      defense: null,
    };

    addDefesa(user.id, record).then(() => {
      setInfractionModalOpen(false);
      setInfractionForm(INITIAL_FORM);
      reset();
      router.push('/(tabs)/defesas');
    });
  }, [state.status]);

  async function handleConfirmDelete() {
    if (isDeletingProfile) return;
    setIsDeletingProfile(true);
    try {
      await clearProfile();
      setConfirmDeleteOpen(false);
      setFeedbackVisible(true);
      setTimeout(() => setFeedbackVisible(false), 1200);
    } finally {
      setIsDeletingProfile(false);
    }
  }

  function handleStartAnalysis() {
    startManualAnalysis(infractionForm);
  }

  return (
    <View className="flex-1 bg-slate-900">
      <StatusBar style="light" />

      <LinearGradient colors={['#0f172a', '#1e293b']} style={{ flex: 1 }}>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <HomeHeader
            onOpenNotifications={() => setNotificationsOpen(true)}
            unreadStatusCount={statusUnreadCount}
          />

          <View className="h-6" />
          <WelcomeMessage />

          <View className="w-[90%] self-center">
            {!hasTechnicalProfile && (
              <TechnicalProfileCard
                onPress={() => router.push('/profile/TechnicalProfileScreen')}
              />
            )}

            {hasTechnicalProfile && (
              <>
                <TechnicalProfilePreviewCard
                  onDeleteProfile={() => setConfirmDeleteOpen(true)}
                />

                {isActive ? (
                  <FineAnalysisCard onStartAnalysis={() => setInfractionModalOpen(true)} />
                ) : (
                  <SubscriptionBanner
                    onSubscribe={() => router.push('/subscription/plans')}
                  />
                )}
              </>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* MODAL DA MULTA */}
      <Modal
        visible={infractionModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setInfractionModalOpen(false)}
      >
        <View className="flex-1 justify-end bg-black/60">
          <Pressable
            className="absolute inset-0"
            onPress={() => setInfractionModalOpen(false)}
          />

          <View className="rounded-t-3xl border-t border-slate-800 bg-slate-900 max-h-[90%]">
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={{ maxHeight: '100%' }}
            >
              <ScrollView
                contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32 }}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
                bounces={false}
              >
                <View className="mb-4 h-1 w-10 self-center rounded-full bg-slate-700" />
                <Text className="text-base font-semibold text-white">
                  Dados da multa
                </Text>

                <InfractionForm data={infractionForm} onChange={setInfractionForm} />

                <Pressable
                  disabled={!canAnalyze || state.status === 'loading'}
                  onPress={handleStartAnalysis}
                  className={`mt-6 rounded-xl py-4 ${
                    canAnalyze && state.status !== 'loading' ? 'bg-amber-400' : 'bg-slate-800'
                  }`}
                >
                  <Text
                    className={`text-center text-sm font-semibold ${
                      canAnalyze && state.status !== 'loading'
                        ? 'text-slate-900'
                        : 'text-slate-500'
                    }`}
                  >
                    {state.status === 'loading' ? 'Analisando…' : 'Iniciar análise técnica'}
                  </Text>
                </Pressable>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>

      {/* CONFIRMAÇÃO: EXCLUIR CADASTRO */}
      <Modal
        visible={confirmDeleteOpen}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (isDeletingProfile) return;
          setConfirmDeleteOpen(false);
        }}
      >
        <View className="flex-1 bg-black/70 items-center justify-center px-6">
          <View className="w-full max-w-[420px] rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <Text className="text-white text-base font-semibold">
              Excluir cadastro técnico
            </Text>
            <Text className="text-slate-400 text-sm mt-2 leading-5">
              Isso remove os dados do condutor e do veículo salvos neste dispositivo.
              Você poderá cadastrar novamente depois.
            </Text>

            <View className="flex-row gap-3 mt-5">
              <Pressable
                disabled={isDeletingProfile}
                onPress={() => setConfirmDeleteOpen(false)}
                className="flex-1 rounded-xl py-3 border border-slate-700 bg-slate-800 active:opacity-70"
              >
                <Text className="text-center text-sm font-semibold text-slate-200">
                  Cancelar
                </Text>
              </Pressable>

              <Pressable
                disabled={isDeletingProfile}
                onPress={handleConfirmDelete}
                className={`flex-1 rounded-xl py-3 ${
                  isDeletingProfile ? 'bg-slate-800' : 'bg-red-500'
                } active:opacity-80`}
              >
                <Text
                  className={`text-center text-sm font-semibold ${
                    isDeletingProfile ? 'text-slate-500' : 'text-white'
                  }`}
                >
                  {isDeletingProfile ? 'Excluindo…' : 'Excluir'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* FEEDBACK DISCRETO */}
      <Modal visible={feedbackVisible} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/70 px-6">
          <View className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">
            <Text className="text-white text-sm font-semibold">Cadastro removido</Text>
            <Text className="text-slate-400 text-xs mt-1">
              Dados técnicos foram limpos deste dispositivo.
            </Text>
          </View>
        </View>
      </Modal>

      <NotificationsModal
        visible={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        unreadItems={unreadStatusItems}
      />
    </View>
  );
}
