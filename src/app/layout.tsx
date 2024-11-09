import type { Metadata } from 'next';
import './globals.css';


const metadata: Metadata = {
  title: 'Frozen',
  description: '開発中',
  viewport: 'width=device-width, initial-scale=1',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ja'>
      <body>{children}</body>
    </html>
  );
}
