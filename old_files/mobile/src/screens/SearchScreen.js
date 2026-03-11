import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView, Keyboard,
} from 'react-native';
import { api } from '../services/api';

const COLORS = { primary: '#2c5f8a', accent: '#5ba3d9', bg: '#f4f7fa', card: '#fff', text: '#1a2b3c', sub: '#6b7c93' };

function ResultCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)} activeOpacity={0.75}>
      <View style={styles.cardMeta}>
        <Text style={styles.fw}>{item.frameworkdisplay}</Text>
        <View style={[styles.badge, item.type === 'value' && styles.valueBadge]}>
          <Text style={[styles.badgeText, item.type === 'value' && styles.valueBadgeText]}>
            {item.type === 'value' ? 'Value' : 'Principle'}
          </Text>
        </View>
      </View>
      <Text style={styles.cardShort}>{item.shortdescription}</Text>
      <Text style={styles.cardText} numberOfLines={2}>{item.text}</Text>
    </TouchableOpacity>
  );
}

export default function SearchScreen({ navigation }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeTerms, setActiveTerms] = useState([]);
  const [matchType, setMatchType] = useState('ANY');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef(null);

  const fetchSuggestions = useCallback((text) => {
    clearTimeout(debounceRef.current);
    if (text.length < 2) { setSuggestions([]); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const s = await api.getSuggestions(text);
        setSuggestions(s.filter((kw) => !activeTerms.includes(kw)));
      } catch { /* ignore */ }
    }, 250);
  }, [activeTerms]);

  const addTerm = (term) => {
    if (activeTerms.includes(term)) return;
    const next = [...activeTerms, term];
    setActiveTerms(next);
    setInput('');
    setSuggestions([]);
    doSearch(next, matchType);
  };

  const removeTerm = (term) => {
    const next = activeTerms.filter((t) => t !== term);
    setActiveTerms(next);
    if (next.length) doSearch(next, matchType);
    else setResults([]);
  };

  const doSearch = async (terms, mt) => {
    if (!terms.length) return;
    setLoading(true);
    setSearched(true);
    Keyboard.dismiss();
    try {
      const data = await api.search(terms, mt);
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleMatchType = () => {
    const next = matchType === 'ANY' ? 'ALL' : 'ANY';
    setMatchType(next);
    if (activeTerms.length) doSearch(activeTerms, next);
  };

  return (
    <View style={styles.container}>
      {/* Search input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={(t) => { setInput(t); fetchSuggestions(t); }}
          placeholder="Type a keyword…"
          placeholderTextColor={COLORS.sub}
          returnKeyType="search"
          onSubmitEditing={() => { if (input.trim()) addTerm(input.trim().toLowerCase()); }}
        />
      </View>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <View style={styles.suggestions}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {suggestions.map((s) => (
              <TouchableOpacity key={s} style={styles.suggChip} onPress={() => addTerm(s)}>
                <Text style={styles.suggText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Active terms + match toggle */}
      {activeTerms.length > 0 && (
        <View style={styles.termsRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
            {activeTerms.map((t) => (
              <TouchableOpacity key={t} style={styles.termChip} onPress={() => removeTerm(t)}>
                <Text style={styles.termText}>{t}  ✕</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={[styles.matchBtn, matchType === 'ALL' && styles.matchBtnActive]} onPress={toggleMatchType}>
            <Text style={[styles.matchText, matchType === 'ALL' && styles.matchTextActive]}>
              {matchType === 'ALL' ? 'ALL' : 'ANY'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Results */}
      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => `${item.framework}-${item.type}-${item.id}`}
          contentContainerStyle={styles.list}
          ListEmptyComponent={searched ? <Text style={styles.empty}>No matching principles found.</Text> : null}
          renderItem={({ item }) => <ResultCard item={item} onPress={(i) => navigation.navigate('FrameworksTab', { screen: 'Detail', params: { item: i } })} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  inputRow: { padding: 16, paddingBottom: 8 },
  input: {
    backgroundColor: COLORS.card, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 16, color: COLORS.text, elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 3, shadowOffset: { width: 0, height: 1 },
  },
  suggestions: { paddingHorizontal: 16, paddingBottom: 8 },
  suggChip: { backgroundColor: '#dbeafe', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 6 },
  suggText: { fontSize: 13, color: COLORS.primary, fontWeight: '500' },
  termsRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 8 },
  termChip: { backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 6 },
  termText: { fontSize: 13, color: '#fff', fontWeight: '600' },
  matchBtn: { borderWidth: 2, borderColor: COLORS.primary, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, marginLeft: 8 },
  matchBtnActive: { backgroundColor: COLORS.primary },
  matchText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  matchTextActive: { color: '#fff' },
  list: { padding: 16, paddingTop: 4 },
  card: {
    backgroundColor: COLORS.card, borderRadius: 10, padding: 14, marginBottom: 10,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 3, shadowOffset: { width: 0, height: 1 },
  },
  cardMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 8 },
  fw: { fontSize: 12, color: COLORS.sub, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  badge: { backgroundColor: '#e8f0fe', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 11, fontWeight: '600', color: COLORS.primary },
  valueBadge: { backgroundColor: '#fef3e2' },
  valueBadgeText: { color: '#e67e22' },
  cardShort: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
  cardText: { fontSize: 13, color: COLORS.sub, lineHeight: 19 },
  empty: { textAlign: 'center', color: COLORS.sub, fontSize: 15, marginTop: 40 },
});
