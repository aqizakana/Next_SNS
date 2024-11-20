import { Footer } from "../../components/footer";
import { Header } from "../../components/header";
import Layout from "./layout";
import "./globals.css";

export default function BaseLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<html lang="ja">
			<body>
				<Header />

				{children}

				<Footer />
			</body>
		</html>
	);
}
