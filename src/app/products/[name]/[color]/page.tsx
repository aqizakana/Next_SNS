// pages/[name]/[color]/page.tsx

'use client'
import { useRouter,useSearchParams } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get('name');
  const color = searchParams.get('color');



  return (
    <div>
      <h1>Name: {name}</h1>
      <h2>Color: {color}</h2>
    </div>
  );
};

export default Page;
