import {
  Text,
  Pressable,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';

const SCREEN_WIDTH = Dimensions.get('window').width;
const HORIZONTAL_PADDING = 32 * 2;
const CONTENT_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING;

const steps = [
  {
    title: 'Análise objetiva da infração',
    description:
      'Verificamos requisitos formais com base na legislação de trânsito, de forma clara e organizada.',
  },
  {
    title: 'Verificação técnica automatizada',
    description:
      'Os dados do auto de infração são organizados e validados sem análise subjetiva.',
  },
  {
    title: 'Resultado e documento de apoio',
    description:
      'Quando aplicável, apresentamos um modelo administrativo para uso pelo próprio condutor.',
  },
];

export default function Splash() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View className="flex-1 bg-slate-900">
      <StatusBar style="light" />

      <LinearGradient
        colors={['#0f172a', '#1e293b']}
        style={{ flex: 1 }}
      >
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <View className="flex-1 items-center justify-center px-8">
            <View className="mb-5 rounded-full border border-slate-700 bg-slate-800/80 px-4 py-1.5">
              <Text className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                Sistema operante • v1.0
              </Text>
            </View>

            <Text className="text-center text-4xl font-bold text-white">
              Não Tome <Text className="text-[#fbbf24]">Multa</Text>
            </Text>

            <Text className="mt-3 text-center text-base leading-relaxed text-slate-400">
              Transformamos o complexo código de trânsito em uma defesa simples e objetiva.
            </Text>
          </View>
        </SafeAreaView>

        <View
          className="
            bg-white dark:bg-[#1e293b]
            rounded-t-3xl
            px-8 pt-9 pb-11
            shadow-2xl shadow-black
          "
        >
          <View className="mb-6 flex-row justify-center gap-2">
            {steps.map((_, index) => (
              <View
                key={index}
                className={`h-1.5 w-8 rounded-full ${
                  index === activeIndex
                    ? 'bg-[#fbbf24]'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </View>

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={CONTENT_WIDTH}
            decelerationRate="fast"
            contentContainerStyle={{ alignItems: 'center' }}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / CONTENT_WIDTH
              );
              setActiveIndex(index);
            }}
          >
            {steps.map((step, index) => (
              <View
                key={index}
                style={{ width: CONTENT_WIDTH }}
                className="items-center"
              >
                <View className="max-w-[90%] items-center space-y-3">
                  <Text className="text-center text-lg font-semibold text-slate-800 dark:text-slate-100">
                    {step.title}
                  </Text>

                  <Text className="text-center text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {step.description}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <Pressable
            accessibilityRole="button"
            className="
              mt-7 w-full items-center justify-center
              rounded-2xl py-5
              bg-[#fbbf24]
              active:opacity-90
            "
            onPress={() => {
              router.replace('/auth/login');
            }}
          >
            <Text className="text-base font-bold tracking-wide text-slate-900">
              Iniciar
            </Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}
