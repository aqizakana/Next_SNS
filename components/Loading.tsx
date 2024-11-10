<<<<<<< HEAD
import { Dispatch, SetStateAction } from 'react';
import styles from './loading.module.css';

export default function Loading() {
  return (
    <div className={styles.head}>
      <h1 className={styles.head__h1}>投稿中...ちょっち待ってね。</h1>
    </div>
  );
=======
import styles from "./loading.module.css";
import { Dispatch, SetStateAction } from "react";
export default function Loading() {
	return (
		<div className={styles.head}>
			<h1 className={styles.head__h1}>投稿中...</h1>
		</div>
	);
>>>>>>> 666f772b23648bc37af265dfd2d824b641889bf6
}
