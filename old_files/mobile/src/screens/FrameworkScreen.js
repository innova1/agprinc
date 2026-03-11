import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, SectionList,
} from 'react-native';
import { api } from '../services/api';

const COLORS = { primary: '#2c5f8a', accent: '#5ba3d9', bg: '#f4f7fa', card: '#fff', text: '#1a2b3c', sub: '#6b7c93', tag: '#e8f0fe' };

function TypeBadge({ type }) {
  const isValue = type === 'value';
  return (
    <View style={[styles.badge, isValue && styles.valueBadge]}>
      <Text style={[styles.badgeText, isValue && styles.valueBadgeText]}>{isValue ? 'Value' : 'Principle'}</Text>
    </View>
  );
}

export default function FrameworkScreen({ route, navigation }) {
  const { framework } = route.params;
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadItems = useCallback(async () => {
    try {
      setError(null);
      const items = await api.getItems(framework);
      // Group into sections: values first, then principles
      const values = items.filter((i) => i.type === 'value');
      const principles = items.filter((i) => i.type === 'principle');
      const s = [];
      if (values.length) s.push({ title: 'Values', data: values });
      if (principles.length) s.push({ title: 'Principles', data: principles });
      setSections(s);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [framework]);

  useEffect(() => { loadItems(); }, [loadItems]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  if (error) return <View style={styles.center}><Text style={styles.errorText}>{error}</Text></View>;

  return (
    <SectionList
      style={styles.container}
      contentContainerStyle={styles.list}
      sections={sections}
      keyExtractor={(item) => `${item.type}-${item.id}`}
      stickySectionHeadersEnabled
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>
      )}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Detail', { item })}
          activeOpacity={0.75}
        >
          <View style={styles.cardTop}>
            <TypeBadge type={item.type} />
            <Text style={styles.cardNum}>#{item.id}</Text>
          </View>
          <Text style={styles.cardShort}>{item.shortdescription}</Text>
          <Text style={styles.cardText} numberOfLines={3}>{item.text}</Text>
          {item.keywords && item.keywords.length > 0 && (
            <View style={styles.tags}>
              {item.keywords.slice(0, 4).map((kw) => (
                <View key={kw} style={styles.tag}><Text style={styles.tagText}>{kw}</Text></View>
              ))}
              {item.keywords.length > 4 && <Text style={styles.moreText}>+{item.keywords.length - 4} more</Text>}
            </View>
          )}
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingBottom: 16 },
  sectionHeader: { backgroundColor: COLORS.primary, paddingVertical: 8, paddingHorizontal: 16 },
  sectionTitle: { color: '#fff', fontWeight: '700', fontSize: 15, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: {
    backgroundColor: COLORS.card, marginHorizontal: 16, marginTop: 12, borderRadius: 10, padding: 16,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 3, shadowOffset: { width: 0, height: 1 },
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  cardNum: { marginLeft: 'auto', fontSize: 13, color: COLORS.sub },
  badge: { backgroundColor: '#e8f0fe', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  badgeText: { fontSize: 11, fontWeight: '600', color: COLORS.primary },
  valueBadge: { backgroundColor: '#fef3e2' },
  valueBadgeText: { color: '#e67e22' },
  cardShort: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  cardText: { fontSize: 14, color: COLORS.sub, lineHeight: 20 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 4 },
  tag: { backgroundColor: COLORS.tag, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 4 },
  tagText: { fontSize: 11, color: COLORS.primary },
  moreText: { fontSize: 11, color: COLORS.sub, alignSelf: 'center', marginLeft: 4 },
  errorText: { color: '#c0392b', fontSize: 15, textAlign: 'center' },
});
