import Link from 'next/link';
import style from "./header.module.css";

export function Header() {
  return (

    <nav className={style.header}>
      <Link href="/" className={style.header__link}>
        Home
      </Link>

      <Link href="/about">
        About
      </Link>

      <Link href="/accounts">
        Login
      </Link>

      <Link href="/three">
        Three
      </Link>
    </nav>

  );
}

