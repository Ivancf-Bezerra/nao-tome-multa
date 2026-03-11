import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageBuckets, userKey } from '../../storage/storageKeys';
import { AnalyzedInfractionRecord } from './types';

export async function loadDefesas(userId: string): Promise<AnalyzedInfractionRecord[]> {
  const key = userKey(userId, StorageBuckets.defesas);
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AnalyzedInfractionRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveDefesas(
  userId: string,
  records: AnalyzedInfractionRecord[],
): Promise<void> {
  const key = userKey(userId, StorageBuckets.defesas);
  await AsyncStorage.setItem(key, JSON.stringify(records));
}

export async function addDefesa(
  userId: string,
  record: AnalyzedInfractionRecord,
): Promise<AnalyzedInfractionRecord[]> {
  const existing = await loadDefesas(userId);
  const withoutDuplicate = existing.filter((r) => r.id !== record.id);
  const updated = [record, ...withoutDuplicate];
  await saveDefesas(userId, updated);
  return updated;
}

export async function updateDefesa(
  userId: string,
  record: AnalyzedInfractionRecord,
): Promise<AnalyzedInfractionRecord[]> {
  const existing = await loadDefesas(userId);
  const updated = existing.map((r) => (r.id === record.id ? record : r));
  await saveDefesas(userId, updated);
  return updated;
}

export async function deleteDefesa(
  userId: string,
  id: string,
): Promise<AnalyzedInfractionRecord[]> {
  const existing = await loadDefesas(userId);
  const updated = existing.filter((r) => r.id !== id);
  await saveDefesas(userId, updated);
  return updated;
}

export async function clearDefesas(userId: string): Promise<void> {
  const key = userKey(userId, StorageBuckets.defesas);
  await AsyncStorage.removeItem(key);
}
