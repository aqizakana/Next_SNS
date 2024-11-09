import { Dispatch, SetStateAction } from "react";
import styles from "./loading.module.css";

export default function Loading() {
	return (
		<div className={styles.head}>
			<h1 className={styles.head__h1}>投稿中...ちょっち待ってね。</h1>
		</div>
	);
}
