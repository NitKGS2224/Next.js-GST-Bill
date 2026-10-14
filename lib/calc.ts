export type Item = { product: string; pack: string; qty: number; mrp: number; mdis: number; rate: number; rdis: number; sgst: number; cgst: number; remarks: string };
export const blank = (): Item => ({ product: '', pack: '', qty: 1, mrp: 0, mdis: 0, rate: 0, rdis: 0, sgst: 2.5, cgst: 2.5, remarks: '' });

export const line = (i: Item) => {
  const gross = i.qty * i.rate, disc = (gross * i.rdis) / 100, tax = gross - disc;
  const sg = (tax * i.sgst) / 100, cg = (tax * i.cgst) / 100;
  return { gross, disc, tax, sg, cg, amount: tax + sg + cg };
};
export const sum = (items: Item[]) => {
  let disc = 0, sub = 0, sgst = 0, cgst = 0;
  for (const i of items) { const l = line(i); disc += l.disc; sub += l.tax; sgst += l.sg; cgst += l.cg; }
  const exact = sub + sgst + cgst, grand = Math.round(exact);
  return { disc, sub, sgst, cgst, round: grand - exact, grand };
};
export const money = (n: number) =>
  (Math.round(((n || 0) + Number.EPSILON) * 100) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const O = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const T = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
export function words(n: number): string {
  if (n === 0) return 'Zero';
  if (n < 20) return O[n];
  if (n < 100) return T[Math.floor(n / 10)] + (n % 10 ? ' ' + O[n % 10] : '');
  if (n < 1000) return O[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + words(n % 100) : '');
  if (n < 100000) return words(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + words(n % 1000) : '');
  if (n < 10000000) return words(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + words(n % 100000) : '');
  return words(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + words(n % 10000000) : '');
}
