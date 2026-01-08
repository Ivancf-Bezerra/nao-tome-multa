import { View, Text } from 'react-native';
import { useUser } from '@clerk/clerk-expo';

export default function WelcomeMessage() {
  const { user } = useUser();

  const firstName =
    user?.firstName ||
    user?.fullName?.split(' ')[0] ||
    'Usuário';

  return (
    <View className="px-8 pb-6">
      <Text className="text-sm text-slate-400">
        Olá, {firstName}
      </Text>

      <Text className="mt-1 text-lg font-semibold text-white">
        Painel de análise de infrações
      </Text>

<Text className="mt-2 text-sm leading-relaxed text-slate-400">
  Aqui você pode realizar a análise técnica de autos de infração de trânsito,
  organizar as informações do processo e preparar textos administrativos com
  base em critérios objetivos da legislação aplicável.
</Text>

    </View>
  );
}
