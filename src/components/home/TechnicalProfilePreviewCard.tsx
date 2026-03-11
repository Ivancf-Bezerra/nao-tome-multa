import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { useTechnicalProfile } from '../../context/TechnicalProfileContext';
import { useThemeClasses } from '../../context/ThemeContext';
import CardContainer from '../ui/CardContainer';

interface TechnicalProfilePreviewCardProps {
  onDeleteProfile: () => void;
}

export default function TechnicalProfilePreviewCard({
  onDeleteProfile,
}: TechnicalProfilePreviewCardProps) {
  const router = useRouter();
  const { profile } = useTechnicalProfile();

  if (!profile) return null;

  const tc = useThemeClasses();

  return (
    <CardContainer>
      {/* HEADER */}
      <View className={`flex-row items-center justify-between mb-4 pb-3 ${tc.borderB}`}>
        <View className="flex-row items-center gap-2">
          <Ionicons name="shield-checkmark-outline" size={14} color="#f59e0b" />
          <Text className={`text-[10px] font-bold uppercase tracking-widest ${tc.textSubtle}`}>
            Identidade Técnica
          </Text>
        </View>

        {/* AÇÕES */}
        <View className="flex-row items-center gap-2 -mr-2">
          {/* EDITAR */}
          <Pressable
            onPress={() => router.push('/profile/TechnicalProfileScreen')}
            className="flex-row items-center gap-1 active:opacity-60 px-2 py-1"
            hitSlop={10}
          >
            <Text className="text-[10px] font-medium text-amber-500 uppercase">
              Editar
            </Text>
            <Ionicons name="pencil-sharp" size={10} color="#fbbf24" />
          </Pressable>

          {/* EXCLUIR (sem Alert aqui) */}
          <Pressable
            onPress={onDeleteProfile}
            className="active:opacity-60 px-2 py-1 rounded-md border border-red-500/30 bg-red-500/10"
            accessibilityLabel="Excluir cadastro técnico"
            accessibilityRole="button"
            hitSlop={12}
          >
            <Ionicons name="trash-outline" size={12} color="#f87171" />
          </Pressable>
        </View>
      </View>

      {/* BLOCO 1: CONDUTOR */}
      <View className="mb-4 pl-1">
        <View className="flex-row justify-between items-start">
          <View className="flex-1 mr-4">
            <Text className="text-[9px] font-bold uppercase text-slate-500 mb-2">
              Condutor Principal
            </Text>

            <Text
              className="text-lg font-bold text-white leading-tight mb-2"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {profile.driver.fullName}
            </Text>

            <Text className="text-x text-amber-500 font-mono">
              CPF ***.{profile.driver.cpf.slice(3, 6)}.
              {profile.driver.cpf.slice(6, 9)}-**
            </Text>
          </View>

          <View className="items-end">
            <View className={`px-2 py-1 rounded mb-1.5 border ${tc.buttonSecondary}`}>
              <Text className={`text-[10px] font-bold mb-1 ${tc.buttonSecondaryText}`}>
                CNH {profile.driver.cnhCategory}
              </Text>
            </View>

            <Text className={`text-[9px] ${tc.textSubtle}`}>
              Vence em {profile.driver.cnhExpiry}
            </Text>
          </View>
        </View>
      </View>

      {/* BLOCO 2: VEÍCULO */}
      <View className={`rounded-lg p-4 flex-row items-center gap-4 ${tc.cardAlt}`}>
        <View className={`h-10 w-10 items-center justify-center rounded border ${tc.buttonSecondary}`}>
          <Ionicons name="car-sport" size={18} color={tc.iconMuted} />
        </View>

        <View className="flex-1 justify-center">
          <Text
            className={`text-sm font-semibold leading-tight mb-1 ${tc.buttonSecondaryText}`}
            numberOfLines={1}
          >
            {profile.vehicle.model}
          </Text>

          <View className="flex-row items-center gap-2">
            <Text className="text-[10px] text-amber-500/90 font-bold uppercase tracking-wide">
              {profile.vehicle.color || 'COR N/D'}
            </Text>

            <View className={`h-0.5 w-0.5 rounded-full ${tc.divider}`} />

            <Text
              className={`text-[10px] flex-1 ${tc.textSubtle}`}
              numberOfLines={1}
            >
              {profile.vehicle.city}
            </Text>
          </View>
        </View>

        <View className={`border px-3 py-2 rounded ml-1 shadow-sm ${tc.buttonSecondary}`}>
          <Text className="font-mono text-sm font-bold text-amber-500 tracking-[2px]">
            {profile.vehicle.plate}
          </Text>
        </View>
      </View>
    </CardContainer>
  );
}
