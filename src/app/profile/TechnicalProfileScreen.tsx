import {
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';

import {
  useTechnicalProfile,
  TechnicalProfile,
} from '../../context/TechnicalProfileContext';

import DriverForm, { DriverData } from './DriverForm';
import VehicleForm, { VehicleData } from './VehicleForm';
import { onlyNumbers } from './masks';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.9;

type Step = 'driver' | 'vehicle';

export default function TechnicalProfileScreen() {
  const router = useRouter();
  const { saveProfile } = useTechnicalProfile();

  const [step, setStep] = useState<Step>('driver');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  /* =======================
      ESTADO: CONDUTOR
     ======================= */

  const [driver, setDriver] = useState<DriverData>({
    fullName: '',
    cpf: '',
    cnhNumber: '',
    cnhCategory: '',
    cnhExpiry: '',
  });

  /* =======================
      ESTADO: VEÍCULO
     ======================= */

  const [vehicle, setVehicle] = useState<VehicleData>({
    plate: '',
    renavam: '',
    model: '',
    city: '',
    uf: '',
    color: '',
  });

  /* =======================
      VALIDAÇÃO GLOBAL
     ======================= */

  const isDriverValid =
    driver.fullName.trim().length >= 5 &&
    onlyNumbers(driver.cpf).length === 11 &&
    driver.cnhNumber.trim().length >= 5 &&
    driver.cnhCategory.trim().length > 0 &&
    driver.cnhExpiry.length === 10;

  const isVehicleValid =
    vehicle.plate.length === 7 &&
    onlyNumbers(vehicle.renavam).length >= 9 &&
    onlyNumbers(vehicle.renavam).length <= 11 &&
    vehicle.model.trim().length >= 2 &&
    vehicle.city.trim().length >= 2 &&
    vehicle.uf.trim().length === 2; // CAMPO SOBERANO

  const canGoNext = isDriverValid;
  const canSave = isDriverValid && isVehicleValid;

  /* =======================
      AÇÕES
     ======================= */

  async function handleSave() {
    if (!canSave) return;

    const profile: TechnicalProfile = {
      driver,
      vehicle,
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
              Informe os dados necessários para viabilizar análises e comparações técnicas.
            </Text>
          </View>

          {/* CONTEÚDO */}
          <Animated.View style={{ opacity: fadeAnim }} className="flex-1">
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
          </Animated.View>

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
