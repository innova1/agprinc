import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { api } from '../services/api';

const C = {
  valueBg: '#aaddf7',
  principleBg: '#99e7cc',
  link: '#337ab7',
  navBg: '#f8f8f8',
  navBorder: '#e7e7e7',
  panelBorder: '#ddd',
  panelHeadingBg: '#f5f5f5',
  text: '#333',
  white: '#fff',
  muted: '#777',
};

export default function MainScreen() {
  const [frameworks, setFrameworks] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedFramework, setSelectedFramework] = useState('all');
  const [activeTerms, setActiveTerms] = useState([]);
  const [matchType, setMatchType] = useState('any');
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  // Prevents blur from closing the dropdown while a suggestion is being pressed
  const pressingRef = useRef(false);

  useEffect(() => {
    api.getFrameworks()
      .then(data => {
        const order = ['all', 'manifesto', 'modern', 'safe', 'dad', 'dadmanifesto', 'dad+', 'lean'];
        const all = [{ framework: 'all', frameworkdisplay: 'All' }, ...data];
        all.sort((a, b) => {
          const ai = order.indexOf(a.framework);
          const bi = order.indexOf(b.framework);
          return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
        });
        setFrameworks(all);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    loadItems(selectedFramework, activeTerms, matchType);
  }, [selectedFramework, activeTerms, matchType]);

  async function loadItems(fw, terms, mt) {
    setLoading(true);
    try {
      let data;
      if (terms.length > 0) {
        data = await api.search(terms, mt.toUpperCase());
        if (fw !== 'all') data = data.filter(i => i.framework === fw);
      } else {
        data = fw === 'all' ? await api.getItems() : await api.getItems(fw);
      }
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function handleSearchInput(text) {
    setSearchText(text);
    clearTimeout(debounceRef.current);
    if (text.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const s = await api.getSuggestions(text);
        const filtered = s.filter(k => !activeTerms.includes(k));
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } catch { /* ignore */ }
    }, 200);
  }

  function handleBlur() {
    // If the user is mid-press on a suggestion, don't close yet
    setTimeout(() => {
      if (!pressingRef.current) setShowSuggestions(false);
    }, 100);
  }

  function addTerm(term) {
    pressingRef.current = false;
    if (activeTerms.includes(term)) return;
    setActiveTerms(prev => [...prev, term]);
    setSearchText('');
    setSuggestions([]);
    setShowSuggestions(false);
  }

  function removeTerm(term) {
    setActiveTerms(prev => {
      const next = prev.filter(t => t !== term);
      if (next.length <= 1) setMatchType('any');
      return next;
    });
  }

  function selectFramework(fw) {
    setSelectedFramework(prev => (prev === fw && fw !== 'all') ? 'all' : fw);
  }

  function toggleMatchType() {
    setMatchType(prev => prev === 'any' ? 'all' : 'any');
  }

  const noItemsMessage = activeTerms.length === 0
    ? 'There are no items'
    : activeTerms.length === 1
    ? 'No items match this search word'
    : `No items match ${matchType === 'all' ? 'all of' : 'any of'} these search words`;

  return (
    <View style={styles.root}>

      {/* ── Navbar ── */}
      <View style={styles.navbar}>
        <View style={styles.navInner}>
          <Text style={styles.brand}>Agile Values and Principles</Text>

          <View style={styles.searchRow}>
            {/* ANY/ALL toggle — only visible with >1 active term */}
            {activeTerms.length > 1 && (
              <TouchableOpacity style={styles.matchBtn} onPress={toggleMatchType}>
                <Text style={styles.matchBtnText}>{matchType.toUpperCase()}</Text>
              </TouchableOpacity>
            )}

            {/* Search input + suggestions dropdown */}
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.searchInput}
                value={searchText}
                onChangeText={handleSearchInput}
                placeholder="Search Text"
                placeholderTextColor={C.muted}
                onBlur={handleBlur}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              />
              {showSuggestions && (
                <View style={styles.dropdown}>
                  <View style={styles.dropdownHeader}>
                    <Text style={styles.dropdownHeaderText}>Suggestions</Text>
                  </View>
                  <View style={styles.dropdownBody}>
                    {suggestions.map(s => (
                      <TouchableOpacity
                        key={s}
                        onPressIn={() => { pressingRef.current = true; }}
                        onPress={() => addTerm(s)}
                        style={styles.suggestionItem}
                      >
                        <Text style={styles.suggestionText}>{s}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Active search terms — click to remove */}
            {activeTerms.map(term => (
              <TouchableOpacity key={term} onPress={() => removeTerm(term)} style={styles.activeTerm}>
                <Text style={styles.activeTermText}>⊗ {term}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* ── 3-column content ── */}
      <View style={styles.mainRow}>
        <View style={styles.mainContainer}>

        {/* Left — Framework selector */}
        <View style={styles.leftCol}>
          <View style={styles.panel}>
            <View style={styles.panelHeadingPrimary}>
              <Text style={styles.panelTitleWhite}>Frameworks</Text>
            </View>
            <View style={styles.listGroup}>
              {frameworks.map(fw => (
                <TouchableOpacity
                  key={fw.framework}
                  style={styles.listGroupItem}
                  onPress={() => selectFramework(fw.framework)}
                >
                  <Text style={[
                    styles.frameworkLink,
                    selectedFramework === fw.framework && styles.frameworkSelected,
                  ]}>
                    {fw.frameworkdisplay}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Center — Principles / Values */}
        <ScrollView style={styles.centerCol} contentContainerStyle={styles.centerContent}>
          {loading ? (
            <ActivityIndicator size="large" color={C.link} style={{ marginTop: 40 }} />
          ) : items.length === 0 ? (
            <View style={[styles.panel, styles.panelPrimary]}>
              <View style={styles.panelHeadingPrimary}>
                <Text style={styles.panelTitleWhite}>{noItemsMessage}</Text>
              </View>
              <View style={styles.panelBody} />
            </View>
          ) : (
            items.map(item => (
              <View
                key={`${item.framework}-${item.type}-${item.id}`}
                style={[styles.panel, styles.panelPrimary]}
              >
                <View style={[
                  styles.panelHeading,
                  item.type === 'value' ? styles.valueHeading : styles.principleHeading,
                ]}>
                  <Text style={styles.panelTitle}>
                    {item.frameworkdisplay} {item.type} {item.id}
                  </Text>
                </View>
                <View style={styles.panelBody}>
                  <Text style={styles.itemText}>{item.text}</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* Right — About */}
        <View style={styles.rightCol}>
          <View style={styles.panel}>
            <View style={styles.panelHeadingDefault}>
              <Text style={styles.panelTitleDefault}>About</Text>
            </View>
            <View style={styles.panelBody}>
              <Text style={styles.aboutText}>
                Designed and coded by{'\n'}
                <Text style={styles.link}>Tom Boulet</Text>
              </Text>
            </View>
          </View>
        </View>

        </View>{/* end mainContainer */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.white },

  // ── Navbar ──
  navbar: {
    backgroundColor: C.navBg,
    borderBottomWidth: 1,
    borderBottomColor: C.navBorder,
    minHeight: 50,
    zIndex: 50,
  },
  navInner: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    paddingVertical: 5,
    maxWidth: 1170,
    alignSelf: 'center',
    width: '100%',
  },
  brand: {
    color: C.link,
    fontSize: 20,
    lineHeight: 22,
    paddingVertical: 10,
    marginRight: 20,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 4,
    columnGap: 6,
    rowGap: 4,
    flexWrap: 'wrap',
  },
  matchBtn: {
    backgroundColor: C.link,
    borderWidth: 1,
    borderColor: C.link,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  matchBtnText: {
    color: C.white,
    fontSize: 12,
    fontFamily: 'monospace',
  },

  // Input + dropdown wrapper — must be positioned so dropdown overlays content below
  inputWrap: {
    position: 'relative',
    zIndex: 999,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: C.panelBorder,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,
    color: C.text,
    backgroundColor: C.white,
    minWidth: 180,
  },
  dropdown: {
    position: 'absolute',
    top: 34,           // pixel offset below the input (input height ≈ 34px)
    left: 0,
    minWidth: 220,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.panelBorder,
    borderRadius: 4,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 8,
  },
  dropdownHeader: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: C.panelHeadingBg,
    borderBottomWidth: 1,
    borderBottomColor: C.panelBorder,
  },
  dropdownHeaderText: { fontSize: 14, color: C.text },
  dropdownBody: { paddingVertical: 6, paddingHorizontal: 10 },
  suggestionItem: { paddingVertical: 5 },
  suggestionText: { color: C.link, fontSize: 14 },

  activeTerm: { paddingHorizontal: 2 },
  activeTermText: { color: C.link, fontSize: 14 },

  // ── Main row ──
  mainRow: { flex: 1 },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    maxWidth: 1170,
    width: '100%',
    alignSelf: 'center',
  },

  // ── Columns ──
  leftCol:   { width: 180, padding: 15, paddingRight: 7 },
  centerCol: { flex: 1 },
  centerContent: { paddingVertical: 15, paddingHorizontal: 7 },
  rightCol:  { width: 180, padding: 15, paddingLeft: 7 },

  // ── Bootstrap-style panels ──
  panel: {
    borderWidth: 1,
    borderColor: C.panelBorder,
    borderRadius: 4,
    marginBottom: 20,
    backgroundColor: C.white,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
  },
  panelPrimary: { borderColor: C.link },
  panelHeading: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  panelHeadingPrimary: {
    backgroundColor: C.link,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  panelHeadingDefault: {
    backgroundColor: C.panelHeadingBg,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    borderBottomWidth: 1,
    borderBottomColor: C.panelBorder,
  },
  valueHeading:     { backgroundColor: C.valueBg },
  principleHeading: { backgroundColor: C.principleBg },
  panelTitleWhite:  { fontSize: 16, fontWeight: '500', color: C.white },
  panelTitleDefault:{ fontSize: 16, fontWeight: '500', color: C.text },
  panelTitle:       { fontSize: 16, fontWeight: '500', color: C.text },
  panelBody:        { padding: 15 },
  itemText:         { fontSize: 14, color: C.text, lineHeight: 20 },

  // ── Framework list ──
  listGroup: {},
  listGroupItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: C.panelBorder,
  },
  frameworkLink:    { fontSize: 14, color: C.link },
  frameworkSelected:{ fontWeight: 'bold', fontSize: 15 },

  // ── About ──
  aboutText: { fontSize: 14, color: C.text, textAlign: 'center' },
  link:      { color: C.link },
});
