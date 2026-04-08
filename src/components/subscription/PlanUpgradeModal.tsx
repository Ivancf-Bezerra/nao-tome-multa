import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Modal, Pressable, Text, View } from 'react-native';

import { usePlanUpgrade } from '../../context/PlanUpgradeContext';
import { useThemeClasses } from '../../context/ThemeContext';
import TouchableScale from '../ui/TouchableScale';

const PLAN_LABELS: Record<string, string> = {
  starter: 'Plano Básico',
  monthly: 'Plano Ilimitado',
};

export default function PlanUpgradeModal() {
  const { visible, config, hidePlanUpgrade } = usePlanUpgrade();
  const tc = useThemeClasses();
  const router = useRouter();

  const planLabel = config.requiredPlan ? PLAN_LABELS[config.requiredPlan] : 'plano pago';

  function handleViewPlans() {
    hidePlanUpgrade();
    router.push('/(tabs)/planos');
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={hidePlanUpgrade}
    >
      <View className={`flex-1 justify-center items-center px-6 ${tc.modalOverlay}`}>
        <Pressable className="absolute inset-0" onPress={hidePlanUpgrade} />

        <View className={`w-full rounded-3xl p-6 ${tc.modalBg} ${tc.border} border`}>
          {/* Ícone */}
          <View className="items-center mb-4">
            <View className="h-14 w-14 rounded-full bg-amber-400/15 items-center justify-center">
              <Ionicons name="pricetag-outline" size={28} color="#f59e0b" />
            </View>
          </View>

          {/* Título */}
          <Text className={`text-base font-semibold text-center ${tc.text}`}>
            {config.feature
              ? `"${config.feature}" requer um plano pago`
              : 'Recurso disponível no plano pago'}
          </Text>

          {/* Descrição */}
          <Text className={`${tc.textMuted} text-sm text-center mt-2 leading-relaxed`}>
            {config.feature
              ? `Para usar ${config.feature}, é necessário ativar o ${planLabel}.`
              : `Este recurso está disponível apenas para assinantes do ${planLabel}.`}
            {'\n'}Veja os planos disponíveis e escolha o que melhor se encaixa no seu perfil.
          </Text>

          {/* Benefícios rápidos */}
          <View className={`mt-4 rounded-2xl p-4 ${tc.cardAlt}`}>
            {config.requiredPlan === 'monthly' ? (
              <>
                <BenefitRow label="Análises técnicas ilimitadas" />
                <BenefitRow label="Defesa Prévia e Recurso à JARI" />
                <BenefitRow label="Histórico completo salvo" />
              </>
            ) : (
              <>
                <BenefitRow label="Análises técnicas de multas" />
                <BenefitRow label="Geração de Defesa Prévia" />
                <BenefitRow label="Histórico de defesas salvo" />
              </>
            )}
          </View>

          {/* Ações */}
          <View className="mt-5 gap-3">
            <TouchableScale onPress={handleViewPlans}>
              <View className="rounded-xl bg-amber-400 py-4 items-center">
                <Text className="text-sm font-semibold text-slate-900">
                  Ver planos
                </Text>
              </View>
            </TouchableScale>

            <TouchableScale onPress={hidePlanUpgrade}>
              <View className={`rounded-xl py-4 items-center border ${tc.buttonSecondary}`}>
                <Text className={`text-sm font-semibold ${tc.buttonSecondaryText}`}>
                  Cancelar
                </Text>
              </View>
            </TouchableScale>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function BenefitRow({ label }: { label: string }) {
  const tc = useThemeClasses();
  return (
    <View className="flex-row items-center gap-2 mb-2 last:mb-0">
      <Ionicons name="checkmark-circle" size={14} color="#f59e0b" />
      <Text className={`${tc.textMuted} text-xs flex-1`}>{label}</Text>
    </View>
  );
}
