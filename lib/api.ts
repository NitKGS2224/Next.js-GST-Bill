export async function api<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch('/api' + path, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(t ? { Authorization: 'Bearer ' + t } : {}) },
  });
  if (res.status === 401 && t) { localStorage.removeItem('token'); window.location.href = '/login'; }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(Array.isArray(data.message) ? data.message[0] : data.message || 'Something went wrong');
  return data;
}
