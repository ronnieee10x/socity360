import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { ResidentGatePassScreen } from './src/screens/ResidentGatePassScreen';
import { GuardScannerScreen } from './src/screens/GuardScannerScreen';
import { MaintenanceTaskScreen } from './src/screens/MaintenanceTaskScreen';
import { DuesPaymentScreen } from './src/screens/DuesPaymentScreen';

const MainNavigator: React.FC = () => {
  const { user, loading } = useAuth();
  const [residentTab, setResidentTab] = useState<'VISITORS' | 'INVOICES'>('VISITORS');

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Initializing Society360...</Text>
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  // Security Guard Terminal
  if (user.role === 'SECURITY_GUARD') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GuardScannerScreen />
      </SafeAreaView>
    );
  }

  // Maintenance Staff Work Orders
  if (user.role === 'MAINTENANCE_STAFF') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <MaintenanceTaskScreen />
      </SafeAreaView>
    );
  }

  // Resident View (Flat Owner & Tenant)
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, residentTab === 'VISITORS' && styles.activeTab]}
          onPress={() => setResidentTab('VISITORS')}
        >
          <Text
            style={[styles.tabLabel, residentTab === 'VISITORS' && styles.activeTabLabel]}
          >
            Gate Passes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, residentTab === 'INVOICES' && styles.activeTab]}
          onPress={() => setResidentTab('INVOICES')}
        >
          <Text
            style={[styles.tabLabel, residentTab === 'INVOICES' && styles.activeTabLabel]}
          >
            Pay Dues
          </Text>
        </TouchableOpacity>
      </View>

      {residentTab === 'VISITORS' ? <ResidentGatePassScreen /> : <DuesPaymentScreen />}
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <MainNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4f46e5',
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabLabel: {
    color: '#4f46e5',
    fontWeight: '700',
  },
});
