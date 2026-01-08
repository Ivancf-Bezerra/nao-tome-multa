import {
  Text,
  View,
  TextInput,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";

type EmailFlowStep = "email" | "code";

type AuthModalProps = {
  visible: boolean;
  step: EmailFlowStep;
  email: string;
  code: string;
  loading?: boolean;
  onChangeEmail: (v: string) => void;
  onChangeCode: (v: string) => void;
  onClose: () => void;
  onSendCode: () => void;
  onConfirmCode: () => void;
};

export function AuthModal({
  visible,
  step,
  email,
  code,
  loading,
  onChangeEmail,
  onChangeCode,
  onClose,
  onSendCode,
  onConfirmCode,
}: AuthModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        {/* BACKDROP */}
        <View className="flex-1 bg-black/60 px-8">
          {/* RESPIRO SUPERIOR */}
          <View className="flex-1" />

          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              className="
                w-full max-w-[420px]
                self-center
                rounded-3xl
                bg-white dark:bg-[#1e293b]
                px-8 pt-9 pb-10
                shadow-2xl shadow-black
              "
            >
              {/* HEADER */}
              <View className="mb-6">
                <Text className="text-center text-lg font-semibold text-slate-800 dark:text-slate-100">
                  {step === "email"
                    ? "Identificação por email"
                    : "Confirmação de acesso"}
                </Text>

                <Text className="mt-3 text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {step === "email"
                    ? "Informe seu email para receber o código de acesso."
                    : "Digite o código enviado para o seu email."}
                </Text>
              </View>

              {/* CONTEÚDO */}
              {step === "email" ? (
                <>
                  <TextInput
                    value={email}
                    onChangeText={onChangeEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="seu@email.com"
                    placeholderTextColor="#94a3b8"
                    className="
                      mb-6
                      w-full
                      rounded-xl
                      border border-slate-200 dark:border-slate-700
                      px-4 py-4
                      text-slate-800 dark:text-white
                    "
                  />

                  <Pressable
                    onPress={onSendCode}
                    disabled={loading}
                    className="
                      w-full
                      items-center
                      justify-center
                      rounded-2xl
                      py-4
                      bg-[#fbbf24]
                      active:opacity-90
                    "
                  >
                    <Text className="font-bold text-slate-900">
                      Enviar código
                    </Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <TextInput
                    value={code}
                    onChangeText={onChangeCode}
                    keyboardType="number-pad"
                    placeholder="Código"
                    placeholderTextColor="#94a3b8"
                    className="
                      mb-6
                      w-full
                      rounded-xl
                      border border-slate-200 dark:border-slate-700
                      px-4 py-4
                      text-center
                      text-lg
                      tracking-widest
                      text-slate-800 dark:text-white
                    "
                  />

                  <Pressable
                    onPress={onConfirmCode}
                    disabled={loading}
                    className="
                      w-full
                      items-center
                      justify-center
                      rounded-2xl
                      py-4
                      bg-[#fbbf24]
                      active:opacity-90
                    "
                  >
                    <Text className="font-bold text-slate-900">
                      Confirmar acesso
                    </Text>
                  </Pressable>
                </>
              )}
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>

          {/* RESPIRO INFERIOR */}
          <View className="flex-1" />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
