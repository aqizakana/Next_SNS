import styles from "./loading.module.css";
import { Dispatch, SetStateAction } from "react";
export default function Loading() {
	return (
		<div className={styles.head}>
			<h1 className={styles.head__h1}>投稿中...</h1>
		</div>
	);
}
