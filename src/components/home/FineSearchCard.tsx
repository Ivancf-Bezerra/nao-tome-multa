import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import CardContainer from '../ui/CardContainer';
import { useTechnicalProfile } from '../../context/TechnicalProfileContext';
import { useInfractionSearch } from '../../services/infractions/useInfractionSearch';

export default function FineSearchCard() {
  const { profile } = useTechnicalProfile();
  const { state, search } = useInfractionSearch();

  const hasProfile = Boolean(profile);

  return (
    <CardContainer>
      {/* HEADER */}
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-sm font-semibold text-white">
            Pesquisa de multas
          </Text>
          <Text className="text-xs text-slate-500">
            Consulta técnica via bases oficiais
          </Text>
        </View>

        <Ionicons
          name="shield-sharp"
          size={20}
          color={
            state.status === 'loading'
              ? '#64748b'
              : '#fbbf24'
          }
        />
      </View>

      {/* ESTADOS */}
      {state.status === 'idle' && (
        <Text className="text-sm text-slate-400">
          Inicie a varredura técnica utilizando os dados
          do cadastro para consultar possíveis infrações.
        </Text>
      )}

      {state.status === 'loading' && (
        <View className="mt-3 flex-row items-center gap-3">
          <ActivityIndicator size="small" color="#94a3b8" />
          <Text className="text-sm text-slate-400">
            Buscando infrações na base nacional…
          </Text>
        </View>
      )}

      {state.status === 'success' && state.data && (
        <Text className="mt-3 text-sm text-slate-400">
          {state.data.infractions.length === 0
            ? 'Nenhuma infração pendente foi identificada.'
            : `${state.data.infractions.length} infrações identificadas para análise.`}
        </Text>
      )}

      {state.status === 'error' && (
        <Text className="mt-3 text-sm text-red-400">
          {state.error}
        </Text>
      )}

      {/* CTA */}
      <Pressable
        disabled={!hasProfile || state.status === 'loading'}
        onPress={() =>
          profile && search(profile.vehicle)
        }
        className={`mt-4 flex-row items-center justify-center rounded-xl py-4 ${
          hasProfile && state.status !== 'loading'
            ? 'bg-amber-400'
            : 'bg-slate-800'
        }`}
      >
        {state.status === 'loading' ? (
          <>
            <ActivityIndicator size="small" color="#94a3b8" />
            <Text className="ml-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Consultando base nacional…
            </Text>
          </>
        ) : (
          <Text className="text-xs font-semibold uppercase tracking-widest text-slate-900">
            Iniciar varredura técnica
          </Text>
        )}
      </Pressable>

      <Text className="mt-4 text-center text-[10px] leading-relaxed text-slate-600">
        A consulta utiliza dados oficiais via RENAVAM.
        O tempo de resposta depende da disponibilidade
        dos sistemas governamentais.
      </Text>
    </CardContainer>
  );
}
