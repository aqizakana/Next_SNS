import Link from "next/link";
import styles from "./PostForm.module.css";

const PostLinks = ({ className = "" }) => {
	return (
		<nav className={`${styles.navbar} ${className}`}>
			<Link href="/" className={styles.navbar__links}>
				Home
			</Link>
			<Link href="/about" className={styles.navbar__links}>
				About
			</Link>
			<Link href="/accounts" className={styles.navbar__links}>
				Login
			</Link>
		</nav>
	);
};

export default PostLinks;
