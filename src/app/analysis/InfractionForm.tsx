import { View, Text } from 'react-native';
import Input from '../profile/Input';
import { InfractionInput } from '../../services/infractions/types';
import { formatDate } from '../profile/masks';

export type InfractionFormData = InfractionInput;

interface Props {
  data: InfractionFormData;
  onChange: (v: InfractionFormData) => void;
}

function Section({ title }: { title: string }) {
  return (
    <View className="mt-6 mb-2">
      <Text className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
        {title}
      </Text>
    </View>
  );
}

export default function InfractionForm({ data, onChange }: Props) {
  function update(partial: Partial<InfractionFormData>) {
    onChange({ ...data, ...partial });
  }

  return (
    <View>
      {/* ─── IDENTIFICAÇÃO ─── */}
      <Section title="Identificação" />

      <Input
        label="Número do AIT"
        value={data.aitNumber}
        placeholder="Ex: 12345678"
        keyboardType="default"
        onChange={(v) => update({ aitNumber: v })}
        helperText="Número do Auto de Infração de Trânsito conforme notificação."
      />

      <Input
        label="Número RENAINF"
        value={data.renainf}
        placeholder="Ex: 987654321"
        keyboardType="numeric"
        onChange={(v) => update({ renainf: v })}
        helperText="Registro Nacional de Infrações — constante na notificação."
      />

      <Input
        label="Código da infração (CTB)"
        value={data.infractionCode}
        placeholder="Ex: 74550"
        keyboardType="numeric"
        onChange={(v) => update({ infractionCode: v })}
        helperText="Código de enquadramento conforme o CTB."
      />

      <Input
        label="Descrição da infração"
        value={data.description}
        placeholder="Ex: Excesso de velocidade"
        multiline
        onChange={(v) => update({ description: v })}
        helperText="Descrição conforme consta na notificação oficial."
      />

      {/* ─── ÓRGÃOS ─── */}
      <Section title="Órgãos" />

      <Input
        label="Código do órgão autuador"
        value={data.issuingBodyCode}
        placeholder="Ex: 0001"
        keyboardType="numeric"
        onChange={(v) => update({ issuingBodyCode: v })}
      />

      <Input
        label="Órgão autuador"
        value={data.issuingBody}
        placeholder="Ex: DETRAN-SP"
        autoCapitalize="characters"
        onChange={(v) => update({ issuingBody: v.toUpperCase() })}
      />

      <Input
        label="Código do órgão competente"
        value={data.competentBodyCode}
        placeholder="Ex: 0002"
        keyboardType="numeric"
        onChange={(v) => update({ competentBodyCode: v })}
      />

      <Input
        label="Órgão competente"
        value={data.competentBody}
        placeholder="Ex: DETRAN-SP"
        autoCapitalize="characters"
        onChange={(v) => update({ competentBody: v.toUpperCase() })}
      />

      {/* ─── AGENTE E EQUIPAMENTO ─── */}
      <Section title="Agente e Equipamento" />

      <Input
        label="Identificação do agente"
        value={data.agentId}
        placeholder="Ex: Funcional 12345"
        onChange={(v) => update({ agentId: v })}
        helperText="Matrícula ou identificação funcional do agente autuador."
      />

      <Input
        label="Número do equipamento"
        value={data.equipmentId}
        placeholder="Ex: RADAR-001"
        onChange={(v) => update({ equipmentId: v })}
        helperText="Identificação do radar ou instrumento de medição."
      />

      <Input
        label="Data da última aferição"
        value={data.equipmentCalibrationDate}
        placeholder="DD/MM/AAAA"
        keyboardType="numeric"
        onChange={(v) => update({ equipmentCalibrationDate: formatDate(v) })}
        helperText="Data da última calibração do equipamento pelo INMETRO."
      />

      {/* ─── DADOS DA INFRAÇÃO ─── */}
      <Section title="Dados da Infração" />

      <Input
        label="Data da infração"
        value={data.infractionDate}
        placeholder="DD/MM/AAAA"
        keyboardType="numeric"
        onChange={(v) => update({ infractionDate: formatDate(v) })}
        helperText="Data em que a infração foi registrada."
      />

      <Input
        label="Observações (opcional)"
        value={data.notes}
        placeholder="Informações adicionais relevantes"
        multiline
        onChange={(v) => update({ notes: v })}
      />
    </View>
  );
}
