import BaseLayout from './baseLayout';
import Link from 'next/link';
import styles from './page.module.css';


export default function Home() {
  return (
    
    <BaseLayout>
      <div className={styles.container}>
        <h1 className={styles.title} >bukubuku</h1>
        <p className={styles.paragraph}>海では、“ブイ”で話す。<br/>     
          初めての方はこちら。→
          <Link href="/accounts" className={styles.link}>
            登録/ログイン
          </Link>
          <br/>
          登録済みの方はこちら。→
          <Link href="/three" className={styles.link}>
            canvasページ
          </Link>
        </p>
    
      </div>
    </BaseLayout>
  );
}
