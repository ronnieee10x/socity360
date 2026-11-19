import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export const LoginScreen: React.FC = () => {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleManualLogin = async () => {
    if (!email || !password) {
      Alert.alert('Required', 'Please enter both email and password');
      return;
    }
    try {
      setLoading(true);
      await login(email, password);
    } catch (err: any) {
      Alert.alert('Login Failed', err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoPress = async (demoEmail: string) => {
    try {
      setLoading(true);
      await demoLogin(demoEmail);
    } catch (err: any) {
      Alert.alert('Demo Login Failed', err.response?.data?.message || 'Server unreachable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brandTitle}>Society360</Text>
        <Text style={styles.brandSubtitle}>Mobile Resident & Field Operations</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="resident@society.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.loginBtn}
          onPress={handleManualLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.loginBtnText}>Sign In</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.demoHeading}>1-Tap Viva Demo Accounts (Greenfield)</Text>
      <View style={styles.demoGrid}>
        <TouchableOpacity
          style={styles.demoCard}
          onPress={() => handleDemoPress('owner@greenfield.com')}
        >
          <Text style={styles.demoRole}>Flat Owner</Text>
          <Text style={styles.demoEmail}>owner@greenfield.com</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.demoCard}
          onPress={() => handleDemoPress('tenant@greenfield.com')}
        >
          <Text style={styles.demoRole}>Tenant Resident</Text>
          <Text style={styles.demoEmail}>tenant@greenfield.com</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.demoCard}
          onPress={() => handleDemoPress('guard@greenfield.com')}
        >
          <Text style={styles.demoRole}>Security Guard</Text>
          <Text style={styles.demoEmail}>guard@greenfield.com</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.demoCard}
          onPress={() => handleDemoPress('staff@greenfield.com')}
        >
          <Text style={styles.demoRole}>Maintenance Tech</Text>
          <Text style={styles.demoEmail}>staff@greenfield.com</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f8fafc',
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#4f46e5',
  },
  brandSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
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
  loginBtn: {
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  loginBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  demoHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  demoGrid: {
    gap: 10,
  },
  demoCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    borderRadius: 12,
  },
  demoRole: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  demoEmail: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
});
