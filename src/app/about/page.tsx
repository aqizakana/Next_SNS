import BaseLayout from "../baseLayout";

export const About = () => {
	return (
		<BaseLayout>
			<h1 className="heading-1">
				TypeLetterに訪れて頂きありがとうございます！
			</h1>
			<div className="about-body">
				<h2 className="about-body__head">TypeLetterを</h2>
				<p className="about-body__text">
					テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
					テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
					テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト
				</p>
			</div>
		</BaseLayout>
	);
};

export default About;
