import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useThemeClasses } from '../../context/ThemeContext';

interface TechnicalProfileCardProps {
  onPress: () => void;
}

export default function TechnicalProfileCard({
  onPress,
}: TechnicalProfileCardProps) {
  const tc = useThemeClasses();

  return (
    <View className={`mt-4 rounded-2xl px-6 py-6 ${tc.card}`}>
      <View className="flex-row items-center gap-3">
        <Ionicons
          name="id-card-outline"
          size={20}
          color={tc.iconMuted}
        />
        <Text className={`text-base font-medium ${tc.text}`}>
          Cadastro técnico necessário
        </Text>
      </View>

      <Text className={`mt-4 text-sm leading-relaxed ${tc.textMuted}`}>
        Para iniciar qualquer verificação técnica de
        autuações de trânsito, é necessário cadastrar
        previamente os dados do condutor e do veículo.
      </Text>

      <View className="mt-4">
        <Text className={`text-sm ${tc.textSubtle}`}>
          • Dados do condutor
        </Text>
        <Text className={`text-sm ${tc.textSubtle}`}>
          • Dados do veículo
        </Text>
        <Text className={`text-sm ${tc.textSubtle}`}>
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
