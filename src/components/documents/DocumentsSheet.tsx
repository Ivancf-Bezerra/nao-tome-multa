import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  useTechnicalProfile,
  type TechnicalProfile,
  type DriverProfile,
  type VehicleProfile,
} from '../../context/TechnicalProfileContext';
import { useThemeClasses } from '../../context/ThemeContext';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.8;

const EMPTY_DRIVER: DriverProfile = {
  fullName: '',
  cpf: '',
  cnhNumber: '',
  cnhCategory: '',
  cnhExpiry: '',
  cnhIssuerUF: '',
};

const EMPTY_VEHICLE: VehicleProfile = {
  plate: '',
  renavam: '',
  brand: '',
  model: '',
  color: '',
  city: '',
  uf: '',
  ownerCpf: '',
};

// Exemplos de mapeamento de campos que futuramente serão preenchidos via OCR.
const AUTO_DRIVER_FROM_DOCUMENT: DriverProfile = {
  fullName: 'Nome do Condutor Conforme CNH',
  cpf: '00000000000',
  cnhNumber: '00000000000',
  cnhCategory: 'B',
  cnhExpiry: '01/01/2030',
  cnhIssuerUF: 'SP',
};

const AUTO_VEHICLE_FROM_DOCUMENT: VehicleProfile = {
  plate: 'ABC1D23',
  renavam: '00000000000',
  brand: 'Marca do Veículo',
  model: 'Modelo do Veículo',
  color: 'Cor',
  city: 'São Paulo',
  uf: 'SP',
  ownerCpf: '00000000000',
};

type Props = {
  onClose: () => void;
};

