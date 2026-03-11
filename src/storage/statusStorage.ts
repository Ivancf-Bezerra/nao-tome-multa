import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageBuckets, userKey } from './storageKeys';
import type { StatusMultaEnviada } from '../data/status/types';

export async function loadStatusMultas(
  userId: string,
): Promise<StatusMultaEnviada[]> {
  const key = userKey(userId, StorageBuckets.statusMultas);
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StatusMultaEnviada[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveStatusMultas(
  userId: string,
  items: StatusMultaEnviada[],
): Promise<void> {
  const key = userKey(userId, StorageBuckets.statusMultas);
  await AsyncStorage.setItem(key, JSON.stringify(items));
}

export async function addStatusMulta(
  userId: string,
  item: StatusMultaEnviada,
): Promise<StatusMultaEnviada[]> {
  const existing = await loadStatusMultas(userId);
  const withoutDuplicate = existing.filter((i) => i.id !== item.id);
  const updated = [item, ...withoutDuplicate];
  await saveStatusMultas(userId, updated);
  return updated;
}

export async function updateStatusMulta(
  userId: string,
  id: string,
  update: Partial<Pick<StatusMultaEnviada, 'status' | 'lastMessage' | 'recursoJARI'>>,
): Promise<StatusMultaEnviada[]> {
  const existing = await loadStatusMultas(userId);
  const updated = existing.map((i) =>
    i.id === id ? { ...i, ...update, updatedAt: new Date().toISOString() } : i,
  );
  await saveStatusMultas(userId, updated);
  return updated;
}

export async function deleteStatusMulta(
  userId: string,
  id: string,
): Promise<StatusMultaEnviada[]> {
  const existing = await loadStatusMultas(userId);
  const updated = existing.filter((i) => i.id !== id);
  await saveStatusMultas(userId, updated);
  return updated;
}

export async function getLastReadStatusAt(userId: string): Promise<string | null> {
  const key = userKey(userId, StorageBuckets.lastReadStatusAt);
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
}

export async function setLastReadStatusAt(
  userId: string,
  isoDate: string,
): Promise<void> {
  const key = userKey(userId, StorageBuckets.lastReadStatusAt);
  await AsyncStorage.setItem(key, isoDate);
}
