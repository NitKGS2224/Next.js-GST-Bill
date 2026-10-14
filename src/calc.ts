export const n = (v: any) => (Number.isFinite(+v) ? +v : 0);
export const cleanItem = (i: any) => ({
  product: String(i.product || '').slice(0, 120), pack: String(i.pack || '').slice(0, 30),
  remarks: String(i.remarks || '').slice(0, 120), qty: n(i.qty), mrp: n(i.mrp), mdis: n(i.mdis),
  rate: n(i.rate), rdis: n(i.rdis), sgst: n(i.sgst), cgst: n(i.cgst),
});
export function totals(items: any[]) {
  let disc = 0, sub = 0, sgst = 0, cgst = 0;
  for (const i of items) {
    const gross = i.qty * i.rate, d = (gross * i.rdis) / 100, tax = gross - d;
    disc += d; sub += tax; sgst += (tax * i.sgst) / 100; cgst += (tax * i.cgst) / 100;
  }
  const exact = sub + sgst + cgst, grand = Math.round(exact);
  const r = (x: number) => Math.round(x * 100) / 100;
  return { disc: r(disc), sub: r(sub), sgst: r(sgst), cgst: r(cgst), round: r(grand - exact), grand };
}
