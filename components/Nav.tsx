'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Nav() {
  const [on, setOn] = useState(false);
  const path = usePathname();
  const router = useRouter();
  useEffect(() => setOn(!!localStorage.getItem('token')), [path]);
  const out = () => { localStorage.removeItem('token'); setOn(false); router.push('/'); };
  return (
    <nav>
      <b>GST Billing</b>
      {on ? (
        <>
          <Link href="/dashboard">Bills</Link>
          <Link href="/invoice/new">New bill</Link>
          <Link href="/settings">Shop details</Link>
          <button onClick={out}>Logout</button>
        </>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </nav>
  );
}
