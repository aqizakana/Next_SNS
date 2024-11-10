import Link from "next/link";
import Head from "next/head";
import { Suspense } from "react";
import Layout from "./layout";
import BaseLayout from "./baseLayout";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";

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
