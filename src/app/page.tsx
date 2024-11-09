import Head from "next/head";
import Link from "next/link";
import { Suspense } from "react";
import { Footer } from "../../components/footer";
import { Header } from "../../components/header";
import BaseLayout from "./baseLayout";
import Layout from "./layout";

export default function Home() {
	return (
		<BaseLayout>
			<Head>
				<title>Home</title>
				<meta name="description" content="This is the home page" />
			</Head>
		</BaseLayout>
	);
}
