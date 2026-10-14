'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { money } from '@/lib/calc';

export default function Dashboard() {
  const [list, setList] = useState<any[] | null>(null);
  const [q, setQ] = useState('');
  useEffect(() => { api('/invoices').then(setList).catch(() => setList([])); }, []);
  async function del(id: string) {
    if (!confirm('Delete this bill?')) return;
    setList((l) => (l || []).filter((x) => x._id !== id));
    api('/invoices/' + id, { method: 'DELETE' });
  }
  const rows = (list || []).filter((x) => (x.no + ' ' + (x.customer?.name || '')).toLowerCase().includes(q.toLowerCase()));
  const total = rows.reduce((s, x) => s + (x.totals?.grand || 0), 0);
  return (
    <div className="card">
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <h2 style={{ margin: 0, marginRight: 'auto' }}>Bills</h2>
        <input style={{ maxWidth: 220 }} placeholder="Search bill or customer" value={q} onChange={(e) => setQ(e.target.value)} />
        <Link className="btn" href="/invoice/new">+ New bill</Link>
      </div>
      <div className="scroll" style={{ marginTop: 12 }}>
        {list === null ? <p>Loading...</p> : rows.length === 0 ? <p>No bills yet. Create your first bill.</p> : (
          <table>
            <thead><tr><th>Bill no</th><th>Date</th><th>Customer</th><th>Payment</th><th className="r">Total</th><th></th></tr></thead>
            <tbody>
              {rows.map((x) => (
                <tr key={x._id}>
                  <td><Link href={'/invoice/' + x._id}>{x.no}</Link></td><td>{x.date}</td><td>{x.customer?.name}</td><td>{x.payment}</td>
                  <td className="r">{money(x.totals?.grand)}</td>
                  <td><button className="btn red" onClick={() => del(x._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr><td colSpan={4}><b>Total of shown bills</b></td><td className="r"><b>{money(total)}</b></td><td></td></tr></tfoot>
          </table>
        )}
      </div>
    </div>
  );
}
