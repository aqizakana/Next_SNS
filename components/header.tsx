import Link from 'next/link';
import style from "./header.module.css";


export function Header() {
  const Header_Object = [
    {
      id: 1,
      name: "Home",
      link: "/"
    },
    {
      id: 2,
      name: "About",
      link: "/about"
    },
    {
      id: 3,
      name: "Login",
      link: "/accounts"
    },
    {
      id: 4,
      name: "Three",
      link: "/three"
    }
  ]
  return (
    <header className={style.header}>
      <nav className={style.navbar}>
        {Header_Object.map((item) => (
          <Link key={item.id}
            href={item.link}
            className={style.navbar__links}>
            {item.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
