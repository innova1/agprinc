const BASE = (import.meta.env.VITE_API_BASE_URL || '') + '/api/v2';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export const api = {
  getFrameworks: () => request('/frameworks'),

  getItems: (framework) => {
    const params = framework ? `?framework=${encodeURIComponent(framework)}` : '';
    return request(`/items${params}`);
  },

  search: (keywords, matchType = 'ANY') =>
    request(`/search?keywords=${encodeURIComponent(keywords.join(','))}&matchType=${matchType}`),

  getSuggestions: (partial) =>
    request(`/suggestions?partial=${encodeURIComponent(partial)}`),
};
