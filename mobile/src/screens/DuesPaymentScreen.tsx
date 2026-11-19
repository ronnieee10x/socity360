import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const DuesPaymentScreen: React.FC = () => {
  const { logout } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/finance/invoices/my');
      setInvoices(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching resident invoices', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handlePay = async (invoiceId: string) => {
    try {
      setPayingId(invoiceId);
      const res = await api.post('/finance/payments/simulate', {
        invoiceId,
        paymentMethod: 'UPI',
        paymentAccountOrVpa: 'resident@upi'
      });
      const receipt = res.data?.data;
      Alert.alert(
        'Payment Successful!',
        `Receipt No: ${receipt?.receiptNumber}\nTxn: ${receipt?.transactionReference}\nAmount: ₹${receipt?.amountPaid}`
      );
      loadInvoices();
    } catch (err: any) {
      Alert.alert('Payment Error', err.response?.data?.message || 'Transaction failed');
    } finally {
      setPayingId(null);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.screenTitle}>Maintenance Dues</Text>
          <Text style={styles.subTitle}>Society Assessment Portal</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4f46e5" style={{ marginTop: 40 }} />
      ) : invoices.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No invoices found for your residence</Text>
        </View>
      ) : (
        invoices.map((inv) => (
          <View key={inv.id} style={styles.invoiceCard}>
            <View style={styles.invoiceHeader}>
              <Text style={styles.invNo}>{inv.invoiceNumber}</Text>
              <Text
                style={[
                  styles.statusBadge,
                  inv.status === 'PAID' ? styles.paidBg : styles.unpaidBg,
                ]}
              >
                {inv.status}
              </Text>
            </View>

            <Text style={styles.monthTitle}>{inv.billingMonth} Maintenance</Text>
            <Text style={styles.flatInfo}>
              Flat {inv.flatNumber} ({inv.buildingName})
            </Text>

            <View style={styles.amountRow}>
              <View>
                <Text style={styles.amountLabel}>Total Amount</Text>
                <Text style={styles.amountValue}>
                  ₹{Number(inv.totalAmount || inv.amount).toLocaleString()}
                </Text>
              </View>

              {inv.status === 'PAID' ? (
                <Text style={styles.receiptTag}>Receipt: {inv.receiptNumber}</Text>
              ) : (
                <TouchableOpacity
                  style={styles.payBtn}
                  onPress={() => handlePay(inv.id)}
                  disabled={payingId === inv.id}
                >
                  {payingId === inv.id ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <Text style={styles.payBtnText}>Pay Online</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
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
  subTitle: {
    fontSize: 12,
    color: '#64748b',
  },
  logoutText: {
    fontSize: 13,
    color: '#e11d48',
    fontWeight: '600',
  },
  emptyCard: {
    padding: 30,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
  },
  invoiceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  invNo: {
    fontFamily: 'monospace',
    fontWeight: '700',
    fontSize: 11,
    color: '#64748b',
  },
  statusBadge: {
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  paidBg: {
    backgroundColor: '#ecfdf5',
    color: '#047857',
  },
  unpaidBg: {
    backgroundColor: '#fef3c7',
    color: '#b45309',
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  flatInfo: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 14,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
  amountLabel: {
    fontSize: 11,
    color: '#94a3b8',
  },
  amountValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  payBtn: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  payBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  receiptTag: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
});
