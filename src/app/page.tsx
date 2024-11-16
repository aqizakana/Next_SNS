import Link from "next/link";
import BaseLayout from "./baseLayout";
import styles from "./page.module.css";

export default function Home() {
	return (
		<BaseLayout>
			<div className={styles.container}>
				{Array.from({ length: 300 }).map((_, index) => (
					<div
						key=""
						className={styles.bubble}
						style={{
							marginLeft: `${Math.random() * index * 100 - 100}px`,
							animationDelay: `${Math.random() * index * 0.1}s`,
							transform: `scale(${Math.random()})`,
							animationDuration: `${Math.random() * 30 + 5}s`,
							translate: `translate(${Math.sin(Math.random() * 100)}px, ${Math.cos(Math.random() * 100)}px)`,
						}}
					>
						<h2>〇</h2>
					</div>
				))}
				<h1 className={styles.title}>bukubuku</h1>
				<Link href="/accounts" className={styles.link}>
					登録/ログイン
				</Link>
				<Link href="/three" className={styles.link}>
					canvasページ
				</Link>
			</div>
		</BaseLayout>
	);
}
