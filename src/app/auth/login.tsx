import {
  Text,
  View,
  Pressable,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  useSignIn,
  useOAuth,
  useAuth,
} from '@clerk/clerk-expo';

type Step = 'email' | 'code';

export default function Login() {
  const { signIn, isLoaded, setActive } = useSignIn();
  const { isSignedIn } = useAuth();
  const { startOAuthFlow } = useOAuth({
    strategy: 'oauth_google',
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Login nunca age se o usuário já estiver autenticado
   */
  useEffect(() => {
    if (isSignedIn) {
      setModalVisible(false);
      setLoading(false);
      setError(null);
    }
  }, [isSignedIn]);

  if (!isLoaded || isSignedIn) {
    return null;
  }

  /**
   * PASSO 1 — Envio do código
   */
  async function handleSendCode() {
    if (!signIn || !email || loading) return;

    setLoading(true);
    setError(null);

    try {
      await signIn.create({
        identifier: email,
        strategy: 'email_code',
      });

      setStep('code');
    } catch {
      setError(
        'Não foi possível enviar o código. Verifique o email informado.'
      );
    } finally {
      setLoading(false);
    }
  }

  /**
   * PASSO 2 — Confirmação do código
   */
  async function handleConfirmCode() {
    if (!signIn || !code || loading) return;

    setLoading(true);
    setError(null);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'email_code',
        code,
      });

      if (result.createdSessionId) {
        await setActive({
          session: result.createdSessionId,
        });
      }
    } catch {
      setError('Código inválido ou expirado.');
    } finally {
      setLoading(false);
    }
  }

  /**
   * OAuth Google
   */
  async function handleGoogleLogin() {
    if (loading) return;

    setLoading(true);

    try {
      const {
        createdSessionId,
        setActive: setOAuthActive,
      } = await startOAuthFlow();

if (createdSessionId && setOAuthActive) {
  await setOAuthActive({
    session: createdSessionId,
  });
}

    } catch {
      setError('Falha ao autenticar com Google.');
    } finally {
      setLoading(false);
    }
  }

  function resetAndClose() {
    setModalVisible(false);
    setStep('email');
    setEmail('');
    setCode('');
    setError(null);
  }

  return (
    <View className="flex-1 bg-slate-900">
      <StatusBar style="light" />

      <LinearGradient colors={['#0f172a', '#1e293b']} style={{ flex: 1 }}>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <View className="flex-1 items-center justify-center px-8">
            <Text className="text-center text-4xl font-bold text-white">
              Não Tome <Text className="text-[#fbbf24]">Multa</Text>
            </Text>

            <Text className="mt-3 text-center text-base text-slate-400">
              Acesso ao sistema técnico de análise administrativa.
            </Text>
          </View>
        </SafeAreaView>

        {/* WHITE SHEET */}
        <View className="bg-white dark:bg-[#1e293b] rounded-t-[36px] px-8 pt-9 pb-11 shadow-2xl shadow-black">
          <Pressable
            onPress={() => setModalVisible(true)}
            className="w-full rounded-2xl py-5 bg-[#fbbf24] items-center"
          >
            <Text className="font-bold text-slate-900">
              Acessar com email
            </Text>
          </Pressable>

          <Pressable
            onPress={handleGoogleLogin}
            disabled={loading}
            className="mt-4 w-full rounded-2xl py-5 border border-slate-300 dark:border-slate-700 items-center"
          >
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text className="font-semibold text-slate-800 dark:text-slate-100">
                Acessar com Google
              </Text>
            )}
          </Pressable>
        </View>
      </LinearGradient>

      {/* MODAL EMAIL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/40 items-center justify-center px-4">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="w-full max-w-[420px] bg-white dark:bg-[#1e293b] rounded-[28px] px-8 pt-8 pb-10"
          >
            <Text className="text-center text-lg font-semibold text-slate-800 dark:text-slate-100">
              {step === 'email'
                ? 'Identificação do usuário'
                : 'Validação de acesso'}
            </Text>

            <Text className="mt-3 mb-6 text-center text-sm text-slate-500 dark:text-slate-400">
              {step === 'email'
                ? 'Informe o email para receber o código.'
                : 'Informe o código enviado para o email.'}
            </Text>

            {step === 'email' ? (
              <>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="exemplo@dominio.com"
                  placeholderTextColor="#94a3b8"
                  className="mb-4 w-full rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-4 text-slate-800 dark:text-white"
                />

                {error && (
                  <Text className="mb-3 text-sm text-red-500">
                    {error}
                  </Text>
                )}

                <Pressable
                  onPress={handleSendCode}
                  disabled={loading}
                  className="w-full rounded-2xl py-4 bg-[#fbbf24] items-center"
                >
                  {loading ? (
                    <ActivityIndicator color="#0f172a" />
                  ) : (
                    <Text className="font-semibold text-slate-900">
                      Continuar
                    </Text>
                  )}
                </Pressable>
              </>
            ) : (
              <>
                <TextInput
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  placeholder="Código"
                  placeholderTextColor="#94a3b8"
                  className="mb-4 w-full rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-4 text-center tracking-widest text-slate-800 dark:text-white"
                />

                {error && (
                  <Text className="mb-3 text-sm text-red-500">
                    {error}
                  </Text>
                )}

                <Pressable
                  onPress={handleConfirmCode}
                  disabled={loading}
                  className="w-full rounded-2xl py-4 bg-[#fbbf24] items-center"
                >
                  {loading ? (
                    <ActivityIndicator color="#0f172a" />
                  ) : (
                    <Text className="font-semibold text-slate-900">
                      Validar acesso
                    </Text>
                  )}
                </Pressable>
              </>
            )}

            <Pressable onPress={resetAndClose} className="mt-6 items-center">
              <Text className="text-sm text-slate-500 dark:text-slate-400">
                Cancelar e retornar
              </Text>
            </Pressable>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}
