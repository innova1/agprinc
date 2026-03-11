// Update BASE_URL to point to your deployed backend or local dev server
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v2';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}

export const api = {
  getFrameworks: () => request('/frameworks'),

  getItems: (framework, type) => {
    const params = new URLSearchParams();
    if (framework) params.set('framework', framework);
    if (type) params.set('type', type);
    return request(`/items?${params}`);
  },

  getItem: (framework, type, id) => request(`/items/${framework}/${type}/${id}`),

  search: (keywords, matchType = 'ANY') =>
    request(`/search?keywords=${encodeURIComponent(keywords.join(','))}&matchType=${matchType}`),

  getSuggestions: (partial) => request(`/suggestions?partial=${encodeURIComponent(partial)}`),

  getKeywordsMap: () => request('/keywordsmap'),

  updateKeywords: (framework, type, id, keywords) =>
    request(`/items/${framework}/${type}/${id}/keywords`, {
      method: 'PUT',
      body: JSON.stringify({ keywords }),
    }),
};
