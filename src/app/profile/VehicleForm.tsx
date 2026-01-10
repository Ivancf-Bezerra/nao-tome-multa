import { Text } from 'react-native';
import { useMemo, useState } from 'react';
import Input from './Input';
import { formatPlate, onlyNumbers } from './masks';

export interface VehicleData {
  plate: string;
  renavam: string;
  model: string;
  city: string;
  uf: string;        // OBRIGATÓRIO
  color: string;   // INFORMATIVO (não técnico)
}

export default function VehicleForm({
  data,
  onChange,
}: {
  data: VehicleData;
  onChange: (data: VehicleData) => void;
}) {
  const [touched, setTouched] = useState<
    Record<keyof VehicleData, boolean>
  >({
    plate: false,
    renavam: false,
    model: false,
    city: false,
    uf: false,
    color: false,
  });

  function touch(field: keyof VehicleData) {
    setTouched((p) => ({ ...p, [field]: true }));
  }

  const errors = useMemo(
    () => ({
      plate:
        touched.plate && data.plate.length !== 7
          ? 'A placa informada não atende ao padrão válido.'
          : undefined,

      renavam:
        touched.renavam &&
        (onlyNumbers(data.renavam).length < 9 ||
          onlyNumbers(data.renavam).length > 11)
          ? 'O RENAVAM deve conter entre 9 e 11 dígitos numéricos.'
          : undefined,

      model:
        touched.model && data.model.trim().length < 2
          ? 'Informe o modelo do veículo.'
          : undefined,

      city:
        touched.city && data.city.trim().length < 2
          ? 'Informe o município de registro.'
          : undefined,

      uf:
        touched.uf && data.uf.trim().length !== 2
          ? 'Informe a UF com duas letras (ex: SP).'
          : undefined,

      // color NÃO bloqueia fluxo
      color:
        touched.color && data.color && data.color.trim().length < 2
          ? 'Cor muito curta.'
          : undefined,
    }),
    [data, touched]
  );

  return (
    <>
      <Text className="mt-6 text-sm font-medium text-white">
        Dados do veículo
      </Text>

      <Input
        label="Placa do veículo"
        value={data.plate}
        autoCapitalize="characters"
        onChange={(v) =>
          onChange({ ...data, plate: formatPlate(v) })
        }
        helperText="Identificação principal do veículo nos sistemas oficiais."
        errorText={errors.plate}
        onBlur={() => touch('plate')}
      />

      <Input
        label="Número do RENAVAM"
        value={data.renavam}
        keyboardType="numeric"
        onChange={(v) =>
          onChange({ ...data, renavam: onlyNumbers(v) })
        }
        helperText="Registro para consolidação administrativa do veículo."
        errorText={errors.renavam}
        onBlur={() => touch('renavam')}
      />

      <Input
        label="Modelo do veículo"
        value={data.model}
        onChange={(v) =>
          onChange({ ...data, model: v })
        }
        helperText="Modelo conforme cadastro no órgão de trânsito."
        errorText={errors.model}
        onBlur={() => touch('model')}
      />

      <Input
        label="Município de registro"
        value={data.city}
        autoCapitalize="words"
        onChange={(v) =>
          onChange({ ...data, city: v })
        }
        helperText="Município onde o veículo está formalmente registrado."
        errorText={errors.city}
        onBlur={() => touch('city')}
      />

      <Input
        label="UF de registro"
        value={data.uf}
        autoCapitalize="characters"
        maxLength={2}
        onChange={(v) =>
          onChange({ ...data, uf: v.toUpperCase() })
        }
        helperText="Estado de registro do veículo (exigido para consulta oficial)."
        errorText={errors.uf}
        onBlur={() => touch('uf')}
      />

      <Input
        label="Cor do veículo (opcional)"
        value={data.color ?? ''}
        onChange={(v) =>
          onChange({ ...data, color: v })
        }
        helperText="Informação descritiva, conforme CRLV. Não utilizada na consulta."
        errorText={errors.color}
        onBlur={() => touch('color')}
      />
    </>
  );
}
