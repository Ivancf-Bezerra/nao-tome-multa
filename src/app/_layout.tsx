import '../../global.css';
import {
  ClerkProvider,
  ClerkLoaded,
  useAuth,
} from '@clerk/clerk-expo';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

import { AnalysisProvider } from '../context/AnalysisContext';

const publishableKey =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

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
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const rootSegment = segments[0];
    const inAuthGroup = rootSegment === 'auth';
    const isSplash = rootSegment === undefined;

    if (!isSignedIn && !inAuthGroup && !isSplash) {
      router.replace('/auth/login');
      return;
    }

    if (isSignedIn && inAuthGroup) {
      router.replace('/(tabs)/home');
    }
  }, [isSignedIn, isLoaded, segments]);

  /**
   * ⚠️ O PROVIDER PRECISA ENVOLVER O SLOT
   */
  return (
    <AnalysisProvider>
      <Slot />
    </AnalysisProvider>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>
        <AuthGate />
      </ClerkLoaded>
    </ClerkProvider>
  );
}
