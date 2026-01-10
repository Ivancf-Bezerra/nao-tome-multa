import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import * as SecureStore from 'expo-secure-store';

export interface DriverProfile {
  fullName: string;
  cpf: string;
  cnhNumber: string;
  cnhCategory: string;
  cnhExpiry: string;
}

// ATUALIZAÇÃO AQUI: Adicionado campo 'color'
export interface VehicleProfile {
  plate: string;
  renavam: string;
  model: string;
  color: string; // <--- NOVO CAMPO OBRIGATÓRIO
  city: string;
}

export interface TechnicalProfile {
  driver: DriverProfile;
  vehicle: VehicleProfile;
  createdAt: string;
}

interface TechnicalProfileContextData {
  profile: TechnicalProfile | null;
  isLoaded: boolean;
  saveProfile: (profile: TechnicalProfile) => Promise<void>;
  clearProfile: () => Promise<void>;
}

const TechnicalProfileContext =
  createContext<TechnicalProfileContextData | undefined>(
    undefined
  );

// DICA: Mudei a chave para 'v2' para garantir que dados antigos (sem cor) não quebrem a aplicação
const STORAGE_KEY = 'technical_profile_v2';

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
        if (stored) {
          setProfile(JSON.parse(stored));
        }
      } catch {
        // falha silenciosa
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
      JSON.stringify(data)
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

export function useTechnicalProfile(): TechnicalProfileContextData {
  const context = useContext(TechnicalProfileContext);
  if (!context) {
    throw new Error(
      'useTechnicalProfile must be used within a TechnicalProfileProvider'
    );
  }
  return context;
}