import { View, Text, Pressable, Modal, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';

import WelcomeMessage from '../../components/home/WelcomeMessage';
import TechnicalProfilePreviewCard from '../../components/home/TechnicalProfilePreviewCard';
import FineAnalysisCard from '../analysis/FineAnalysisCard';
import InfractionForm, { InfractionFormData } from '../analysis/InfractionForm';
import SubscriptionBanner from '../../components/subscription/SubscriptionBanner';
import GlobalHeader from '../../components/layout/GlobalHeader';

import { useTechnicalProfile } from '../../context/TechnicalProfileContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { useThemeClasses } from '../../context/ThemeContext';
import { usePlanUpgrade } from '../../context/PlanUpgradeContext';
import { useInfractionSearch } from '../../services/infractions/useInfractionSearch';
import { addDefesa } from '../../components/defesas/storage';
import { AnalyzedInfractionRecord } from '../../components/defesas/types';
import { SAMPLE_INFRACTION_INPUT } from '../../data/infractions/sampleInfractionInput';
import DocumentsSheet from '../../components/documents/DocumentsSheet';
import TouchableScale from '../../components/ui/TouchableScale';

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
  const tc = useThemeClasses();
  const { isActive } = useSubscription();
  const { showPlanUpgrade } = usePlanUpgrade();
  const { state, startManualAnalysis, reset } = useInfractionSearch();

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isDeletingProfile, setIsDeletingProfile] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [infractionModalOpen, setInfractionModalOpen] = useState(false);
  const [documentsModalOpen, setDocumentsModalOpen] = useState(false);
  const [editOptionsOpen, setEditOptionsOpen] = useState(false);
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
    if (!hasTechnicalProfile) {
      Alert.alert(
        'Cadastre seus dados primeiro',
        'Para analisar uma multa, você precisa cadastrar os dados do condutor e do veículo. Toque em "Cadastro técnico" na tela inicial para preencher as informações conforme os documentos oficiais.',
      );
      return;
    }

    if (!isActive) {
      showPlanUpgrade({
        feature: 'Análise técnica de multas',
        requiredPlan: 'starter',
      });
      return;
    }

    startManualAnalysis(infractionForm);
  }

  return (
    <View className={`flex-1 ${tc.screen}`}>
      <StatusBar style={tc.statusBar} />

      <LinearGradient colors={[...tc.screenGradient]} style={{ flex: 1 }}>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <GlobalHeader />

          <View className="h-4" />
          <WelcomeMessage />

          <View className="w-[90%] self-center">
            {!hasTechnicalProfile && (
              <View className={`mt-2 rounded-2xl px-6 py-6 ${tc.card}`}>
                <View className="flex-row items-center gap-3">
                  <View className="h-9 w-9 items-center justify-center rounded-full bg-amber-400/10 border border-amber-300/60">
                    <Ionicons name="id-card-outline" size={18} color="#f59e0b" />
                  </View>
                  <View className="flex-1">
                    <Text className={`text-sm font-semibold ${tc.text}`}>
                      Cadastro técnico do condutor e veículo
                    </Text>
                    <Text className={`${tc.textMuted} text-xs mt-1`}>
                      Use seus documentos para preencher ou revisar os dados técnicos antes de analisar multas.
                    </Text>
                  </View>
                </View>

                <View className="mt-5 flex-row gap-3">
                  <TouchableScale
                    onPress={() => router.push('/profile/TechnicalProfileScreen')}
                    style={{ flex: 1 }}
                  >
                    <View className="rounded-xl bg-amber-400 px-4 py-3">
                      <Text className="text-center text-sm font-semibold text-slate-900">
                        Cadastrar dados técnicos
                      </Text>
                    </View>
                  </TouchableScale>

                  <TouchableScale
                    onPress={() => setDocumentsModalOpen(true)}
                    style={{ flex: 1 }}
                  >
                    <View className="rounded-xl border border-amber-300/70 bg-amber-50 px-4 py-3">
                      <Text className="text-center text-[11px] font-semibold text-amber-700">
                        Usar documentos (CNH e CRLV)
                      </Text>
                    </View>
                  </TouchableScale>
                </View>
              </View>
            )}

            {hasTechnicalProfile && (
              <>
                <TechnicalProfilePreviewCard
                  onDeleteProfile={() => setConfirmDeleteOpen(true)}
                  onEditProfile={() => setEditOptionsOpen(true)}
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

      {/* OPÇÕES DE EDIÇÃO DO CADASTRO TÉCNICO */}
      <Modal
        visible={editOptionsOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setEditOptionsOpen(false)}
      >
        <View className="flex-1 bg-black/70 items-center justify-center px-6">
          <View className={`w-full max-w-[420px] rounded-2xl border p-5 ${tc.modalBg} ${tc.border}`}>
            <Text className={`${tc.text} text-base font-semibold`}>
              Como deseja atualizar o cadastro?
            </Text>
            <Text className={`${tc.textMuted} text-sm mt-2 leading-5`}>
              Você pode ajustar manualmente os dados ou reaproveitar as informações dos documentos.
            </Text>

            <View className="mt-5 gap-3">
              <TouchableScale
                onPress={() => {
                  setEditOptionsOpen(false);
                  router.push('/profile/TechnicalProfileScreen');
                }}
              >
                <View className="rounded-xl bg-amber-400 px-4 py-3">
                  <Text className="text-center text-sm font-semibold text-slate-900">
                    Editar cadastro manualmente
                  </Text>
                </View>
              </TouchableScale>

              <TouchableScale
                onPress={() => {
                  setEditOptionsOpen(false);
                  setDocumentsModalOpen(true);
                }}
              >
                <View className={`rounded-xl px-4 py-3 border ${tc.buttonSecondary}`}>
                  <Text
                    className={`text-center text-sm font-semibold ${tc.buttonSecondaryText}`}
                  >
                    Atualizar a partir dos documentos
                  </Text>
                </View>
              </TouchableScale>
            </View>

            <TouchableScale onPress={() => setEditOptionsOpen(false)}>
              <View className="mt-3 items-center">
                <Text className={`${tc.textSubtle} text-xs`}>Cancelar</Text>
              </View>
            </TouchableScale>
          </View>
        </View>
      </Modal>

      {/* MODAL DOCUMENTOS */}
      <Modal
        visible={documentsModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setDocumentsModalOpen(false)}
      >
        <View className="flex-1 justify-end bg-black/60">
          <Pressable
            className="absolute inset-0"
            onPress={() => setDocumentsModalOpen(false)}
          />

          <DocumentsSheet
            isOpen={documentsModalOpen}
            onClose={() => setDocumentsModalOpen(false)}
          />
        </View>
      </Modal>

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

          <View className={`rounded-t-3xl border-t max-h-[90%] ${tc.modalBg} ${tc.border}`}>
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
                <View className={`mb-4 h-1 w-10 self-center rounded-full ${tc.divider}`} />
                <Text className={`text-base font-semibold ${tc.text}`}>
                  Dados da multa
                </Text>

                <InfractionForm data={infractionForm} onChange={setInfractionForm} />

                <TouchableScale
                  disabled={!canAnalyze || state.status === 'loading'}
                  onPress={handleStartAnalysis}
                >
                  <View
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
                  </View>
                </TouchableScale>
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
          <View className={`w-full max-w-[420px] rounded-2xl border p-5 ${tc.modalBg} ${tc.border}`}>
            <Text className={`${tc.text} text-base font-semibold`}>
              Excluir cadastro técnico
            </Text>
            <Text className={`${tc.textMuted} text-sm mt-2 leading-5`}>
              Isso remove os dados do condutor e do veículo salvos neste dispositivo.
              Você poderá cadastrar novamente depois.
            </Text>

            <View className="flex-row gap-3 mt-5">
              <TouchableScale
                disabled={isDeletingProfile}
                onPress={() => setConfirmDeleteOpen(false)}
                style={{ flex: 1 }}
              >
                <View className={`rounded-xl py-3 border ${tc.buttonSecondary}`}>
                  <Text className={`text-center text-sm font-semibold ${tc.buttonSecondaryText}`}>
                    Cancelar
                  </Text>
                </View>
              </TouchableScale>

              <TouchableScale
                disabled={isDeletingProfile}
                onPress={handleConfirmDelete}
                style={{ flex: 1 }}
              >
                <View
                  className={`rounded-xl py-3 ${
                    isDeletingProfile ? 'bg-slate-800' : 'bg-red-500'
                  }`}
                >
                  <Text
                    className={`text-center text-sm font-semibold ${
                      isDeletingProfile ? 'text-slate-500' : 'text-white'
                    }`}
                  >
                    {isDeletingProfile ? 'Excluindo…' : 'Excluir'}
                  </Text>
                </View>
              </TouchableScale>
            </View>
          </View>
        </View>
      </Modal>

      {/* FEEDBACK DISCRETO */}
      <Modal visible={feedbackVisible} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/70 px-6">
          <View className={`rounded-2xl border px-5 py-4 ${tc.modalBg} ${tc.border}`}>
            <Text className={`${tc.text} text-sm font-semibold`}>Cadastro removido</Text>
            <Text className={`${tc.textMuted} text-xs mt-1`}>
              Dados técnicos foram limpos deste dispositivo.
            </Text>
          </View>
        </View>
      </Modal>

    </View>
  );
}
