import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useThemeClasses } from '../../context/ThemeContext';
import { AnalyzedInfractionRecord } from './types';
import DefenseCard from './DefenseCard';

type Props = {
  records: AnalyzedInfractionRecord[];
  onView: (record: AnalyzedInfractionRecord) => void;
  onSend: (record: AnalyzedInfractionRecord) => void;
  onDelete: (record: AnalyzedInfractionRecord) => void;
};

export default function DefesasBottomSheet({ records, onView, onSend, onDelete }: Props) {
  const tc = useThemeClasses();

  return (
    <View className="flex-1 mt-4">
      <View
        className={`flex-1 rounded-t-3xl px-6 pt-5 pb-6 ${tc.modalBg} ${tc.border}`}
      >
        <View className="items-center">
          <View className={`h-1.5 w-14 rounded-full ${tc.divider}`} />
        </View>

        <View className="mt-4 flex-row items-center justify-between">
          <View className="flex-1 pr-4">
            <Text className={`${tc.text} text-base font-semibold`}>
              Histórico de defesas
            </Text>
            <Text className={`${tc.textMuted} text-xs mt-1`}>
              Infrações com inconsistências técnicas detectadas
            </Text>
          </View>

          <View className={`h-10 w-10 items-center justify-center rounded-xl border ${tc.buttonSecondary}`}>
            <Ionicons name="shield" size={18} color="#f59e0b" />
          </View>
        </View>

        <View className="mt-4" style={{ flexGrow: 1 }}>
          {records.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Ionicons name="shield-checkmark" size={28} color="#22c55e" />
              <Text className={`${tc.text} mt-3 font-semibold`}>
                Nenhuma defesa registrada
              </Text>
              <Text className={`${tc.textMuted} text-center mt-1 text-sm`}>
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
