import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useRouter } from 'expo-router';

import HomeHeader from '../../components/home/HomeHeader';
import WelcomeMessage from '../../components/home/WelcomeMessage';
import TechnicalProfileCard from '../../context/TechnicalProfileCard';
import TechnicalProfilePreviewCard from '../../components/home/TechnicalProfilePreviewCard';
import FineSearchCard from '../../components/home/FineSearchCard';
import FineSearchResultModal from '../../components/home/FineSearchResultModal';
import NotificationsModal from '../../components/home/NotificationsModal';

import { useTechnicalProfile } from '../../context/TechnicalProfileContext';

export default function Home() {
  const router = useRouter();
  const { profile } = useTechnicalProfile();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  /**
   * Estado simulado apenas para MVP.
   * Em versões futuras, isso virá de análise real.
   */
  const [hasFines] = useState<boolean>(false);

  const hasTechnicalProfile = Boolean(profile);

  return (
    <View className="flex-1 bg-slate-900">
      <StatusBar style="light" />

      <LinearGradient
        colors={['#0f172a', '#1e293b']}
        style={{ flex: 1 }}
      >
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <HomeHeader
            onOpenNotifications={() => setNotificationsOpen(true)}
          />

          <View className="h-6" />

          <WelcomeMessage />

          <View className="w-[90%] self-center">
            {!hasTechnicalProfile && (
              <TechnicalProfileCard
                onPress={() =>
                  router.push('/profile/TechnicalProfileScreen')
                }
              />
            )}

            {hasTechnicalProfile && (
              <>
                <TechnicalProfilePreviewCard />

                <FineSearchCard />
              </>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>

      <FineSearchResultModal
        visible={searchModalOpen}
        hasFines={hasFines}
        onClose={() => setSearchModalOpen(false)}
      />

      <NotificationsModal
        visible={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </View>
  );
}
