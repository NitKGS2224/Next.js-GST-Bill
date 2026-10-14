import './globals.css';
import Nav from '@/components/Nav';

export const metadata = { title: 'GST Billing', description: 'Simple, fast GST billing for your shop' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
