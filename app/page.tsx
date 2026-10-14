import Link from 'next/link';

export default function Home() {
  return (
    <div className="hero">
      <h1>GST billing, made simple</h1>
      <p>Create a bill in seconds. MRP, discounts, SGST and CGST are calculated for you. Print or save as PDF.</p>
      <p><Link className="btn" href="/login">Start billing free</Link></p>
    </div>
  );
}
