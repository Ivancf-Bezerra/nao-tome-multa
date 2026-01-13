import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import * as SecureStore from 'expo-secure-store';

/* =======================
   TIPOS DE DOMÍNIO
======================= */

export interface DriverProfile {
  fullName: string;
  cpf: string;
  cnhNumber: string;
  cnhCategory: string;
  cnhExpiry: string;
  cnhIssuerUF: string;
}

export interface VehicleProfile {
  plate: string;
  renavam: string;
  brand: string;
  model: string;
  color: string;
  city: string;
  uf: string;
  ownerCpf: string;
}

export interface TechnicalProfile {
  driver: DriverProfile;
  vehicle: VehicleProfile;
  createdAt: string;
}

/* =======================
   CONTEXTO
======================= */

interface TechnicalProfileContextData {
  profile: TechnicalProfile | null;
  isLoaded: boolean;
  saveProfile: (profile: TechnicalProfile) => Promise<void>;
  clearProfile: () => Promise<void>;
}

const TechnicalProfileContext =
  createContext<TechnicalProfileContextData | undefined>(
    undefined,
  );

const STORAGE_KEY = 'technical_profile_v3';

/* =======================
   PROVIDER
======================= */

export function TechnicalProfileProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [profile, setProfile] =
    useState<TechnicalProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const stored =
          await SecureStore.getItemAsync(STORAGE_KEY);

        if (!stored) return;

        const parsed = JSON.parse(stored);

        /**
         * NORMALIZAÇÃO DEFENSIVA
         * - suporta versões antigas
         * - garante strings
         * - nunca undefined
         */
        const normalized: TechnicalProfile = {
          createdAt:
            parsed.createdAt ??
            new Date().toISOString(),

          driver: {
            fullName: parsed.driver?.fullName ?? '',
            cpf: parsed.driver?.cpf ?? '',
            cnhNumber: parsed.driver?.cnhNumber ?? '',
            cnhCategory:
              parsed.driver?.cnhCategory ?? '',
            cnhExpiry:
              parsed.driver?.cnhExpiry ?? '',
            cnhIssuerUF:
              parsed.driver?.cnhIssuerUF ?? '',
          },

          vehicle: {
            plate: parsed.vehicle?.plate ?? '',
            renavam:
              parsed.vehicle?.renavam ?? '',
            brand: parsed.vehicle?.brand ?? '',
            model: parsed.vehicle?.model ?? '',
            color: parsed.vehicle?.color ?? '',
            city: parsed.vehicle?.city ?? '',
            uf: parsed.vehicle?.uf ?? '',
            ownerCpf:
              parsed.vehicle?.ownerCpf ?? '',
          },
        };

        setProfile(normalized);
      } catch {
        // falha silenciosa: app real não quebra por storage
      } finally {
        setIsLoaded(true);
      }
    }

    loadProfile();
  }, []);

  async function saveProfile(data: TechnicalProfile) {
    setProfile(data);
    await SecureStore.setItemAsync(
      STORAGE_KEY,
      JSON.stringify(data),
    );
  }

  async function clearProfile() {
    setProfile(null);
    await SecureStore.deleteItemAsync(STORAGE_KEY);
  }

  return (
    <TechnicalProfileContext.Provider
      value={{
        profile,
        isLoaded,
        saveProfile,
        clearProfile,
      }}
    >
      {children}
    </TechnicalProfileContext.Provider>
  );
}

/* =======================
   HOOK
======================= */

export function useTechnicalProfile(): TechnicalProfileContextData {
  const context = useContext(
    TechnicalProfileContext,
  );

  if (!context) {
    throw new Error(
      'useTechnicalProfile must be used within a TechnicalProfileProvider',
    );
  }

  return context;
}
