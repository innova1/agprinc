import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const COLORS = { primary: '#2c5f8a', accent: '#5ba3d9', bg: '#f4f7fa', card: '#fff', text: '#1a2b3c', sub: '#6b7c93' };

export default function DetailScreen({ route }) {
  const { item } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.framework}>{item.frameworkdisplay}</Text>
        <View style={styles.meta}>
          <View style={[styles.badge, item.type === 'value' && styles.valueBadge]}>
            <Text style={[styles.badgeText, item.type === 'value' && styles.valueBadgeText]}>
              {item.type === 'value' ? 'Value' : 'Principle'} #{item.id}
            </Text>
          </View>
        </View>
        <Text style={styles.shortdesc}>{item.shortdescription}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>FULL TEXT</Text>
        <Text style={styles.mainText}>{item.text}</Text>
      </View>

      {item.keywords && item.keywords.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.label}>KEYWORDS</Text>
          <View style={styles.tags}>
            {item.keywords.map((kw) => (
              <View key={kw} style={styles.tag}>
                <Text style={styles.tagText}>{kw}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 16 },
  header: { marginBottom: 16 },
  framework: { fontSize: 13, color: COLORS.sub, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  meta: { flexDirection: 'row', marginBottom: 10 },
  badge: { backgroundColor: '#e8f0fe', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  valueBadge: { backgroundColor: '#fef3e2' },
  valueBadgeText: { color: '#e67e22' },
  shortdesc: { fontSize: 22, fontWeight: '700', color: COLORS.text, lineHeight: 30 },
  card: {
    backgroundColor: COLORS.card, borderRadius: 12, padding: 18, marginBottom: 14,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  label: { fontSize: 11, fontWeight: '700', color: COLORS.sub, letterSpacing: 1.2, marginBottom: 10 },
  mainText: { fontSize: 17, color: COLORS.text, lineHeight: 28 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { backgroundColor: '#e8f0fe', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  tagText: { fontSize: 13, color: COLORS.primary, fontWeight: '500' },
});
