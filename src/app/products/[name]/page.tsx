'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

export default function Name() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const name = searchParams.get('name');
 

  return (
    <div>
      <h1>{name}のページです</h1>
      <button onClick={() => router.push('/')}>ホームに戻る</button>
    </div>
  );
}
