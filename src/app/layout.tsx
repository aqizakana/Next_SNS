import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "bukubuku",
	description: "",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ja">
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<link rel="icon" href="" />

			<body>{children}</body>
		</html>
	);
}
