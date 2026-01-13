import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TechnicalProfileCardProps {
  onPress: () => void;
}

export default function TechnicalProfileCard({
  onPress,
}: TechnicalProfileCardProps) {
  return (
    <View className="mt-4 rounded-2xl border border-slate-700 bg-slate-800 px-6 py-6">
      <View className="flex-row items-center gap-3">
        <Ionicons
          name="id-card-outline"
          size={20}
          color="#94a3b8"
        />
        <Text className="text-base font-medium text-white">
          Cadastro técnico necessário
        </Text>
      </View>

      <Text className="mt-4 text-sm leading-relaxed text-slate-400">
        Para iniciar qualquer verificação técnica de
        autuações de trânsito, é necessário cadastrar
        previamente os dados do condutor e do veículo.
      </Text>

      <View className="mt-4">
        <Text className="text-sm text-slate-500">
          • Dados do condutor
        </Text>
        <Text className="text-sm text-slate-500">
          • Dados do veículo
        </Text>
        <Text className="text-sm text-slate-500">
          • Uso exclusivo para comparação técnica
        </Text>
      </View>

      <Pressable
        onPress={onPress}
        className="mt-6 rounded-xl bg-amber-400 px-5 py-4 active:opacity-90"
      >
        <Text className="text-center text-sm font-semibold text-slate-900">
          Cadastrar dados técnicos
        </Text>
      </Pressable>
    </View>
  );
}
