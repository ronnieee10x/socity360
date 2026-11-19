import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const GuardScannerScreen: React.FC = () => {
  const { logout } = useAuth();
  const [passCode, setPassCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeVisitors, setActiveVisitors] = useState<any[]>([]);

  const loadActiveVisitors = async () => {
    try {
      const res = await api.get('/visitors/active');
      setActiveVisitors(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching active visitors', err);
    }
  };

  useEffect(() => {
    loadActiveVisitors();
  }, []);

  const handleVerifyPass = async () => {
    if (!passCode) {
      Alert.alert('Required', 'Please enter 6-digit visitor pass code');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/visitors/check-in', { passCode });
      Alert.alert('Verified & Checked In', `Welcome ${res.data?.data?.visitorName}!`);
      setPassCode('');
      loadActiveVisitors();
    } catch (err: any) {
      Alert.alert('Invalid Pass', err.response?.data?.message || 'Pass not found or expired');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (visitorId: string) => {
    try {
      await api.post(`/visitors/check-out/${visitorId}`);
      Alert.alert('Checked Out', 'Visitor exit recorded successfully');
      loadActiveVisitors();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to check out');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.screenTitle}>Gate Terminal</Text>
          <Text style={styles.societyName}>Security Guard Checkpoint</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* PIN Entry */}
      <View style={styles.card}>
        <Text style={styles.label}>Enter Resident 6-Digit Pass Code</Text>
        <TextInput
          style={styles.pinInput}
          placeholder="000000"
          keyboardType="numeric"
          maxLength={6}
          value={passCode}
          onChangeText={setPassCode}
        />
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={handleVerifyPass}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.actionBtnText}>Verify & Check-In</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Active Visitors List */}
      <Text style={styles.sectionTitle}>
        Active Visitors Inside Campus ({activeVisitors.length})
      </Text>

      {activeVisitors.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No visitors currently on campus</Text>
        </View>
      ) : (
        activeVisitors.map((v) => (
          <View key={v.id} style={styles.visitorCard}>
            <View>
              <Text style={styles.visitorName}>{v.visitorName}</Text>
              <Text style={styles.visitorInfo}>
                Flat {v.flatNumber} • {v.purpose}
              </Text>
              <Text style={styles.visitorPhone}>{v.phoneNumber}</Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => handleCheckOut(v.id)}
            >
              <Text style={styles.checkoutText}>Exit</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8fafc',
    flexGrow: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  societyName: {
    fontSize: 12,
    color: '#64748b',
  },
  logoutText: {
    fontSize: 13,
    color: '#e11d48',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  pinInput: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 12,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 8,
    color: '#4f46e5',
    marginBottom: 16,
  },
  actionBtn: {
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  emptyCard: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#94a3b8',
  },
  visitorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  visitorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  visitorInfo: {
    fontSize: 12,
    color: '#4f46e5',
    fontWeight: '600',
    marginTop: 2,
  },
  visitorPhone: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  checkoutBtn: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  checkoutText: {
    color: '#b91c1c',
    fontWeight: '700',
    fontSize: 12,
  },
});
