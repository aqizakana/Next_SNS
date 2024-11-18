import Link from "next/link";
import BaseLayout from "./baseLayout";
import styles from "./page.module.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "bukubuku",
	description: "bukubuku",
};

export default function Home() {
	return (
		<BaseLayout>
			<div class={styles.container}>
				{Array.from({ length: 300 }).map((_, index) => (
					<div
						key=""
						class={styles.bubble}
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
				<h1 class={styles.title}>bukubuku</h1>
				<Link href="/accounts" class={styles.link}>
					登録/ログイン
				</Link>
				<Link href="/three" class={styles.link}>
					canvasページ
				</Link>
			</div>
		</BaseLayout>
	);
}
