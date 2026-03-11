import { View, Text } from 'react-native';
import Input from './Input';

export interface VehicleFipeData {
  brand: string;
  model: string;
}

export default function VehicleFipeSelector({
  value,
  onChange,
}: {
  value: VehicleFipeData;
  onChange: (v: VehicleFipeData) => void;
}) {
  return (
    <View className="gap-4">
      <Text className="text-base font-semibold text-white">
        Identificação do veículo
      </Text>

      <Input
        label="Marca do veículo"
        value={value.brand}
        placeholder="Ex: HONDA"
        autoCapitalize="characters"
        onChange={(v) => onChange({ brand: v.toUpperCase(), model: value.model })}
        helperText="Informe a marca conforme consta no documento do veículo."
      />

      <Input
        label="Modelo do veículo"
        value={value.model}
        placeholder="Ex: CIVIC"
        autoCapitalize="characters"
        onChange={(v) => onChange({ brand: value.brand, model: v.toUpperCase() })}
        helperText="Informe o modelo conforme consta no CRLV."
      />
    </View>
  );
}
