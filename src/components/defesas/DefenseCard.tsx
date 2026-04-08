import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

import { useThemeClasses } from '../../context/ThemeContext';
import { AnalyzedInfractionRecord, InconsistencySeverity } from './types';
import TouchableScale from '../ui/TouchableScale';

type Props = {
  record: AnalyzedInfractionRecord;
  onView: () => void;
  onSend: () => void;
  onDelete: () => void;
};

function clampText(text: string, max = 70) {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('pt-BR');
  } catch {
    return iso;
  }
}

function severityColor(s: InconsistencySeverity): string {
  if (s === 'critical') return '#ef4444';
  if (s === 'high') return '#f97316';
  if (s === 'medium') return '#fbbf24';
  return '#94a3b8';
}

export default function DefenseCard({ record, onView, onSend, onDelete }: Props) {
  const tc = useThemeClasses();
  const hasDefense = Boolean(record.defense?.defesaPrevia?.trim());
  const topSeverity = record.result.findings[0]?.severity;

  return (
    <View className={`rounded-2xl p-4 mb-4 ${tc.cardAlt}`}>
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <View className="flex-row items-center">
            <Ionicons
              name="alert-circle"
              size={16}
              color={topSeverity ? severityColor(topSeverity) : '#f59e0b'}
            />
            <Text className={`font-semibold ml-2 ${tc.text}`}>
              AIT #{record.input.aitNumber || record.id}
            </Text>
          </View>

          <Text className={`${tc.textMuted} text-sm mt-2`}>
            {clampText(record.input.description, 90)}
          </Text>

          <View className="flex-row items-center mt-3">
            <Ionicons name="time-outline" size={14} color={tc.iconMuted} />
            <Text className={`${tc.buttonSecondaryText} text-xs ml-2`}>
              {formatDate(record.analyzedAt)}
            </Text>

            <View className="ml-3 flex-row items-center">
              <Ionicons
                name={hasDefense ? 'checkmark-circle' : 'document-text-outline'}
                size={14}
                color={hasDefense ? '#22c55e' : '#f59e0b'}
              />
              <Text
                className={`text-xs ml-2 ${
                  hasDefense ? tc.buttonSecondaryText : 'font-semibold text-amber-500'
                }`}
              >
                {hasDefense ? 'Defesa gerada' : 'Aguardando defesa'}
              </Text>
            </View>
          </View>
        </View>

        <TouchableScale
          onPress={onDelete}
          style={{ height: 40, width: 40, justifyContent: 'center', alignItems: 'center' }}
        >
          <Ionicons name="trash-outline" size={20} color="#f87171" />
        </TouchableScale>
      </View>

      <View className="mt-3 flex-row gap-3">
        <TouchableScale
          onPress={onView}
          style={{ flex: 1 }}
        >
          <View className={`rounded-xl py-3 border ${tc.buttonSecondary} border-amber-400`}>
            <Text className={`text-center text-sm font-semibold ${tc.buttonSecondaryText}`}>
              Acessar
            </Text>
          </View>
        </TouchableScale>

        <TouchableScale
          onPress={hasDefense ? onSend : undefined}
          disabled={!hasDefense}
          style={{ flex: 1 }}
        >
          <View
            className={`rounded-xl py-3 ${
              hasDefense ? 'bg-amber-400' : tc.buttonDisabled
            }`}
          >
            <Text
              className={`text-center text-sm font-semibold ${
                hasDefense ? 'text-slate-900' : tc.buttonDisabledText
              }`}
            >
              Enviar
            </Text>
          </View>
        </TouchableScale>
      </View>
    </View>
  );
}
