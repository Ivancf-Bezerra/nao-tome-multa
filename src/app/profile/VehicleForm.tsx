import { View } from 'react-native';
import { useState } from 'react';

import Input from './Input';
import VehicleFipeSelector, {
  VehicleFipeData,
} from './VehicleFipeSelector';

import { formatCPF, formatPlate, onlyNumbers } from './masks';

/* =======================
   TIPOS
======================= */

export interface VehicleData extends VehicleFipeData {
  plate: string;
  renavam: string;
  city: string;
  uf: string;
  color: string;
  ownerCpf: string;
}

/**
 * ⚠️ MOCK APENAS PARA TESTES DE DESENVOLVIMENTO
 */
const MOCK_VEHICLE: VehicleData = {
  plate: 'ABC1D23',
  renavam: '12345678910',
  brand: 'HONDA',
  model: 'CIVIC',
  city: 'SÃO PAULO',
  uf: 'SP',
  color: 'PRATA',
  ownerCpf: '',
};

/* =======================
   COMPONENTE
======================= */

export default function VehicleForm({
  data = MOCK_VEHICLE,
  onChange,
}: {
  data?: VehicleData;
  onChange: (v: VehicleData) => void;
}) {
  const [vehicle, setVehicle] = useState<VehicleData>(data);

  function update(partial: Partial<VehicleData>) {
    const next = { ...vehicle, ...partial };
    setVehicle(next);
    onChange(next);
  }

  return (
    <View className="mt-6 gap-6">
      {/* IDENTIFICAÇÃO DO VEÍCULO (FIPE) */}
      <VehicleFipeSelector
        value={{
          brand: vehicle.brand,
          model: vehicle.model,
        }}
        onChange={(v) => update(v)}
      />

      {/* PLACA */}
      <Input
        label="Placa do veículo"
        value={vehicle.plate}
        autoCapitalize="characters"
        maxLength={7}
        onChange={(v) =>
          update({ plate: formatPlate(v) })
        }
      />

      {/* RENAVAM */}
      <Input
        label="Número do RENAVAM"
        value={vehicle.renavam}
        keyboardType="numeric"
        maxLength={11}
        onChange={(v) =>
          update({ renavam: onlyNumbers(v) })
        }
      />

      {/* MUNICÍPIO */}
      <Input
        label="Município de registro"
        value={vehicle.city}
        onChange={(v) => update({ city: v })}
      />

      {/* UF */}
      <Input
        label="UF de registro"
        value={vehicle.uf}
        autoCapitalize="characters"
        maxLength={2}
        onChange={(v) =>
          update({ uf: v.toUpperCase() })
        }
      />

      {/* COR */}
      <Input
        label="Cor do veículo"
        value={vehicle.color}
        onChange={(v) => update({ color: v })}
      />

      {/* PROPRIETÁRIO */}
      <Input
        label="CPF do proprietário (opcional)"
        value={vehicle.ownerCpf}
        keyboardType="numeric"
        onChange={(v) =>
          update({ ownerCpf: formatCPF(v) })
        }
      />
    </View>
  );
}
