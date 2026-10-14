'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function Settings() {
  const [f, setF] = useState<any>({ shopName: '', gstin: '', address: '', phone: '' });
  const [msg, setMsg] = useState('');
  useEffect(() => { api('/auth/me').then((u) => setF({ shopName: u.shopName || '', gstin: u.gstin || '', address: u.address || '', phone: u.phone || '' })).catch(() => {}); }, []);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    try { await api('/auth/me', { method: 'PUT', body: JSON.stringify(f) }); setMsg('Saved'); } catch (x: any) { setMsg(x.message); }
  }
  const inp = (k: string, l: string) => <label>{l}<input value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></label>;
  return (
    <form className="card" style={{ maxWidth: 500 }} onSubmit={save}>
      <h2>Shop details (printed on every bill)</h2>
      {inp('shopName', 'Shop name')}{inp('gstin', 'GSTIN')}{inp('address', 'Address')}{inp('phone', 'Phone')}
      <p><button className="btn">Save</button> {msg}</p>
    </form>
  );
}
