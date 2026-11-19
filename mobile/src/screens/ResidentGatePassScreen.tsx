import React, { useState } from 'react';
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

export const ResidentGatePassScreen: React.FC = () => {
  const { logout } = useAuth();
  const [visitorName, setVisitorName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [purpose, setPurpose] = useState('GUEST');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedPass, setGeneratedPass] = useState<any>(null);

  const handleCreatePass = async () => {
    if (!visitorName || !phoneNumber) {
      Alert.alert('Required', 'Please fill visitor name and contact number');
      return;
    }

    try {
      setLoading(true);
      // Fetch user's flat
      const occRes = await api.get('/residents/my-occupancy');
      const occ = occRes.data?.data;
      if (!occ?.flatId) {
        Alert.alert('No Flat', 'You must have an approved flat occupancy.');
        return;
      }

      const res = await api.post('/visitors/pre-approve', {
        flatId: occ.flatId,
        visitorName,
        phoneNumber,
        purpose,
        vehicleNumber,
      });

      setGeneratedPass(res.data?.data);
      setVisitorName('');
      setPhoneNumber('');
      setVehicleNumber('');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to generate pass');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.screenTitle}>Guest Gate Pass</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {generatedPass && (
        <View style={styles.passBox}>
          <Text style={styles.passTitle}>Guest Pass Generated!</Text>
          <Text style={styles.passCode}>{generatedPass.passCode}</Text>
          <Text style={styles.passDesc}>
            Share this 6-digit PIN with {generatedPass.visitorName} for fast-track gate entry.
          </Text>
          <TouchableOpacity
            style={styles.dismissBtn}
            onPress={() => setGeneratedPass(null)}
          >
            <Text style={styles.dismissBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.label}>Visitor Full Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Ananya Roy"
          value={visitorName}
          onChangeText={setVisitorName}
        />

        <Text style={styles.label}>Mobile Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="+91 98765 43210"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <Text style={styles.label}>Vehicle Number (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="MH 12 AB 1234"
          value={vehicleNumber}
          onChangeText={setVehicleNumber}
        />

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={handleCreatePass}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.actionBtnText}>Generate 6-Digit Passcode</Text>
          )}
        </TouchableOpacity>
      </View>
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
  logoutText: {
    fontSize: 13,
    color: '#e11d48',
    fontWeight: '600',
  },
  passBox: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  passTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065f46',
  },
  passCode: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 4,
    color: '#047857',
    marginVertical: 10,
  },
  passDesc: {
    fontSize: 12,
    color: '#065f46',
    textAlign: 'center',
    lineHeight: 18,
  },
  dismissBtn: {
    marginTop: 14,
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dismissBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 16,
  },
  actionBtn: {
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  actionBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
});
