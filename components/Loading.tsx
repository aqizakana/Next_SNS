import styles from "./loading.module.css";

export function Loading() {
	return (
		<div className={styles.cube_container}>
			<div className={styles.cube}>
				<div className={`${styles.face} ${styles.front}`}>投稿中</div>
				<div className={`${styles.face} ${styles.back}`}>投稿中</div>
				<div className={`${styles.face} ${styles.right}`}>投稿中</div>
				<div className={`${styles.face} ${styles.left}`}>投稿中</div>
				<div className={`${styles.face} ${styles.top}`}>投稿中</div>
				<div className={`${styles.face} ${styles.bottom}`}>投稿中</div>
			</div>
		</div>
	);
}
