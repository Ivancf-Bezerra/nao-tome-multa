import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'app_theme';

export type Theme = 'light' | 'dark';

interface ThemeContextData {
  theme: Theme;
  isDark: boolean;
  isLoaded: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextData | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark') {
        setThemeState(stored);
      }
      setIsLoaded(true);
    });
  }, []);

  async function setTheme(value: Theme) {
    setThemeState(value);
    await AsyncStorage.setItem(STORAGE_KEY, value);
  }

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        isLoaded,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextData {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/** Classes condicionais por tema para uso em className */
export function useThemeClasses() {
  const { isDark } = useTheme();
  return {
    // Fundo base das telas (Passo 6: tema claro em cinza muito claro)
    screen: isDark ? 'bg-slate-900' : 'bg-slate-50',
    screenGradient: isDark ? ['#0f172a', '#1e293b'] as const : ['#f8fafc', '#e2e8f0'] as const,
    card: isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200',
    cardAlt: isDark ? 'bg-slate-900/80 border border-slate-800' : 'bg-slate-50 border border-slate-200',
    text: isDark ? 'text-white' : 'text-slate-900',
    textMuted: isDark ? 'text-slate-400' : 'text-slate-600',
    textSubtle: isDark ? 'text-slate-500' : 'text-slate-500',
    border: isDark ? 'border border-slate-700' : 'border border-slate-200',
    borderAlt: isDark ? 'border border-slate-800' : 'border border-slate-200',
    borderB: isDark ? 'border-b border-slate-800' : 'border-b border-slate-200',
    borderT: isDark ? 'border-t border-slate-800' : 'border-t border-slate-200',
    input: isDark ? 'bg-slate-800' : 'bg-slate-50',
    inputBorder: isDark ? 'border-slate-700' : 'border-slate-300',
    inputFocusBorder: isDark ? 'border-slate-500' : 'border-slate-600',
    inputBorderB: isDark ? 'border-b-slate-700' : 'border-b-slate-200',
    buttonSecondary: isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300',
    buttonSecondaryText: isDark ? 'text-slate-200' : 'text-slate-900',
    iconMuted: isDark ? '#94a3b8' : '#64748b',
    iconPrimary: isDark ? '#e5e7eb' : '#334155',
    modalBg: isDark ? 'bg-slate-900' : 'bg-white',
    modalOverlay: 'bg-black/60',
    header: isDark ? 'bg-slate-800 border border-slate-700' : 'bg-slate-100 border border-slate-200',
    sectionLabel: isDark ? 'text-slate-300' : 'text-slate-600',
    divider: isDark ? 'bg-slate-700' : 'bg-slate-300',
    tabActiveBg: isDark ? 'bg-slate-700' : 'bg-slate-200',
    statusBar: isDark ? 'light' as const : 'dark' as const,
    chipUnselected: isDark ? 'bg-neutral-900 border border-neutral-700 text-neutral-300' : 'bg-slate-100 border border-slate-300 text-slate-700',
    buttonDisabled: isDark ? 'bg-slate-800' : 'bg-slate-300',
    buttonDisabledText: isDark ? 'text-slate-500' : 'text-slate-500',
  };
}
