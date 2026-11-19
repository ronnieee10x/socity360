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

export const MaintenanceTaskScreen: React.FC = () => {
  const { logout } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/complaints/assigned');
      setTasks(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching staff tasks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleStart = async (id: string) => {
    try {
      await api.put(`/complaints/${id}/status`, {
        status: 'IN_PROGRESS',
        resolutionNotes: 'Technician on premise inspecting issue.'
      });
      loadTasks();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to start task');
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await api.put(`/complaints/${id}/status`, {
        status: 'RESOLVED',
        resolutionNotes: 'Repair work completed and verified.'
      });
      Alert.alert('Resolved', 'Maintenance task closed successfully!');
      loadTasks();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to resolve task');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.screenTitle}>Work Orders</Text>
          <Text style={styles.subTitle}>Technician Field Console</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4f46e5" style={{ marginTop: 40 }} />
      ) : tasks.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>All assigned work orders completed!</Text>
        </View>
      ) : (
        tasks.map((task) => (
          <View key={task.id} style={styles.taskCard}>
            <View style={styles.taskHeader}>
              <Text style={styles.ticketNo}>{task.ticketNumber}</Text>
              <Text
                style={[
                  styles.priorityBadge,
                  task.priority === 'URGENT' ? styles.urgentBg : styles.normalBg,
                ]}
              >
                {task.priority}
              </Text>
            </View>

            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskDesc}>{task.description}</Text>

            <View style={styles.locationBox}>
              <Text style={styles.locationText}>
                Flat {task.flatNumber} ({task.buildingName})
              </Text>
              <Text style={styles.residentText}>Resident: {task.createdByName}</Text>
              {task.createdByPhone && (
                <Text style={styles.phoneText}>📞 {task.createdByPhone}</Text>
              )}
            </View>

            <View style={styles.actionRow}>
              {task.status === 'ASSIGNED' && (
                <TouchableOpacity
                  style={styles.startBtn}
                  onPress={() => handleStart(task.id)}
                >
                  <Text style={styles.btnText}>Start Work</Text>
                </TouchableOpacity>
              )}
              {task.status === 'IN_PROGRESS' && (
                <TouchableOpacity
                  style={styles.resolveBtn}
                  onPress={() => handleResolve(task.id)}
                >
                  <Text style={styles.btnText}>Mark Resolved</Text>
                </TouchableOpacity>
              )}
              {task.status === 'RESOLVED' && (
                <Text style={styles.resolvedLabel}>✓ Completed</Text>
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
  taskCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ticketNo: {
    fontFamily: 'monospace',
    fontWeight: '700',
    fontSize: 12,
    color: '#4f46e5',
  },
  priorityBadge: {
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    textTransform: 'uppercase',
  },
  urgentBg: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
  },
  normalBg: {
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  taskDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },
  locationBox: {
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  residentText: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
  },
  phoneText: {
    fontSize: 11,
    color: '#047857',
    marginTop: 2,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  startBtn: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resolveBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  resolvedLabel: {
    color: '#059669',
    fontWeight: '700',
    fontSize: 13,
  },
});
