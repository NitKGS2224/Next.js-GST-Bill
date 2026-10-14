'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';

export default function Login() {
  const router = useRouter();
  const [reg, setReg] = useState(false);
  const [f, setF] = useState({ email: '', password: '', shopName: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr('');
    try {
      const d = await api(reg ? '/auth/register' : '/auth/login', { method: 'POST', body: JSON.stringify(f) });
      localStorage.setItem('token', d.token);
      router.push(reg ? '/settings' : '/dashboard');
    } catch (x: any) { setErr(x.message); setBusy(false); }
  }
  return (
    <form className="card" style={{ maxWidth: 400, margin: '30px auto' }} onSubmit={submit}>
      <h2>{reg ? 'Create your account' : 'Login'}</h2>
      {reg && <label>Shop name<input required value={f.shopName} onChange={(e) => setF({ ...f, shopName: e.target.value })} /></label>}
      <label>Email<input required type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
      <label>Password (min 6)<input required type="password" minLength={6} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></label>
      {err && <div className="err">{err}</div>}
      <p><button className="btn" disabled={busy}>{busy ? 'Please wait...' : reg ? 'Sign up' : 'Login'}</button></p>
      <button type="button" className="btn ghost" onClick={() => setReg(!reg)}>{reg ? 'I have an account' : 'New shop? Sign up'}</button>
    </form>
  );
}
