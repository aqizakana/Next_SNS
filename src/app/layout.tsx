import type { Metadata } from 'next';
import './globals.css';

 export const metadata: Metadata = {
    title: 'bukubuku',
    description: 'テキストメッセージから、抽象的な3Dオブジェクトを生成し、共有するアプリケーションです。海の中でのダイビングして、メッセージを送り合いましょう。',
  }

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <html lang='ja'>
      <meta charSet='utf-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />

      <body>{children}</body>
    </html>
  );
}
