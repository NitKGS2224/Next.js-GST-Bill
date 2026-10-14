'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Item, blank, line, money, sum, words } from '@/lib/calc';

const cols: [keyof Item, string, number][] = [
  ['qty', 'Qty', 60], ['pack', 'Pack', 70], ['product', 'Product', 180], ['mrp', 'MRP', 80], ['mdis', 'MRP Discount %', 80],
  ['rate', 'Rate', 80], ['rdis', 'Rate Discount %', 80], ['sgst', 'SGST %', 60], ['cgst', 'CGST %', 60],
];
const text = ['product', 'pack', 'remarks'];

export default function NewInvoice() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([blank()]);
  const [c, setC] = useState({ name: '', phone: '', gstin: '', address: '' });
  const [payment, setPayment] = useState('CASH');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const t = sum(items);

  const set = (n: number, k: keyof Item, v: string) =>
    setItems((a) => a.map((x, i) => {
      if (i !== n) return x;
      const y: any = { ...x, [k]: text.includes(k) ? v : parseFloat(v) || 0 };
      if ((k === 'mrp' || k === 'mdis') && y.mrp > 0) y.rate = +(y.mrp * (1 - y.mdis / 100)).toFixed(2);
      return y;
    }));

  async function save() {
    setBusy(true); setErr('');
    try {
      const d = await api('/invoices', { method: 'POST', body: JSON.stringify({ customer: c, items, payment, date }) });
      router.push('/invoice/' + d._id);
    } catch (x: any) { setErr(x.message); setBusy(false); }
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>New bill</h2>
      <div className="grid">
        <label>Customer name<input value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} /></label>
        <label>Mobile<input value={c.phone} onChange={(e) => setC({ ...c, phone: e.target.value })} /></label>
        <label>GSTIN<input value={c.gstin} onChange={(e) => setC({ ...c, gstin: e.target.value })} /></label>
        <label>Address<input value={c.address} onChange={(e) => setC({ ...c, address: e.target.value })} /></label>
        <label>Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
        <label>Payment<select value={payment} onChange={(e) => setPayment(e.target.value)}><option>CASH</option><option>CREDIT</option><option>UPI</option></select></label>
      </div>

      <div className="scroll" style={{ marginTop: 14 }}>
        <table style={{ minWidth: 1050 }}>
          <thead><tr><th>Sr. No</th>{cols.map((x) => <th key={x[0]}>{x[1]}</th>)}<th>Amount</th><th>Remarks</th><th></th></tr></thead>
          <tbody>
            {items.map((it, n) => (
              <tr key={n}>
                <td>{n + 1}</td>
                {cols.map(([k, , w]) => (
                  <td key={k}><input style={{ width: w }} type={text.includes(k) ? 'text' : 'number'} step="any" min="0"
                    value={(it[k] as any) || ''} onChange={(e) => set(n, k, e.target.value)} /></td>
                ))}
                <td className="r"><b>{money(line(it).amount)}</b></td>
                <td><input style={{ width: 110 }} value={it.remarks} onChange={(e) => set(n, 'remarks', e.target.value)} /></td>
                <td><button className="btn red" onClick={() => setItems((a) => (a.length > 1 ? a.filter((_, i) => i !== n) : a))}>x</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p><button className="btn ghost" onClick={() => setItems((a) => [...a, blank()])}>+ Add item</button></p>

      <table className="tot">
        <tbody>
          <tr><td>Total discount</td><td className="r">{money(t.disc)}</td></tr>
          <tr><td>Sub total</td><td className="r">{money(t.sub)}</td></tr>
          <tr><td>SGST</td><td className="r">{money(t.sgst)}</td></tr>
          <tr><td>CGST</td><td className="r">{money(t.cgst)}</td></tr>
          <tr><td>Round off</td><td className="r">{money(t.round)}</td></tr>
          <tr><td><b>Grand total</b></td><td className="r"><b>{money(t.grand)}</b></td></tr>
        </tbody>
      </table>
      <p style={{ textAlign: 'right', fontStyle: 'italic' }}>Rs. {words(t.grand)} only</p>
      {err && <div className="err">{err}</div>}
      <button className="btn" disabled={busy} onClick={save}>{busy ? 'Saving...' : 'Save & view bill'}</button>
    </div>
  );
}