export default function DocumentsSheet({ onClose }: Props) {
  const { profile, saveProfile } = useTechnicalProfile();
  const tc = useThemeClasses();
  const [isApplyingDriver, setIsApplyingDriver] = useState(false);
  const [isApplyingVehicle, setIsApplyingVehicle] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function applyDriverFromDocument() {
    if (isApplyingDriver) return;
    setIsApplyingDriver(true);
    setFeedback(null);

    try {
      const now = new Date().toISOString();
      const base: TechnicalProfile = profile ?? {
        driver: { ...EMPTY_DRIVER },
        vehicle: { ...EMPTY_VEHICLE },
        createdAt: now,
      };

      const updated: TechnicalProfile = {
        ...base,
        driver: {
          ...base.driver,
          ...AUTO_DRIVER_FROM_DOCUMENT,
        },
      };

      await saveProfile(updated);
      setFeedback('Dados do condutor preenchidos automaticamente a partir do documento.');
    } finally {
      setIsApplyingDriver(false);
      setTimeout(() => setFeedback(null), 2000);
    }
  }

  async function applyVehicleFromDocument() {
    if (isApplyingVehicle) return;
    setIsApplyingVehicle(true);
    setFeedback(null);

    try {
      const now = new Date().toISOString();
      const base: TechnicalProfile = profile ?? {
        driver: { ...EMPTY_DRIVER },
        vehicle: { ...EMPTY_VEHICLE },
        createdAt: now,
      };

      const updated: TechnicalProfile = {
        ...base,
        vehicle: {
          ...base.vehicle,
          ...AUTO_VEHICLE_FROM_DOCUMENT,
        },
      };

      await saveProfile(updated);
      setFeedback('Dados do veículo preenchidos automaticamente a partir do documento.');
    } finally {
      setIsApplyingVehicle(false);
      setTimeout(() => setFeedback(null), 2000);
    }
  }

  const hasDriver = Boolean(profile?.driver?.fullName);
  const hasVehicle = Boolean(profile?.vehicle?.plate);

  return (
    <View
      className={`rounded-t-3xl border-t ${tc.modalBg} ${tc.border}`}
      style={{ maxHeight: SHEET_MAX_HEIGHT }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ maxHeight: '100%' }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
          bounces={false}
        >
          {/* HEADER */}
          <View className={`pb-4 ${tc.borderB}`}>
            <View className={`mb-3 h-1 w-10 self-center rounded-full ${tc.divider}`} />

            <View className="flex-row items-center justify-between">
              <Text className={`text-base font-semibold ${tc.text}`}>
                Preenchimento com documentos
              </Text>

              <Pressable onPress={onClose}>
                <Text className={`text-sm ${tc.textSubtle}`}>
                  Cancelar
                </Text>
              </Pressable>
            </View>

            <Text className={`mt-1 text-sm ${tc.textSubtle}`}>
              Use a CNH e o documento do veículo para preencher ou atualizar o cadastro técnico.
            </Text>
          </View>

          {/* CONTEÚDO */}
          <View className="pt-2">
            {/* CARD CNH */}
            <View className={`mb-4 rounded-2xl p-4 ${tc.cardAlt}`}>
              <View className="flex-row items-center mb-3">
                <View className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-400/40 items-center justify-center mr-3">
                  <Ionicons name="id-card-outline" size={20} color="#6ee7b7" />
                </View>
                <View className="flex-1">
                  <Text className={`font-semibold text-base ${tc.text}`}>
                    CNH — dados do condutor
                  </Text>
                  <Text className={`${tc.textMuted} text-xs mt-0.5`}>
                    Leia as informações da CNH para preencher automaticamente nome,
                    CPF, CNH, categoria e validade.
                  </Text>
                </View>
              </View>

              {hasDriver && (
                <Text className="text-emerald-400 text-xs mb-2">
                  Dados de condutor já cadastrados. Você pode atualizar com uma nova leitura.
                </Text>
              )}

              <Pressable
                onPress={applyDriverFromDocument}
                disabled={isApplyingDriver}
                className={`mt-2 rounded-xl py-3 flex-row items-center justify-center gap-2 active:opacity-90 ${
                  isApplyingDriver ? 'bg-slate-800 border border-slate-600' : 'bg-emerald-500 border border-emerald-400'
                }`}
              >
                <Ionicons
                  name="scan-outline"
                  size={18}
                  color={isApplyingDriver ? '#9ca3af' : '#022c22'}
                />
                <Text
                  className="text-sm font-semibold"
                  style={{ color: isApplyingDriver ? '#9ca3af' : '#022c22' }}
                >
                  {isApplyingDriver ? 'Aplicando…' : 'Usar CNH'}
                </Text>
              </Pressable>
            </View>

            {/* CARD VEÍCULO */}
            <View className={`mb-4 rounded-2xl p-4 ${tc.cardAlt}`}>
              <View className="flex-row items-center mb-3">
                <View className="h-10 w-10 rounded-full bg-sky-500/10 border border-sky-400/40 items-center justify-center mr-3">
                  <Ionicons name="car-outline" size={20} color="#0ea5e9" />
                </View>
                <View className="flex-1">
                  <Text className={`font-semibold text-base ${tc.text}`}>
                    Documento do veículo
                  </Text>
                  <Text className={`${tc.textMuted} text-xs mt-0.5`}>
                    Use o CRLV/CRV para preencher placa, RENAVAM, marca, modelo,
                    município, UF e CPF do proprietário.
                  </Text>
                </View>
              </View>

              {hasVehicle && (
                <Text className="text-emerald-400 text-xs mb-2">
                  Dados de veículo já cadastrados. Você pode atualizar com uma nova leitura.
                </Text>
              )}

              <Pressable
                onPress={applyVehicleFromDocument}
                disabled={isApplyingVehicle}
                className={`mt-2 rounded-xl py-3 flex-row items-center justify-center gap-2 active:opacity-90 ${
                  isApplyingVehicle ? 'bg-slate-800 border border-slate-600' : 'bg-sky-500 border border-sky-400'
                }`}
              >
                <Ionicons
                  name="scan-outline"
                  size={18}
                  color={isApplyingVehicle ? '#9ca3af' : '#0f172a'}
                />
                <Text
                  className="text-sm font-semibold"
                  style={{ color: isApplyingVehicle ? '#9ca3af' : '#0f172a' }}
                >
                  {isApplyingVehicle ? 'Aplicando…' : 'Usar doc. do veículo'}
                </Text>
              </Pressable>
            </View>

            {/* INFO SOBRE MULTA (futuro) */}
            <View className="mt-2 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
              <View className="flex-row items-center mb-1.5">
                <Ionicons name="information-circle-outline" size={16} color="#f59e0b" />
                <Text className="text-amber-600 text-xs font-semibold ml-2">
                  Leitura da multa
                </Text>
              </View>
              <Text className="text-amber-700/90 text-xs leading-relaxed">
                A raspagem automática dos dados da multa (AIT/RENAINF) será adicionada em
                uma próxima versão. Por enquanto, você pode informar a multa normalmente
                pela tela de Análise na aba Início.
              </Text>
            </View>

            {feedback && (
              <View className="mt-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 px-3 py-2">
                <Text className="text-emerald-300 text-xs">{feedback}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

