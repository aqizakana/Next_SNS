import Link from 'next/link';

export function Header() {
  return (
    <ul className="header">
      <li>
        <Link href="/">
          Home
        </Link>
      </li>
      <li>
        <Link href="/about">
          About
        </Link>
      </li>
      <li>
        <Link href="/accounts">
          Login
        </Link>
      </li>
      <li>
        <Link href="/three">
          Three
        </Link>
      </li>
    </ul>
  );
}

