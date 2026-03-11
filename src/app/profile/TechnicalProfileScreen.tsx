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
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import {
  useTechnicalProfile,
  TechnicalProfile,
} from '../../context/TechnicalProfileContext';

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

  /* =======================
     RENDER
     ======================= */

  return (
    <View className="flex-1 bg-black/50">
      <StatusBar style="light" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-end"
      >
        <SafeAreaView
          edges={['bottom']}
          className="flex-1 rounded-t-3xl bg-slate-900"
          style={{ maxHeight: SHEET_MAX_HEIGHT }}
        >
          {/* HEADER */}
          <View className="border-b border-slate-800 px-6 pt-4 pb-4">
            <View className="mb-3 h-1 w-10 self-center rounded-full bg-slate-600" />

            <View className="flex-row items-center justify-between">
              <Text className="text-base font-semibold text-white">
                Cadastro técnico
              </Text>

              <Pressable onPress={() => router.back()}>
                <Text className="text-sm text-slate-500">
                  Fechar
                </Text>
              </Pressable>
            </View>

            <Text className="mt-1 text-sm text-slate-500">
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
          <View className="border-t border-slate-800 px-6 py-4">
            <Pressable
              disabled={step === 'driver' ? !canGoNext : !canSave}
              onPress={handlePrimaryAction}
              className={`rounded-xl py-4 ${
                (step === 'driver' ? canGoNext : canSave)
                  ? 'bg-amber-400'
                  : 'bg-slate-800'
              }`}
            >
              <Text
                className={`text-center text-sm font-semibold ${
                  (step === 'driver' ? canGoNext : canSave)
                    ? 'text-slate-900'
                    : 'text-slate-500'
                }`}
              >
                {step === 'driver'
                  ? 'Continuar para dados do veículo'
                  : 'Salvar cadastro técnico'}
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}
