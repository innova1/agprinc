import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { api } from '../services/api';

const COLORS = { primary: '#2c5f8a', accent: '#5ba3d9', bg: '#f4f7fa', card: '#fff', text: '#1a2b3c', sub: '#6b7c93' };

export default function HomeScreen({ navigation }) {
  const [frameworks, setFrameworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadFrameworks = useCallback(async () => {
    try {
      setError(null);
      const data = await api.getFrameworks();
      setFrameworks(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadFrameworks(); }, [loadFrameworks]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={loadFrameworks}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Select a framework to explore its principles and values</Text>
      <FlatList
        data={frameworks}
        keyExtractor={(item) => item.framework}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadFrameworks(); }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Framework', { framework: item.framework, frameworkdisplay: item.frameworkdisplay })}
            activeOpacity={0.75}
          >
            <View style={styles.cardAccent} />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item.frameworkdisplay}</Text>
              <Text style={styles.cardArrow}>›</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg },
  subtitle: { fontSize: 14, color: COLORS.sub, margin: 16, marginBottom: 8 },
  list: { padding: 16, paddingTop: 4 },
  card: {
    backgroundColor: COLORS.card, borderRadius: 10, marginBottom: 12,
    flexDirection: 'row', elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  cardAccent: { width: 6, backgroundColor: COLORS.accent, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 },
  cardBody: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18 },
  cardTitle: { fontSize: 17, fontWeight: '600', color: COLORS.text },
  cardArrow: { fontSize: 22, color: COLORS.sub },
  errorText: { color: '#c0392b', fontSize: 15, marginBottom: 16, textAlign: 'center', paddingHorizontal: 20 },
  retryBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: '600' },
});
