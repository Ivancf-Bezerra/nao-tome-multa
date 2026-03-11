import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, Alert, Share, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '@clerk/clerk-expo';
import { useFocusEffect } from 'expo-router';

import { AnalyzedInfractionRecord } from '../../components/defesas/types';
import {
  loadDefesas,
  deleteDefesa,
  updateDefesa,
  addDefesa,
} from '../../components/defesas/storage';
import { buildSampleDefesas } from '../../data/defesas/sampleDefesas';
import DefesasBottomSheet from '../../components/defesas/DefesasBottomSheet';
import DefenseDetailModal from '../../components/defesas/DefenseDetailModal';

import { buildDefense } from '../../services/analysis/DefenseBuilder';
import { useTechnicalProfile } from '../../context/TechnicalProfileContext';
import { useStatusMultas } from '../../context/StatusMultasContext';
import { addStatusMulta } from '../../storage/statusStorage';
import type { StatusMultaEnviada } from '../../data/status/types';

export default function Defesas() {
  const { user } = useUser();
  const { profile } = useTechnicalProfile();
  const { refresh: refreshStatus } = useStatusMultas();

  const [records, setRecords] = useState<AnalyzedInfractionRecord[]>([]);
  const [selected, setSelected] = useState<AnalyzedInfractionRecord | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);
  const [isLoadingSamples, setIsLoadingSamples] = useState(false);

  async function fetchRecords() {
    if (!user?.id) return;
    const loaded = await loadDefesas(user.id);
    setRecords(loaded);
  }

  async function handleLoadSamples() {
    if (!user?.id || isLoadingSamples) return;
    setIsLoadingSamples(true);
    try {
      const samples = buildSampleDefesas();
      for (const record of samples) {
        await addDefesa(user.id, record);
      }
      await fetchRecords();
    } finally {
      setIsLoadingSamples(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchRecords();
    }, [user?.id]),
  );

  const inconsistentRecords = useMemo(
    () => records.filter((r) => r.result.hasInconsistencies),
    [records],
  );

  function openRecord(record: AnalyzedInfractionRecord) {
    setSelected(record);
    setDetailOpen(true);
  }

  function closeDetail() {
    setDetailOpen(false);
    setSelected(null);
  }

  async function handleShare(record: AnalyzedInfractionRecord) {
    const defesaText = record.defense?.defesaPrevia?.trim()
      ? record.defense.defesaPrevia
      : '(Defesa não gerada)';

    const content =
      `EXTRATO TÉCNICO — NÃO TOME MULTA\n\n` +
      `AIT: ${record.input.aitNumber}\n` +
      `Descrição: ${record.input.description}\n\n` +
      `Resumo: ${record.result.summary}\n\n` +
      `Inconsistências:\n` +
      record.result.findings
        .map((f) => `- [${f.severity.toUpperCase()}] ${f.title}`)
        .join('\n') +
      `\n\n${defesaText}`;

    try {
      await Share.share({ message: content });
      if (user?.id) {
        const statusItem: StatusMultaEnviada = {
          id: `status_${record.id}`,
          recordId: record.id,
          aitNumber: record.input.aitNumber,
          description: record.input.description,
          status: 'enviada',
          updatedAt: new Date().toISOString(),
          lastMessage: 'Defesa encaminhada ao órgão competente. Acompanhe o status nesta aba.',
          findings: record.result.findings,
          input: record.input,
        };
        await addStatusMulta(user.id, statusItem);
        await deleteDefesa(user.id, record.id);
        await refreshStatus();
        await fetchRecords();
        if (selected?.id === record.id) closeDetail();
      }
    } catch {
      Alert.alert('Falha ao compartilhar', 'Não foi possível abrir o compartilhamento.');
    }
  }

  function handleDeleteRecord(record: AnalyzedInfractionRecord) {
    Alert.alert('Excluir registro', 'Esta ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          if (!user?.id) return;
          const updated = await deleteDefesa(user.id, record.id);
          setRecords(updated);
          if (selected?.id === record.id) closeDetail();
        },
      },
    ]);
  }

  async function handleGenerateDefense() {
    if (!selected || !user?.id) return;
    setIsGenerating(true);

    try {
      const built = buildDefense(selected.result.findings, profile, selected.input);

      const updated: AnalyzedInfractionRecord = {
        ...selected,
        defense: {
          id: `def_${selected.id}`,
          defesaPrevia: built.defesaPrevia,
          recursoJARI: '', // Recurso JARI só é gerado pelo botão "Gerar recurso à JARI"
          updatedAt: new Date().toISOString(),
        },
      };

      const updatedRecords = await updateDefesa(user.id, updated);
      setRecords(updatedRecords);
      setSelected(updated);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSaveDefense() {
    if (!selected || !user?.id) return;
    setSaveFeedback(true);
    const updatedRecords = await updateDefesa(user.id, selected);
    setRecords(updatedRecords);
    setSelected(selected);
    setTimeout(() => {
      setSaveFeedback(false);
      closeDetail();
    }, 400);
  }

  return (
    <View className="flex-1 bg-slate-900">
      <StatusBar style="light" />

      <LinearGradient colors={['#0f172a', '#1e293b']} style={{ flex: 1 }}>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <View className="w-[90%] self-center pt-4">
            <Text className="text-white text-xl font-semibold">Defesas</Text>
            <Text className="text-slate-400 text-sm mt-2">
              Análises com inconsistências técnicas detectadas.
            </Text>
            <Text className="text-slate-500 text-xs mt-1">
              O conteúdo é técnico-informacional e não substitui orientação jurídica.
            </Text>

            {__DEV__ && (
              <Pressable
                onPress={handleLoadSamples}
                disabled={isLoadingSamples}
                className="mt-4 rounded-xl border border-amber-400/50 bg-amber-400/10 py-3 active:opacity-90"
              >
                <Text className="text-center text-sm font-semibold text-amber-400">
                  {isLoadingSamples ? 'Carregando…' : 'Carregar exemplos de multas'}
                </Text>
              </Pressable>
            )}
          </View>

          <DefesasBottomSheet
            records={inconsistentRecords}
            onView={openRecord}
            onSend={handleShare}
            onDelete={handleDeleteRecord}
          />
        </SafeAreaView>
      </LinearGradient>

      <DefenseDetailModal
        visible={detailOpen}
        record={selected}
        isSaving={isGenerating}
        saveFeedback={saveFeedback}
        onClose={closeDetail}
        onGenerateDefense={handleGenerateDefense}
        onSaveDefense={handleSaveDefense}
        onDelete={() => {
          if (!selected) return;
          handleDeleteRecord(selected);
        }}
      />
    </View>
  );
}
