import { useState, useEffect, useRef } from 'react';
import { api } from './services/api';

const FRAMEWORK_ORDER = ['all', 'manifesto', 'modern', 'cynefin', 'lean', 'xp', 'scrum', 'safe', 'dad', 'dad+', 'dadmanifesto'];

export default function App() {
  const [frameworks, setFrameworks]           = useState([]);
  const [items, setItems]                     = useState([]);
  const [selectedFramework, setSelectedFramework] = useState('all');
  const [activeTerms, setActiveTerms]         = useState([]);
  const [matchType, setMatchType]             = useState('any');
  const [searchText, setSearchText]           = useState('');
  const [suggestions, setSuggestions]         = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [menuOpen, setMenuOpen]               = useState(false);
  const debounceRef  = useRef(null);
  const pressingRef  = useRef(false);

  // Load frameworks once
  useEffect(() => {
    api.getFrameworks().then(data => {
      const all = [{ framework: 'all', frameworkdisplay: 'All' }, ...data];
      all.sort((a, b) => {
        const ai = FRAMEWORK_ORDER.indexOf(a.framework);
        const bi = FRAMEWORK_ORDER.indexOf(b.framework);
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      });
      setFrameworks(all);
    }).catch(console.error);
  }, []);

  // Reload items whenever framework, terms, or matchType changes
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
        data = await api.getItems(fw === 'all' ? null : fw);
      }
      data.sort((a, b) => {
        const ai = FRAMEWORK_ORDER.indexOf(a.framework);
        const bi = FRAMEWORK_ORDER.indexOf(b.framework);
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      });
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function handleSearchInput(e) {
    const text = e.target.value;
    setSearchText(text);
    clearTimeout(debounceRef.current);
    if (text.length < 3) { setSuggestions([]); setShowSuggestions(false); return; }
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
    setTimeout(() => { if (!pressingRef.current) setShowSuggestions(false); }, 150);
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
    setMenuOpen(false);
  }

  function toggleMatchType() {
    setMatchType(prev => prev === 'any' ? 'all' : 'any');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && suggestions.length > 0) {
      addTerm(suggestions[0]);
    }
  }

  const noItemsMsg = activeTerms.length === 0
    ? 'There are no items'
    : activeTerms.length === 1
    ? 'No items match this search word'
    : `No items match ${matchType === 'all' ? 'all of' : 'any of'} these search words`;

  return (
    <div className="app">

      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="container">
          <div className="navbar-header">
            <div className="navbar-brand">
              <span className="navbar-breadcrumb">
                <a href="https://tomboulet.com">← tomboulet.com</a>
              </span>
              <span className="navbar-title">Agile Values and Principles</span>
            </div>
            {/* Hamburger for mobile — toggles framework menu */}
            <button className="nav-toggle" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
              ☰
            </button>
          </div>

          <div className="navbar-search">
            {activeTerms.length > 1 && (
              <button className="match-btn" onClick={toggleMatchType}>
                {matchType.toUpperCase()}
              </button>
            )}

            <div className="input-wrap">
              <input
                type="text"
                className="search-input"
                value={searchText}
                onChange={handleSearchInput}
                onBlur={handleBlur}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                placeholder="Keyword Search"
                autoComplete="off"
              />
              {showSuggestions && (
                <div className="dropdown">
                  <div className="dropdown-header">Suggestions</div>
                  <div className="dropdown-body">
                    {suggestions.map(s => (
                      <div
                        key={s}
                        className="suggestion-item"
                        onMouseDown={() => { pressingRef.current = true; }}
                        onClick={() => addTerm(s)}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {activeTerms.map(term => (
              <button key={term} className="active-term" onClick={() => removeTerm(term)}>
                ⊗ {term}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Main content ── */}
      <div className="container main-row">

        {/* Left — Frameworks */}
        <div className={`col-left${menuOpen ? ' open' : ''}`}>
          <div className="panel">
            <div className="panel-heading panel-heading-primary">
              <span className="panel-title">Frameworks</span>
            </div>
            <ul className="list-group">
              {frameworks.map(fw => (
                <li
                  key={fw.framework}
                  className={`list-group-item${selectedFramework === fw.framework ? ' selected' : ''}`}
                  onClick={() => selectFramework(fw.framework)}
                >
                  {fw.frameworkdisplay}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Center — Items */}
        <div className="col-center">
          {loading ? (
            <div className="loading">Loading…</div>
          ) : items.length === 0 ? (
            <div className="panel panel-primary">
              <div className="panel-heading panel-heading-primary">
                <span className="panel-title">{noItemsMsg}</span>
              </div>
              <div className="panel-body" />
            </div>
          ) : (
            items.map(item => (
              <div key={`${item.framework}-${item.type}-${item.id}`} className="panel panel-primary">
                <div className={`panel-heading panel-heading-${item.type}`}>
                  <span className="panel-title">
                    {item.frameworkdisplay} {item.type} {item.id}
                  </span>
                </div>
                <div className="panel-body">
                  <div className="item-text" dangerouslySetInnerHTML={{ __html: item.text }} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right — About */}
        <div className="col-right">
          <div className="panel">
            <div className="panel-heading panel-heading-default">
              <span className="panel-title">About</span>
            </div>
            <div className="panel-body center">
              <p>Designed and coded by <a className="plain" href="https://www.linkedin.com/in/tomboulet/">Tom Boulet</a></p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
