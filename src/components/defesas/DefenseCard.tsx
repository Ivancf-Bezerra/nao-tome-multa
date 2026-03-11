import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useThemeClasses } from '../../context/ThemeContext';
import { AnalyzedInfractionRecord, InconsistencySeverity } from './types';

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
        <Pressable onPress={onView} className="flex-1 pr-3">
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
                color={hasDefense ? '#22c55e' : '#60a5fa'}
              />
              <Text className={`${tc.buttonSecondaryText} text-xs ml-2`}>
                {hasDefense ? 'Defesa gerada' : 'Aguardando defesa'}
              </Text>
            </View>
          </View>
        </Pressable>

        <View className="flex-row items-center">
          <Pressable
            onPress={onView}
            className="h-10 w-10 items-center justify-center rounded-xl"
          >
            <Ionicons name="eye-outline" size={18} color={tc.iconMuted} />
          </Pressable>

          <Pressable
            onPress={hasDefense ? onSend : undefined}
            disabled={!hasDefense}
            className={`h-10 w-10 items-center justify-center rounded-xl ml-2 ${
              hasDefense ? `${tc.buttonSecondary} active:opacity-90` : `${tc.buttonSecondary} opacity-60`
            }`}
          >
            <Ionicons
              name="send-outline"
              size={18}
              color={hasDefense ? '#f59e0b' : tc.iconMuted}
            />
          </Pressable>

          <Pressable
            onPress={onDelete}
            className={`h-10 w-10 items-center justify-center rounded-xl ml-2 ${tc.buttonSecondary}`}
          >
            <Ionicons name="trash-outline" size={18} color={tc.iconMuted} />
          </Pressable>
        </View>
      </View>

      <View className={`mt-4 pt-4 ${tc.borderB}`}>
        <Text className={`${tc.buttonSecondaryText} text-xs`}>
          Resumo:{' '}
          <Text className={tc.text}>{record.result.summary}</Text>
        </Text>
      </View>
    </View>
  );
}
