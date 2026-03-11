import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import { useUser } from '@clerk/clerk-expo';

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
  createContext<TechnicalProfileContextData | undefined>(undefined);

/* =======================
   STORAGE (POR USUÁRIO)
======================= */

function safeKeyPart(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function getStorageKey(userId: string) {
  return `technical_profile_v3_${safeKeyPart(userId)}`;
}



/* =======================
   PROVIDER
======================= */

export function TechnicalProfileProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isLoaded: isUserLoaded } = useUser();
  const userId = user?.id ?? null;

  const [profile, setProfile] = useState<TechnicalProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      // 🔒 Se não tem usuário, não tem perfil carregado
      if (!userId) {
        setProfile(null);
        setIsLoaded(true);
        return;
      }

      setIsLoaded(false);

      try {
        const storageKey = getStorageKey(userId);
        const stored = await SecureStore.getItemAsync(storageKey);

        if (!stored) {
          setProfile(null);
          return;
        }

        const parsed = JSON.parse(stored);

        /**
         * NORMALIZAÇÃO DEFENSIVA
         * - suporta versões antigas
         * - garante strings
         * - nunca undefined
         */
        const normalized: TechnicalProfile = {
          createdAt: parsed.createdAt ?? new Date().toISOString(),

          driver: {
            fullName: parsed.driver?.fullName ?? '',
            cpf: parsed.driver?.cpf ?? '',
            cnhNumber: parsed.driver?.cnhNumber ?? '',
            cnhCategory: parsed.driver?.cnhCategory ?? '',
            cnhExpiry: parsed.driver?.cnhExpiry ?? '',
            cnhIssuerUF: parsed.driver?.cnhIssuerUF ?? '',
          },

          vehicle: {
            plate: parsed.vehicle?.plate ?? '',
            renavam: parsed.vehicle?.renavam ?? '',
            brand: parsed.vehicle?.brand ?? '',
            model: parsed.vehicle?.model ?? '',
            color: parsed.vehicle?.color ?? '',
            city: parsed.vehicle?.city ?? '',
            uf: parsed.vehicle?.uf ?? '',
            ownerCpf: parsed.vehicle?.ownerCpf ?? '',
          },
        };

        setProfile(normalized);
      } catch {
        // falha silenciosa: app real não quebra por storage
        setProfile(null);
      } finally {
        setIsLoaded(true);
      }
    }

    if (!isUserLoaded) return;
    loadProfile();
  }, [userId, isUserLoaded]);

  async function saveProfile(data: TechnicalProfile) {
    if (!userId) return;

    // Regra do MVP:
    // - o veículo precisa estar no nome do mesmo CPF do condutor (proprietário da CNH)
    // - forçamos o ownerCpf do veículo a ser sempre igual ao cpf do driver
    const normalized: TechnicalProfile = {
      ...data,
      vehicle: {
        ...data.vehicle,
        ownerCpf: data.driver.cpf,
      },
    };

    const storageKey = getStorageKey(userId);

    setProfile(normalized);
    await SecureStore.setItemAsync(storageKey, JSON.stringify(normalized));
  }

  async function clearProfile() {
    if (!userId) {
      setProfile(null);
      return;
    }

    const storageKey = getStorageKey(userId);

    setProfile(null);
    await SecureStore.deleteItemAsync(storageKey);
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
  const context = useContext(TechnicalProfileContext);

  if (!context) {
    throw new Error(
      'useTechnicalProfile must be used within a TechnicalProfileProvider'
    );
  }

  return context;
}
