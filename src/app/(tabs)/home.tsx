import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

import HomeHeader from '../../components/home/HomeHeader';
import WelcomeMessage from '../../components/home/WelcomeMessage';
import UploadCard from '../../components/home/UploadCard';
import RequiredDocumentsCard from '../../components/home/RequiredDocumentsCard';
import AnalysisResultCard from '../../components/home/AnalysisResultCard';
import DefensesCard from '../../components/home/DefensesCard';
import NotificationsModal from '../../components/home/NotificationsModal';

export default function Home() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <View className="flex-1 bg-slate-900">
      <StatusBar style="light" />

      <LinearGradient colors={['#0f172a', '#1e293b']} style={{ flex: 1 }}>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <HomeHeader onOpenNotifications={() => setNotificationsOpen(true)} />

          <WelcomeMessage />

          <ScrollView
            className="px-6"
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <UploadCard />
            <RequiredDocumentsCard />
            <AnalysisResultCard />
            <DefensesCard />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>

      <NotificationsModal
        visible={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </View>
  );
}
