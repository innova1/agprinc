// Relative URL — works in dev via Vite proxy and in production on the same origin
const BASE = '/api/v2';

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
