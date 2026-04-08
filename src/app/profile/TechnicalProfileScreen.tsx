import {
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import {
  useTechnicalProfile,
  TechnicalProfile,
} from '../../context/TechnicalProfileContext';
import { useThemeClasses } from '../../context/ThemeContext';
import TouchableScale from '../../components/ui/TouchableScale';

import DriverForm, { DriverData } from './DriverForm';
import VehicleForm, { VehicleData } from './VehicleForm';
import { onlyNumbers } from './masks';
import { SAMPLE_DRIVER, SAMPLE_VEHICLE } from '../../data/profile/sampleProfiles';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.9;

type Step = 'driver' | 'vehicle';

const EMPTY_DRIVER: DriverData = {
  fullName: '',
  cpf: '',
  cnhNumber: '',
  cnhCategory: '',
  cnhExpiry: '',
  cnhIssuerUF: '',
};

const EMPTY_VEHICLE: VehicleData = {
  plate: '',
  renavam: '',
  brand: '',
  model: '',
  city: '',
  uf: '',
  color: '',
  ownerCpf: '',
};

/** Em desenvolvimento: formulário inicia preenchido com dados de teste. */
const INITIAL_DRIVER: DriverData = __DEV__ ? { ...SAMPLE_DRIVER } : EMPTY_DRIVER;
const INITIAL_VEHICLE: VehicleData = __DEV__ ? { ...SAMPLE_VEHICLE } : EMPTY_VEHICLE;

export default function TechnicalProfileScreen() {
  const router = useRouter();
  const { profile, saveProfile } = useTechnicalProfile();
  const tc = useThemeClasses();

  const [step, setStep] = useState<Step>('driver');

  const [driver, setDriver] = useState<DriverData>(
    profile
      ? {
          fullName: profile.driver.fullName,
          cpf: profile.driver.cpf,
          cnhNumber: profile.driver.cnhNumber,
          cnhCategory: profile.driver.cnhCategory,
          cnhExpiry: profile.driver.cnhExpiry,
          cnhIssuerUF: profile.driver.cnhIssuerUF,
        }
      : INITIAL_DRIVER,
  );
  const [vehicle, setVehicle] = useState<VehicleData>(
    profile
      ? {
          plate: profile.vehicle.plate,
          renavam: profile.vehicle.renavam,
          brand: profile.vehicle.brand,
          model: profile.vehicle.model,
          city: profile.vehicle.city,
          uf: profile.vehicle.uf,
          color: profile.vehicle.color,
          ownerCpf: profile.vehicle.ownerCpf,
        }
      : INITIAL_VEHICLE,
  );

  /* =======================
     VALIDAÇÃO MÍNIMA
     ======================= */

  const isDriverValid =
    driver.fullName.trim().length >= 5 &&
    onlyNumbers(driver.cpf).length === 11 &&
    driver.cnhNumber.trim().length >= 5 &&
    driver.cnhCategory.trim().length > 0 &&
    driver.cnhExpiry.length === 10 &&
    driver.cnhIssuerUF.length === 2;

  const isVehicleValid =
    vehicle.plate.length === 7 &&
    onlyNumbers(vehicle.renavam).length >= 9 &&
    onlyNumbers(vehicle.renavam).length <= 11 &&
    vehicle.brand.trim().length >= 2 &&
    vehicle.model.trim().length >= 2 &&
    vehicle.city.trim().length >= 2 &&
    vehicle.uf.trim().length === 2;

  const canGoNext = isDriverValid;
  const canSave = isDriverValid && isVehicleValid;

  /* =======================
     AÇÕES
     ======================= */

  async function handleSave() {
    if (!canSave) return;

    const driverCpfDigits = onlyNumbers(driver.cpf);
    const ownerCpfDigits = onlyNumbers(vehicle.ownerCpf);

    // Se já existe um cadastro técnico salvo, o CPF do condutor não pode ser trocado:
    // o aplicativo é destinado ao próprio proprietário do veículo.
    if (profile?.driver?.cpf) {
      const existingCpfDigits = onlyNumbers(profile.driver.cpf);
      if (existingCpfDigits && existingCpfDigits !== driverCpfDigits) {
        Alert.alert(
          'CPF diferente do cadastro atual',
          'Este aplicativo é destinado ao proprietário do veículo. O cadastro técnico já está vinculado a outro CPF de condutor. Para usar um CPF diferente, exclua o cadastro técnico atual e crie um novo.',
        );
        return;
      }
    }

    if (ownerCpfDigits && ownerCpfDigits !== driverCpfDigits) {
      Alert.alert(
        'Veículo em nome de terceiro',
        'Na versão atual do aplicativo (MVP), só é possível cadastrar veículos em nome do próprio condutor. Informe o CPF do condutor como proprietário do veículo. Em versões futuras, casos de veículos em nome de terceiros serão suportados.',
      );
      return;
    }

    const profile: TechnicalProfile = {
      driver,
      vehicle: {
        ...vehicle,
        ownerCpf: driver.cpf,
      },
      createdAt: new Date().toISOString(),
    };

    await saveProfile(profile);
    router.back();
  }

  function handlePrimaryAction() {
    if (step === 'driver') {
      if (!canGoNext) return;
      setStep('vehicle');
      return;
    }

    handleSave();
  }

  function handleBack() {
    if (step === 'vehicle') {
      setStep('driver');
    }
  }

  /* =======================
     RENDER
     ======================= */

  return (
    <View className={`flex-1 ${tc.modalOverlay}`}>
      <StatusBar style={tc.statusBar} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-end"
      >
        <SafeAreaView
          edges={['bottom']}
          className={`flex-1 rounded-t-3xl ${tc.modalBg} ${tc.border}`}
          style={{ maxHeight: SHEET_MAX_HEIGHT }}
        >
          {/* HEADER */}
          <View className={`border-b px-6 pt-4 pb-4 ${tc.borderB}`}>
            <View className={`mb-3 h-1 w-10 self-center rounded-full ${tc.divider}`} />

            <View className="flex-row items-center justify-between">
              <Text className={`text-base font-semibold ${tc.text}`}>
                Cadastro técnico
              </Text>

              <Pressable onPress={() => router.back()}>
                <Text className={`text-sm ${tc.textSubtle}`}>
                  Fechar
                </Text>
              </Pressable>
            </View>

            <Text className={`mt-1 text-sm ${tc.textSubtle}`}>
              Informe os dados conforme constam nos documentos oficiais.
            </Text>
          </View>

          {/* CONTEÚDO */}
          <ScrollView
            className="px-6"
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            {step === 'driver' && (
              <DriverForm data={driver} onChange={setDriver} />
            )}

            {step === 'vehicle' && (
              <VehicleForm data={vehicle} onChange={setVehicle} />
            )}
          </ScrollView>

          {/* FOOTER */}
          <View className={`px-6 py-4 ${tc.borderT}`}>
            <View className="flex-row gap-3">
              {step === 'vehicle' && (
                <TouchableScale onPress={handleBack} style={{ flex: 1 }}>
                  <View
                    className={`flex-row items-center justify-center gap-2 rounded-xl py-4 border ${tc.buttonSecondary}`}
                  >
                    <Ionicons name="arrow-back" size={18} color={tc.iconMuted} />
                    <Text className={`text-sm font-semibold ${tc.buttonSecondaryText}`}>
                      Voltar
                    </Text>
                  </View>
                </TouchableScale>
              )}
              <TouchableScale
                disabled={step === 'driver' ? !canGoNext : !canSave}
                onPress={handlePrimaryAction}
                style={{ flex: 1 }}
              >
                <View
                  className={`rounded-xl py-4 ${
                    (step === 'driver' ? canGoNext : canSave)
                      ? 'bg-amber-400'
                      : tc.buttonDisabled
                  }`}
                >
                  <Text
                    className={`text-center text-sm font-semibold ${
                      (step === 'driver' ? canGoNext : canSave)
                        ? 'text-slate-900'
                        : tc.buttonDisabledText
                    }`}
                  >
                    {step === 'driver'
                      ? 'Continuar para dados do veículo'
                      : 'Salvar cadastro técnico'}
                  </Text>
                </View>
              </TouchableScale>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}
