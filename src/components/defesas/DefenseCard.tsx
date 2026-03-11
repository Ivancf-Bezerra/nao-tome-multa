import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  const hasDefense = Boolean(record.defense?.defesaPrevia?.trim());
  const topSeverity = record.result.findings[0]?.severity;

  return (
    <View className="rounded-2xl border border-slate-800 bg-slate-900 p-4 mb-4">
      <View className="flex-row items-start justify-between">
        <Pressable onPress={onView} className="flex-1 pr-3">
          <View className="flex-row items-center">
            <Ionicons
              name="alert-circle"
              size={16}
              color={topSeverity ? severityColor(topSeverity) : '#fbbf24'}
            />
            <Text className="text-white font-semibold ml-2">
              AIT #{record.input.aitNumber || record.id}
            </Text>
          </View>

          <Text className="text-slate-400 text-sm mt-2">
            {clampText(record.input.description, 90)}
          </Text>

          <View className="flex-row items-center mt-3">
            <Ionicons name="time-outline" size={14} color="#94a3b8" />
            <Text className="text-slate-300 text-xs ml-2">
              {formatDate(record.analyzedAt)}
            </Text>

            <View className="ml-3 flex-row items-center">
              <Ionicons
                name={hasDefense ? 'checkmark-circle' : 'document-text-outline'}
                size={14}
                color={hasDefense ? '#22c55e' : '#60a5fa'}
              />
              <Text className="text-slate-300 text-xs ml-2">
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
            <Ionicons name="eye-outline" size={18} color="#94a3b8" />
          </Pressable>

          <Pressable
            onPress={hasDefense ? onSend : undefined}
            disabled={!hasDefense}
            className={`h-10 w-10 items-center justify-center rounded-xl ml-2 ${
              hasDefense ? 'bg-slate-800 active:opacity-90' : 'bg-slate-800/50 opacity-60'
            }`}
          >
            <Ionicons
              name="send-outline"
              size={18}
              color={hasDefense ? '#fbbf24' : '#64748b'}
            />
          </Pressable>

          <Pressable
            onPress={onDelete}
            className="h-10 w-10 items-center justify-center rounded-xl bg-slate-800 ml-2"
          >
            <Ionicons name="trash-outline" size={18} color="#94a3b8" />
          </Pressable>
        </View>
      </View>

      <View className="mt-4 pt-4 border-t border-slate-800">
        <Text className="text-slate-300 text-xs">
          Resumo:{' '}
          <Text className="text-white">{record.result.summary}</Text>
        </Text>
      </View>
    </View>
  );
}
