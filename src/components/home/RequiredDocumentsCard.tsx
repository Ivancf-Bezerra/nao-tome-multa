import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RequiredDocumentsCard() {
  return (
    <View className="rounded-3xl border border-slate-700 bg-slate-800 px-6 py-6 mb-6">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-white">
          Documentos necessários
        </Text>

        <Ionicons name="document-text-outline" size={20} color="#cbd5f5" />
      </View>

      <View className="mt-4 space-y-2">
        <Text className="text-sm text-slate-400">• Auto de infração</Text>
        <Text className="text-sm text-slate-400">• CRLV do veículo</Text>
        <Text className="text-sm text-slate-400">
          • CNH do condutor (quando aplicável)
        </Text>
      </View>
    </View>
  );
}
