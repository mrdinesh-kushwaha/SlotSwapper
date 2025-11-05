const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  try { return JSON.parse(text); } catch(e) {
    if (!res.ok) throw new Error(text || 'API error');
    return text;
  }
}
