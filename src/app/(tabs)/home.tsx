import {
  View,
  Text,
  Pressable,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import HomeHeader from '../../components/home/HomeHeader';
import WelcomeMessage from '../../components/home/WelcomeMessage';
import TechnicalProfileCard from '../../components/home/TechnicalProfileCard';
import TechnicalProfilePreviewCard from '../../components/home/TechnicalProfilePreviewCard';
import NotificationsModal from '../../components/home/NotificationsModal';
import FineAnalysisCard from '../analysis/FineAnalysisCard';
import InfractionForm, {
  InfractionFormData,
} from '../analysis/InfractionForm';

import { useTechnicalProfile } from '../../context/TechnicalProfileContext';
import {
  useInfractionSearch,
} from '../../services/infractions/useInfractionSearch';
import {
  analyzeInfractions,
} from '../../services/analysis/TechnicalAnalyzer';
import {
  buildAnalysisResult,
} from '../../services/analysis/AnalysisResult';

export default function Home() {
  const router = useRouter();
  const { profile, clearProfile } =
    useTechnicalProfile();

  const {
    state: analysisState,
    startManualAnalysis,
  } = useInfractionSearch();

  const [notificationsOpen, setNotificationsOpen] =
    useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] =
    useState(false);
  const [feedbackVisible, setFeedbackVisible] =
    useState(false);

  const [infractionModalOpen, setInfractionModalOpen] =
    useState(false);

  const [infractionForm, setInfractionForm] =
    useState<InfractionFormData>({
      id: '',
      description: '',
      notes: '',
    });

  const hasTechnicalProfile = Boolean(profile);

  const canAnalyze =
    infractionForm.id.trim().length >= 3 &&
    infractionForm.description.trim().length >=
      5;

  /* =======================
     OBSERVA RESULTADO REAL
     ======================= */
  useEffect(() => {
    if (
      analysisState.status !== 'success' ||
      !analysisState.data
    )
      return;

    console.log('==============================');
    console.log('[ANÁLISE TÉCNICA REAL]');
    console.log(
      'Multa informada:',
    );
    console.log(
      JSON.stringify(
        analysisState.data.infraction,
        null,
        2,
      ),
    );

    const analyzed = analyzeInfractions([
      analysisState.data.infraction,
    ]);

    console.log(
      'Infrações analisadas:',
    );
    console.log(
      JSON.stringify(analyzed, null, 2),
    );

    const result = buildAnalysisResult(
      analyzed,
    );

    console.log(
      'Resultado consolidado:',
    );
    console.log(
      JSON.stringify(result, null, 2),
    );
    console.log('==============================');

    // ⚠️ MVP ATUAL:
    // - não fecha modal
    // - não salva
    // - não navega
  }, [analysisState.status, analysisState.data]);

  function handleConfirmDelete() {
    clearProfile();
    setConfirmDeleteOpen(false);
    setFeedbackVisible(true);
  }

  return (
    <View className="flex-1 bg-slate-900">
      <StatusBar style="light" />

      <LinearGradient
        colors={['#0f172a', '#1e293b']}
        style={{ flex: 1 }}
      >
        <SafeAreaView
          edges={['top']}
          style={{ flex: 1 }}
        >
          <HomeHeader
            onOpenNotifications={() =>
              setNotificationsOpen(true)
            }
          />

          <View className="h-6" />
          <WelcomeMessage />

          <View className="w-[90%] self-center">
            {!hasTechnicalProfile && (
              <TechnicalProfileCard
                onPress={() =>
                  router.push(
                    '/profile/TechnicalProfileScreen',
                  )
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

                <FineAnalysisCard
                  onStartAnalysis={() =>
                    setInfractionModalOpen(true)
                  }
                />
              </>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* MODAL LOCAL DA MULTA */}
      <Modal
        visible={infractionModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setInfractionModalOpen(false)
        }
      >
        <View className="flex-1 justify-end bg-black/60">
          <Pressable
            className="absolute inset-0"
            onPress={() =>
              setInfractionModalOpen(false)
            }
          />

          <View className="rounded-t-3xl border-t border-slate-800 bg-slate-900 px-6 pt-6 pb-8">
            <Text className="text-base font-semibold text-white">
              Dados da multa
            </Text>

            <InfractionForm
              data={infractionForm}
              onChange={setInfractionForm}
            />

            <Pressable
              disabled={!canAnalyze}
              onPress={() => {
                console.log(
                  '🔥 DISPARO DA ANÁLISE REAL',
                );

                startManualAnalysis({
                  id: infractionForm.id.trim(),
                  description:
                    infractionForm.description.trim(),
                  notes:
                    infractionForm.notes.trim(),
                });
              }}
              className={`mt-6 rounded-xl py-4 ${
                canAnalyze
                  ? 'bg-amber-400'
                  : 'bg-slate-800'
              }`}
            >
              <Text
                className={`text-center text-sm font-semibold ${
                  canAnalyze
                    ? 'text-slate-900'
                    : 'text-slate-500'
                }`}
              >
                Iniciar análise técnica
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <NotificationsModal
        visible={notificationsOpen}
        onClose={() =>
          setNotificationsOpen(false)
        }
      />
    </View>
  );
}
