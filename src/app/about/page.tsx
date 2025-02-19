import BaseLayout from "../baseLayout";
import styles from "./page.module.css";

const About = () => {
	return (
		<BaseLayout>
			<div className={styles.body}>
				<div className={styles.container}>
					<h1>bukubuku</h1>
					<p>
						海の中でのコミュニケーションをテーマに制作した2025年卒業制作になります。
					</p>
				</div>
			</div>
		</BaseLayout>
	);
};

export default About;
