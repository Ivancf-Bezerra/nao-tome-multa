import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AnalyzedInfractionRecord } from './types';
import DefenseCard from './DefenseCard';

const SHEET_HEIGHT = Math.round(Dimensions.get('window').height * 0.7);

type Props = {
  records: AnalyzedInfractionRecord[];
  onView: (record: AnalyzedInfractionRecord) => void;
  onSend: (record: AnalyzedInfractionRecord) => void;
  onDelete: (record: AnalyzedInfractionRecord) => void;
};

export default function DefesasBottomSheet({ records, onView, onSend, onDelete }: Props) {
  return (
    <View className="flex-1 justify-end">
      <View
        className="rounded-t-3xl border border-slate-800 bg-slate-900 px-6 pt-5 pb-6"
        style={{ height: SHEET_HEIGHT }}
      >
        <View className="items-center">
          <View className="h-1.5 w-14 rounded-full bg-slate-700" />
        </View>

        <View className="mt-4 flex-row items-center justify-between">
          <View className="flex-1 pr-4">
            <Text className="text-white text-base font-semibold">
              Histórico de defesas
            </Text>
            <Text className="text-slate-400 text-xs mt-1">
              Infrações com inconsistências técnicas detectadas
            </Text>
          </View>

          <View className="h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900">
            <Ionicons name="shield" size={18} color="#fbbf24" />
          </View>
        </View>

        <View className="mt-4 flex-1">
          {records.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Ionicons name="shield-checkmark" size={28} color="#22c55e" />
              <Text className="text-white mt-3 font-semibold">
                Nenhuma defesa registrada
              </Text>
              <Text className="text-slate-400 text-center mt-1 text-sm">
                Análises com inconsistências aparecerão aqui.
              </Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
              {records.map((r) => (
                <DefenseCard
                  key={r.id}
                  record={r}
                  onView={() => onView(r)}
                  onSend={() => onSend(r)}
                  onDelete={() => onDelete(r)}
                />
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </View>
  );
}
