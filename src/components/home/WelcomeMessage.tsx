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
        Organização técnica de autuações
      </Text>

      <Text className="mt-2 text-sm leading-relaxed text-slate-400">
        Este aplicativo foi desenvolvido para auxiliar na organização
        e verificação técnica de informações relacionadas a autos de
        infração de trânsito, com base em dados objetivos e registros
        oficiais.
      </Text>

    </View>
  );
}
