import { Text, View } from 'react-native';
import { useMemo, useState } from 'react';
import Input from './Input';
import { formatCPF, formatDate, onlyNumbers } from './masks';

export interface DriverData {
  fullName: string;
  cpf: string;
  cnhNumber: string;
  cnhCategory: string;
  cnhExpiry: string;
  cnhIssuerUF: string;
}

const VALID_CNH_CATEGORIES = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'AB',
  'AC',
  'AD',
  'AE',
] as const;

type CnhCategory = typeof VALID_CNH_CATEGORIES[number];

/**
 * ⚠️ MOCK APENAS PARA TESTES DE DESENVOLVIMENTO
 * Remover ou zerar em produção final.
 */
const MOCK_DRIVER_DATA: DriverData = {
  fullName: 'JOÃO CARLOS DA SILVA',
  cpf: '123.456.789-09',
  cnhNumber: '98765432100',
  cnhCategory: 'B',
  cnhExpiry: '15/08/2027',
  cnhIssuerUF: 'SP',
};

export default function DriverForm({
  data = MOCK_DRIVER_DATA,
  onChange,
}: {
  data?: DriverData;
  onChange: (data: DriverData) => void;
}) {
  const [touched, setTouched] = useState<Record<keyof DriverData, boolean>>({
    fullName: false,
    cpf: false,
    cnhNumber: false,
    cnhCategory: false,
    cnhExpiry: false,
    cnhIssuerUF: false,
  });

  function touch(field: keyof DriverData) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  const errors = useMemo(() => {
    const [day, month] = data.cnhExpiry.split('/').map(Number);

    return {
      fullName:
        touched.fullName && data.fullName.trim().length < 5
          ? 'Informe o nome completo conforme consta na habilitação.'
          : undefined,

      cpf:
        touched.cpf && onlyNumbers(data.cpf).length !== 11
          ? 'O CPF deve conter 11 dígitos numéricos.'
          : undefined,

      cnhNumber:
        touched.cnhNumber && data.cnhNumber.trim().length < 5
          ? 'Número de CNH inválido ou incompleto.'
          : undefined,

      cnhCategory:
        touched.cnhCategory &&
        !VALID_CNH_CATEGORIES.includes(data.cnhCategory as CnhCategory)
          ? 'Selecione uma categoria válida.'
          : undefined,

      cnhExpiry:
        touched.cnhExpiry &&
        (data.cnhExpiry.length !== 10 ||
          !day ||
          !month ||
          day > 31 ||
          month > 12)
          ? 'Data de validade inválida.'
          : undefined,

      cnhIssuerUF:
        touched.cnhIssuerUF && data.cnhIssuerUF.length !== 2
          ? 'Informe a UF do órgão emissor.'
          : undefined,
    };
  }, [data, touched]);

  return (
    <View className="mt-6 gap-4">
      {/* Header institucional */}
      <View className="gap-1">
        <Text className="text-base font-semibold text-white">
          Dados do condutor
        </Text>
        <Text className="text-xs text-neutral-400">
          Informações utilizadas para identificação administrativa do condutor.
        </Text>
      </View>

      <Input
        label="Nome completo do condutor"
        placeholder="Ex: João Carlos da Silva"
        value={data.fullName}
        autoCapitalize="words"
        onChange={(v) =>
          onChange({ ...data, fullName: v })
        }
        helperText="Utilize o nome conforme consta na CNH."
        errorText={errors.fullName}
        onBlur={() => touch('fullName')}
      />

      <Input
        label="CPF do condutor"
        placeholder="000.000.000-00"
        value={data.cpf}
        keyboardType="numeric"
        onChange={(v) =>
          onChange({ ...data, cpf: formatCPF(v) })
        }
        helperText="Identificador fiscal do condutor."
        errorText={errors.cpf}
        onBlur={() => touch('cpf')}
      />

      <Input
        label="Número de registro da CNH"
        placeholder="Somente números"
        value={data.cnhNumber}
        keyboardType="numeric"
        onChange={(v) =>
          onChange({
            ...data,
            cnhNumber: onlyNumbers(v),
          })
        }
        helperText="Número presente no documento de habilitação."
        errorText={errors.cnhNumber}
        onBlur={() => touch('cnhNumber')}
      />

      {/* Categoria da CNH */}
      <View className="gap-2">
        <Text className="text-xs font-medium text-neutral-400">
          Categoria da habilitação
        </Text>

        <View className="flex-row flex-wrap gap-2">
          {VALID_CNH_CATEGORIES.map((category) => {
            const selected = data.cnhCategory === category;

            return (
              <Text
                key={category}
                onPress={() => {
                  onChange({ ...data, cnhCategory: category });
                  touch('cnhCategory');
                }}
                className={[
                  'px-3 py-2 rounded-md text-xs text-center',
                  selected
                    ? 'bg-amber-500 text-black'
                    : 'bg-neutral-900 border border-neutral-700 text-neutral-300',
                ].join(' ')}
              >
                {category}
              </Text>
            );
          })}
        </View>

        {errors.cnhCategory && (
          <Text className="text-xs text-red-400">
            {errors.cnhCategory}
          </Text>
        )}
      </View>

      <Input
        label="Validade da habilitação"
        placeholder="DD/MM/AAAA"
        value={data.cnhExpiry}
        keyboardType="numeric"
        onChange={(v) =>
          onChange({
            ...data,
            cnhExpiry: formatDate(v),
          })
        }
        helperText="Data final de vigência conforme o documento."
        errorText={errors.cnhExpiry}
        onBlur={() => touch('cnhExpiry')}
      />

      <Input
        label="UF do órgão emissor da CNH"
        placeholder="Ex: SP"
        value={data.cnhIssuerUF}
        autoCapitalize="characters"
        maxLength={2}
        onChange={(v) =>
          onChange({
            ...data,
            cnhIssuerUF: v.toUpperCase(),
          })
        }
        helperText="Unidade federativa do DETRAN emissor."
        errorText={errors.cnhIssuerUF}
        onBlur={() => touch('cnhIssuerUF')}
      />
    </View>
  );
}
