import { View } from 'react-native';
import Input from '../profile/Input';

export interface InfractionFormData {
  id: string;
  description: string;
  notes: string;
}

interface Props {
  data: InfractionFormData;
  onChange: (v: InfractionFormData) => void;
}

export default function InfractionForm({
  data,
  onChange,
}: Props) {
  return (
    <View className="mt-4">
      <Input
        label="ID da multa"
        value={data.id}
        onChange={(v) =>
          onChange({ ...data, id: v })
        }
        helperText="Identificador informado na notificação."
      />

      <Input
        label="Descrição da infração"
        value={data.description}
        onChange={(v) =>
          onChange({
            ...data,
            description: v,
          })
        }
        helperText="Descreva a infração conforme consta no documento."
        multiline
      />

      <Input
        label="Observações (opcional)"
        value={data.notes}
        onChange={(v) =>
          onChange({ ...data, notes: v })
        }
        multiline
      />
    </View>
  );
}
