import Link from "next/link";
import style from "./header.module.css";

export function Header() {
	const headerObject = [
		{
			id: 1,
			name: "Home",
			link: "/",
		},
		{
			id: 2,
			name: "About",
			link: "/about",
		},
		{
			id: 3,
			name: "Login",
			link: "/accounts",
		},
		{
			id: 4,
			name: "Three",
			link: "/three",
		},
	];
	return (
		<header class={style.header}>
			<nav class={style.navbar}>
				{headerObject.map((item) => (
					<Link key={item.id} href={item.link} class={style.navbar__links}>
						{item.name}
					</Link>
				))}
			</nav>
		</header>
	);
}
