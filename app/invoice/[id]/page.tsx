'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { line, money, words } from '@/lib/calc';

export default function View() {
  const { id } = useParams<{ id: string }>();
  const [inv, setInv] = useState<any>(null);
  const [me, setMe] = useState<any>({});
  const [err, setErr] = useState('');
  useEffect(() => {
    Promise.all([api('/invoices/' + id), api('/auth/me')]).then(([a, b]) => { setInv(a); setMe(b); }).catch((e) => setErr(e.message));
  }, [id]);
  if (err) return <p className="err">{err}</p>;
  if (!inv) return <p>Loading...</p>;
  const t = inv.totals, c = inv.customer || {};
  return (
    <>
      <p className="noprint">
        <button className="btn" onClick={() => window.print()}>Print / Save as PDF</button>{' '}
        <Link className="btn ghost" href="/invoice/new">New bill</Link>{' '}
        <Link className="btn ghost" href="/dashboard">All bills</Link>
      </p>
      <div className="card">
        <div className="grid">
          <div><b style={{ fontSize: 18 }}>{me.shopName}</b><br />{me.address}<br />Phone: {me.phone}<br />GSTIN: {me.gstin}</div>
          <div><b>Bill to:</b> {c.name}<br />{c.address}<br />Phone: {c.phone}<br />GSTIN: {c.gstin}</div>
          <div>Invoice no: <b>{inv.no}</b><br />Date: {inv.date}<br />Payment: {inv.payment}</div>
        </div>
        <div className="title">GST INVOICE</div>
        <div className="scroll">
          <table>
            <thead><tr><th>Sr. No</th><th>Qty</th><th>Pack</th><th>Product</th><th className="r">MRP</th><th className="r">MRP Disc %</th><th className="r">Rate</th><th className="r">Rate Disc %</th><th className="r">SGST %</th><th className="r">CGST %</th><th className="r">Amount</th><th>Remarks</th></tr></thead>
            <tbody>
              {inv.items.map((i: any, n: number) => (
                <tr key={n}><td>{n + 1}</td><td>{i.qty}</td><td>{i.pack}</td><td>{i.product}</td><td className="r">{money(i.mrp)}</td><td className="r">{i.mdis}</td>
                  <td className="r">{money(i.rate)}</td><td className="r">{i.rdis}</td><td className="r">{i.sgst}</td><td className="r">{i.cgst}</td>
                  <td className="r">{money(line(i).amount)}</td><td>{i.remarks}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <table className="tot" style={{ marginTop: 12 }}>
          <tbody>
            <tr><td>Total discount</td><td className="r">{money(t.disc)}</td></tr>
            <tr><td>Sub total</td><td className="r">{money(t.sub)}</td></tr>
            <tr><td>SGST payable</td><td className="r">{money(t.sgst)}</td></tr>
            <tr><td>CGST payable</td><td className="r">{money(t.cgst)}</td></tr>
            <tr><td>Round off</td><td className="r">{money(t.round)}</td></tr>
            <tr><td><b>Grand total</b></td><td className="r"><b>{money(t.grand)}</b></td></tr>
          </tbody>
        </table>
        <p style={{ fontStyle: 'italic' }}>Rs. {words(t.grand)} only</p>
        <p style={{ fontSize: 12 }}>Goods once sold will not be taken back or exchanged.</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}><span>Receiver</span><span>For {me.shopName}</span></div>
      </div>
    </>
  );
}
