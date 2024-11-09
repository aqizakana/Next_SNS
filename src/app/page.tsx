import BaseLayout from './baseLayout';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Scuba',
  description: 'テキストメッセージから、抽象的な3Dオブジェクトを生成し、共有するアプリケーションです。海の中でのダイビングして、メッセージを送り合いましょう。',
}

export default function Home() {
  return (
    <BaseLayout>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
    
    </BaseLayout>
  );
}
