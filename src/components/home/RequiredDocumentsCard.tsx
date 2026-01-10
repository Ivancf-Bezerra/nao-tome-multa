import { View, Text, Pressable } from 'react-native';

import CardContainer from '../ui/CardContainer';
import CardHeader from '../ui/CardHeader';

interface RequiredDocumentsCardProps {
  status: 'pending' | 'processing' | 'completed' | null;
  result: 'regular' | 'inconsistent' | null;
  enabled: boolean;
  onGenerateDefense: () => void;
}

export default function RequiredDocumentsCard({
  status,
  result,
  enabled,
  onGenerateDefense,
}: RequiredDocumentsCardProps) {
  if (status !== 'completed') {
    return (
      <CardContainer>
        <Text className="text-sm font-medium text-slate-400">
          Preparação para defesa administrativa
        </Text>

        <Text className="mt-2 text-sm text-slate-500">
          Etapas do processo:
        </Text>

        <View className="mt-2 space-y-1">
          <Text className="text-sm text-slate-500">
            1. Upload do auto de infração.
          </Text>
          <Text className="text-sm text-slate-500">
            2. Análise técnica dos requisitos formais.
          </Text>
          <Text className="text-sm text-slate-500">
            3. Consolidação das informações relevantes.
          </Text>
          <Text className="text-sm text-slate-500">
            4. Geração do rascunho de defesa.
          </Text>
        </View>
      </CardContainer>
    );
  }

  return (
    <CardContainer>
      <CardHeader
        title="Preparação para defesa administrativa"
        icon="document-text-outline"
        variant="default"
      />

      {!enabled && (
        <Text className="mt-3 text-sm text-slate-400">
          As inconsistências identificadas estão sendo organizadas
          para a geração do rascunho de defesa.
        </Text>
      )}

      <View className="mt-4">
        {enabled ? (
          <Pressable
            onPress={onGenerateDefense}
            className="rounded-lg bg-amber-400 px-4 py-3 active:opacity-90"
          >
            <Text className="text-center text-sm font-semibold text-slate-900">
              Gerar rascunho de defesa
            </Text>
          </Pressable>
        ) : (
          <View className="rounded-lg border border-slate-800 px-4 py-3">
            <Text className="text-center text-sm text-slate-500">
              Geração de defesa indisponível no momento
            </Text>
          </View>
        )}
      </View>
    </CardContainer>
  );
}
