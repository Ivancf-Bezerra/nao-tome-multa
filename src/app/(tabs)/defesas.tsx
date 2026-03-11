import React, { useCallback, useMemo, useState } from "react";
import { View, Text, Alert, Share, Pressable, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "@clerk/clerk-expo";
import { useFocusEffect } from "expo-router";
import { useNavigation } from "@react-navigation/native";

import { AnalyzedInfractionRecord } from "../../components/defesas/types";
import {
  loadDefesas,
  deleteDefesa,
  updateDefesa,
  addDefesa,
} from "../../components/defesas/storage";
import { buildSampleDefesas } from "../../data/defesas/sampleDefesas";
import DefesasBottomSheet from "../../components/defesas/DefesasBottomSheet";
import DefenseDetailModal from "../../components/defesas/DefenseDetailModal";

import { buildDefense } from "../../services/analysis/DefenseBuilder";
import { useTechnicalProfile } from "../../context/TechnicalProfileContext";
import { useStatusMultas } from "../../context/StatusMultasContext";
import { useThemeClasses } from "../../context/ThemeContext";
import { addStatusMulta } from "../../storage/statusStorage";
import type { StatusMultaEnviada } from "../../data/status/types";

export default function Defesas() {
  const navigation = useNavigation();
  const { user } = useUser();
  const { profile } = useTechnicalProfile();
  const { refresh: refreshStatus } = useStatusMultas();
  const tc = useThemeClasses();

  const [records, setRecords] = useState<AnalyzedInfractionRecord[]>([]);
  const [selected, setSelected] = useState<AnalyzedInfractionRecord | null>(
    null,
  );
  const [detailOpen, setDetailOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);
  const [isLoadingSamples, setIsLoadingSamples] = useState(false);
  const [postShareVisible, setPostShareVisible] = useState(false);

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
      : "(Defesa não gerada)";

    const content =
      `EXTRATO TÉCNICO — NÃO TOME MULTA\n\n` +
      `AIT: ${record.input.aitNumber}\n` +
      `Descrição: ${record.input.description}\n\n` +
      `Resumo: ${record.result.summary}\n\n` +
      `Inconsistências:\n` +
      record.result.findings
        .map((f) => `- [${f.severity.toUpperCase()}] ${f.title}`)
        .join("\n") +
      `\n\n${defesaText}`;

    try {
      await Share.share({ message: content });
      if (user?.id) {
        const statusItem: StatusMultaEnviada = {
          id: `status_${record.id}`,
          recordId: record.id,
          aitNumber: record.input.aitNumber,
          description: record.input.description,
          status: "enviada",
          updatedAt: new Date().toISOString(),
          lastMessage:
            "Defesa encaminhada ao órgão competente. Acompanhe o status nesta aba.",
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
      Alert.alert(
        "Falha ao compartilhar",
        "Não foi possível abrir o compartilhamento.",
      );
    }
  }

  function handleDeleteRecord(record: AnalyzedInfractionRecord) {
    Alert.alert("Excluir registro", "Esta ação não pode ser desfeita.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
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
      const built = buildDefense(
        selected.result.findings,
        profile,
        selected.input,
      );

      const updated: AnalyzedInfractionRecord = {
        ...selected,
        defense: {
          id: `def_${selected.id}`,
          defesaPrevia: built.defesaPrevia,
          recursoJARI: "", // Recurso JARI só é gerado pelo botão "Gerar recurso à JARI"
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

  async function handleSaveAndSendDefense() {
    if (!selected || !user?.id) return;
    setSaveFeedback(true);

    const defesaText = selected.defense?.defesaPrevia?.trim()
      ? selected.defense.defesaPrevia
      : "(Defesa não gerada)";

    const content =
      `EXTRATO TÉCNICO — NÃO TOME MULTA\n\n` +
      `AIT: ${selected.input.aitNumber}\n` +
      `Descrição: ${selected.input.description}\n\n` +
      `Resumo: ${selected.result.summary}\n\n` +
      `Inconsistências:\n` +
      selected.result.findings
        .map((f) => `- [${f.severity.toUpperCase()}] ${f.title}`)
        .join("\n") +
      `\n\n${defesaText}`;

    const recordToProcess = selected;

    try {
      // 1) Sempre salva/atualiza a defesa
      await updateDefesa(user.id, recordToProcess);
      setRecords((prev) =>
        prev.map((r) => (r.id === recordToProcess.id ? recordToProcess : r)),
      );
      setSelected(recordToProcess);

      // 2) Garante que o estado atualize antes de abrir o compartilhamento
      await new Promise((r) => setTimeout(r, 0));

      // 3) Abre o compartilhamento
      const result = await Share.share({
        message: content,
        title: "Defesa técnica — Não Tome Multa",
      });

      // 4) Fecha o modal de detalhes
      closeDetail();

      // 5) Só entra em Status se o compartilhamento foi concluído
      const wasShared =
        result?.action === Share.sharedAction ||
        result?.action === "sharedAction";

      if (!wasShared || !user?.id) {
        return;
      }

      const statusItem: StatusMultaEnviada = {
        id: `status_${recordToProcess.id}`,
        recordId: recordToProcess.id,
        aitNumber: recordToProcess.input.aitNumber,
        description: recordToProcess.input.description,
        status: "enviada",
        updatedAt: new Date().toISOString(),
        lastMessage:
          "Defesa encaminhada ao órgão competente. Acompanhe o status nesta aba.",
        findings: recordToProcess.result.findings,
        input: recordToProcess.input,
      };

      await addStatusMulta(user.id, statusItem);
      await deleteDefesa(user.id, recordToProcess.id);
      await refreshStatus();
      await fetchRecords();

      // 6) Abre o modal de pós-envio
      setPostShareVisible(true);
    } catch (err) {
      Alert.alert(
        "Falha ao compartilhar",
        "Não foi possível abrir o compartilhamento. Verifique se há apps disponíveis para compartilhar.",
      );
    } finally {
      setSaveFeedback(false);
    }
  }

  return (
    <View className={`flex-1 ${tc.screen}`}>
      <StatusBar style={tc.statusBar} />

      <LinearGradient colors={[...tc.screenGradient]} style={{ flex: 1 }}>
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
          <View className="w-[90%] self-center pt-4">
            <Text className={`${tc.text} text-xl font-semibold`}>Defesas</Text>
            <Text className={`${tc.textMuted} text-sm mt-2`}>
              Multas com inconsistências técnicas detectadas.
            </Text>
            <Text className={`${tc.textSubtle} text-xs mt-1`}>
              Após compartilhar a defesa, acompanhe o andamento na aba Status.
            </Text>

            {__DEV__ && (
              <Pressable
                onPress={handleLoadSamples}
                disabled={isLoadingSamples}
                className="mt-4 rounded-xl border border-amber-400/50 bg-amber-400/10 py-3 active:opacity-90"
              >
                <Text className="text-center text-sm font-semibold text-amber-500">
                  {isLoadingSamples
                    ? "Carregando…"
                    : "Carregar exemplos de multas"}
                </Text>
              </Pressable>
            )}
          </View>

          <View className="flex-1">
            <DefesasBottomSheet
              records={inconsistentRecords}
              onView={openRecord}
              onSend={handleShare}
              onDelete={handleDeleteRecord}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <DefenseDetailModal
        visible={detailOpen}
        record={selected}
        isSaving={isGenerating}
        saveFeedback={saveFeedback}
        onClose={closeDetail}
        onGenerateDefense={handleGenerateDefense}
        onSaveDefense={handleSaveAndSendDefense}
        onDelete={() => {
          if (!selected) return;
          handleDeleteRecord(selected);
        }}
      />

      <Modal
        visible={postShareVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPostShareVisible(false)}
      >
        <View className="flex-1 bg-black/60 items-center justify-center px-6">
          <View
            className={`w-full max-w-[400px] rounded-2xl px-5 py-6 ${tc.modalBg} ${tc.border}`}
          >
            <Text className={`${tc.text} text-base font-semibold`}>
              Defesa enviada
            </Text>
            <Text className={`${tc.textMuted} text-sm mt-2 mb-4`}>
              Sua defesa foi salva e enviada. Você pode acompanhar o andamento
              na aba Status.
            </Text>

            <View className="flex-row gap-3 mt-2">
              <Pressable
                className={`flex-1 rounded-xl py-3 items-center border ${tc.buttonSecondary}`}
                onPress={() => {
                  setPostShareVisible(false);
                  (navigation as { navigate: (name: string) => void }).navigate(
                    "home",
                  );
                }}
              >
                <Text
                  className={`text-sm font-semibold ${tc.buttonSecondaryText}`}
                >
                  Voltar para início
                </Text>
              </Pressable>

              <Pressable
                className="flex-1 rounded-xl py-3 items-center bg-amber-400 active:opacity-90"
                onPress={() => {
                  setPostShareVisible(false);
                  (navigation as { navigate: (name: string) => void }).navigate(
                    "status",
                  );
                }}
              >
                <Text className="text-sm font-semibold text-slate-900">
                  Ir para Status
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
