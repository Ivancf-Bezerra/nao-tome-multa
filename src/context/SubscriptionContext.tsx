import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useUser } from '@clerk/clerk-expo';
import { getSubscription } from '../services/subscription/subscriptionService';

export type PlanType = 'none' | 'monthly';

export interface SubscriptionState {
  plan: PlanType;
  isActive: boolean;
  expiresAt: string | null;
  isLoaded: boolean;
}

interface SubscriptionContextData extends SubscriptionState {
  refresh: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextData | undefined>(
  undefined,
);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded: isUserLoaded } = useUser();

  const [state, setState] = useState<SubscriptionState>({
    plan: 'none',
    isActive: false,
    expiresAt: null,
    isLoaded: false,
  });

  async function load() {
    if (!user?.id) {
      setState({ plan: 'none', isActive: false, expiresAt: null, isLoaded: true });
      return;
    }

    try {
      const subscription = await getSubscription(user.id);
      setState({
        plan: subscription.plan,
        isActive: subscription.isActive,
        expiresAt: subscription.expiresAt,
        isLoaded: true,
      });
    } catch {
      setState({ plan: 'none', isActive: false, expiresAt: null, isLoaded: true });
    }
  }

  useEffect(() => {
    if (!isUserLoaded) return;
    load();
  }, [user?.id, isUserLoaded]);

  return (
    <SubscriptionContext.Provider value={{ ...state, refresh: load }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription(): SubscriptionContextData {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return ctx;
}
