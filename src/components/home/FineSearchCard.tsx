import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import CardContainer from '../ui/CardContainer';
import {
  useTechnicalProfile,
  VehicleProfile,
} from '../../context/TechnicalProfileContext';
import { useInfractionSearch } from '../../services/infractions/useInfractionSearch';

function isValidVehicle(
  vehicle: VehicleProfile | null
): vehicle is VehicleProfile {
  return (
    vehicle !== null &&
    vehicle.plate.length === 7 &&
    vehicle.renavam.length >= 9 &&
    vehicle.uf.length === 2
  );
}

export default function FineSearchCard() {
  const { profile } = useTechnicalProfile();
  const { state, search } = useInfractionSearch();

  const vehicle = profile?.vehicle ?? null;
  const hasValidVehicle = isValidVehicle(vehicle);

  function handleSearch() {
    if (!isValidVehicle(vehicle)) return;

    const { plate, renavam, uf } = vehicle;

    search({
      plate,
      renavam,
      uf,
    });
  }

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

      {/* WARN DE DADOS INCOERENTES */}
      {vehicle && !hasValidVehicle && state.status !== 'loading' && (
        <View className="mt-4 rounded-lg bg-amber-500/10 px-3 py-2">
          <Text className="text-xs text-amber-300 leading-relaxed">
            Existem dados incompletos ou inconsistentes no cadastro técnico.
            Revise as informações para habilitar a consulta.
          </Text>
        </View>
      )}

      {/* CTA */}
      <Pressable
        disabled={!hasValidVehicle || state.status === 'loading'}
        onPress={handleSearch}
        className={`mt-4 flex-row items-center justify-center rounded-xl py-4 ${
          hasValidVehicle && state.status !== 'loading'
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
