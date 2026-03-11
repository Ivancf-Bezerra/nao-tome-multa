import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlanType } from '../../context/SubscriptionContext';

export interface SubscriptionData {
  plan: PlanType;
  isActive: boolean;
  expiresAt: string | null;
}

const STORAGE_KEY_PREFIX = '@ntm:subscription:';

function storageKey(userId: string): string {
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

/**
 * Busca o plano atual do usuário.
 * Stub local via AsyncStorage — substituir por GET /user/subscription quando backend estiver disponível.
 */
export async function getSubscription(userId: string): Promise<SubscriptionData> {
  try {
    const raw = await AsyncStorage.getItem(storageKey(userId));
    if (!raw) {
      return { plan: 'none', isActive: false, expiresAt: null };
    }
    const parsed = JSON.parse(raw) as SubscriptionData;

    if (parsed.expiresAt) {
      const expired = new Date(parsed.expiresAt) < new Date();
      if (expired) {
        return { plan: 'none', isActive: false, expiresAt: parsed.expiresAt };
      }
    }

    return parsed;
  } catch {
    return { plan: 'none', isActive: false, expiresAt: null };
  }
}

/**
 * Ativa um plano para o usuário (stub local).
 * Substituir por POST /subscription/checkout quando gateway estiver disponível.
 */
export async function activateSubscription(
  userId: string,
  plan: PlanType,
  durationDays = 30,
): Promise<SubscriptionData> {
  const expiresAt = new Date(
    Date.now() + durationDays * 24 * 60 * 60 * 1000,
  ).toISOString();

  const data: SubscriptionData = {
    plan,
    isActive: true,
    expiresAt,
  };

  await AsyncStorage.setItem(storageKey(userId), JSON.stringify(data));
  return data;
}

/**
 * Cancela o plano ativo do usuário (stub local).
 * Substituir por DELETE /subscription quando backend estiver disponível.
 */
export async function cancelSubscription(userId: string): Promise<void> {
  await AsyncStorage.removeItem(storageKey(userId));
}
