import {
    ClerkLoaded,
    ClerkProvider,
    useAuth,
    useUser,
} from '@clerk/clerk-expo';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';
import '../../global.css';

import { PlanUpgradeProvider } from '../context/PlanUpgradeContext';
import { SettingsModalProvider } from '../context/SettingsModalContext';
import { StatusMultasProvider } from '../context/StatusMultasContext';
import { SubscriptionProvider } from '../context/SubscriptionContext';
import { TechnicalProfileProvider } from '../context/TechnicalProfileContext';
import { ThemeProvider } from '../context/ThemeContext';
import PlanUpgradeModal from '../components/subscription/PlanUpgradeModal';
import SettingsModal from '../components/settings/SettingsModal';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
  );
}

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {}
  },
};

function AuthGate() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const rootSegment = segments[0];

    const inAuthGroup = rootSegment === 'auth';
    const inTabsGroup = rootSegment === '(tabs)';
    const inProfileGroup = rootSegment === 'profile';
    const inSubscriptionGroup = rootSegment === 'subscription';

    const isLegal = rootSegment === 'legal';
    const isSplash = rootSegment === undefined;

    if (!isSignedIn) {
      if (!inAuthGroup && !isSplash) {
        router.replace('/auth/login');
      }
      return;
    }

    if (isSignedIn) {
      const isAllowed =
        inTabsGroup ||
        inProfileGroup ||
        inSubscriptionGroup ||
        isLegal ||
        isSplash;

      if (!isAllowed) {
        router.replace('/(tabs)/home');
      }
    }
  }, [isSignedIn, isLoaded, segments]);

  return (
    <ThemeProvider>
      <TechnicalProfileProvider key={user?.id ?? 'guest'}>
        <SubscriptionProvider>
          <StatusMultasProvider>
            <SettingsModalProvider>
              <PlanUpgradeProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="auth" />
                  <Stack.Screen name="profile" />
                  <Stack.Screen name="subscription" />
                  <Stack.Screen name="legal" options={{ presentation: 'card', headerShown: false }} />
                </Stack>
                <SettingsModal />
                <PlanUpgradeModal />
              </PlanUpgradeProvider>
            </SettingsModalProvider>
          </StatusMultasProvider>
        </SubscriptionProvider>
      </TechnicalProfileProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <AuthGate />
      </ClerkLoaded>
    </ClerkProvider>
  );
}
