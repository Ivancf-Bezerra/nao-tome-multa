import { Text } from 'react-native';
import { useMemo, useState } from 'react';
import Input from './Input';
import { formatCPF, formatDate, onlyNumbers } from './masks';

export interface DriverData {
  fullName: string;
  cpf: string;
  cnhNumber: string;
  cnhCategory: string;
  cnhExpiry: string;
}

const VALID_CNH_CATEGORIES = ['A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE'];

export default function DriverForm({
  data,
  onChange,
}: {
  data: DriverData;
  onChange: (data: DriverData) => void;
}) {
  const [touched, setTouched] = useState<Record<keyof DriverData, boolean>>({
    fullName: false,
    cpf: false,
    cnhNumber: false,
    cnhCategory: false,
    cnhExpiry: false,
  });

  function touch(field: keyof DriverData) {
    setTouched((p) => ({ ...p, [field]: true }));
  }

  const errors = useMemo(() => {
    const [day, month] = data.cnhExpiry.split('/').map(Number);

    return {
      fullName:
        touched.fullName && data.fullName.trim().length < 5
          ? 'O nome informado não corresponde a um nome completo válido.'
          : undefined,

      cpf:
        touched.cpf && onlyNumbers(data.cpf).length !== 11
          ? 'O CPF deve conter 11 dígitos numéricos válidos.'
          : undefined,

      cnhNumber:
        touched.cnhNumber && data.cnhNumber.trim().length < 5
          ? 'Número de CNH inválido ou incompleto.'
          : undefined,

      cnhCategory:
        touched.cnhCategory &&
        !VALID_CNH_CATEGORIES.includes(data.cnhCategory)
          ? 'Informe uma categoria válida de habilitação.'
          : undefined,

      cnhExpiry:
        touched.cnhExpiry &&
        (data.cnhExpiry.length !== 10 ||
          !day ||
          !month ||
          day > 31 ||
          month > 12)
          ? 'A data informada não é válida.'
          : undefined,
    };
  }, [data, touched]);

  return (
    <>
      <Text className="mt-6 text-sm font-medium text-white">
        Dados do condutor
      </Text>

      <Input
        label="Nome completo do condutor"
        value={data.fullName}
        autoCapitalize="words"
        onChange={(v) =>
          onChange({ ...data, fullName: v })
        }
        helperText="Utilize o nome exatamente como consta na habilitação. Diferenças de grafia podem afetar comparações futuras."
        errorText={errors.fullName}
        onBlur={() => touch('fullName')}
      />

      <Input
        label="CPF do condutor"
        value={data.cpf}
        keyboardType="numeric"
        onChange={(v) =>
          onChange({ ...data, cpf: formatCPF(v) })
        }
        helperText="Identificador fiscal utilizado para vincular registros administrativos ao condutor."
        errorText={errors.cpf}
        onBlur={() => touch('cpf')}
      />

      <Input
        label="Número de registro da CNH"
        value={data.cnhNumber}
        keyboardType="numeric"
        onChange={(v) =>
          onChange({ ...data, cnhNumber: onlyNumbers(v) })
        }
        helperText="Número único de identificação da habilitação emitida pelo órgão de trânsito."
        errorText={errors.cnhNumber}
        onBlur={() => touch('cnhNumber')}
      />

      <Input
        label="Categoria da habilitação"
        value={data.cnhCategory}
        autoCapitalize="characters"
        onChange={(v) =>
          onChange({ ...data, cnhCategory: v.toUpperCase() })
        }
        helperText="Categoria válida no momento do cadastro."
        errorText={errors.cnhCategory}
        onBlur={() => touch('cnhCategory')}
      />

      <Input
        label="Data de validade da habilitação"
        value={data.cnhExpiry}
        keyboardType="numeric"
        placeholder="DD/MM/AAAA"
        onChange={(v) =>
          onChange({ ...data, cnhExpiry: formatDate(v) })
        }
        helperText="Data final de vigência da CNH conforme documento emitido."
        errorText={errors.cnhExpiry}
        onBlur={() => touch('cnhExpiry')}
      />
    </>
  );
}
