import Link from "next/link";
import Head from 'next/head'
import { Suspense } from "react";
import { Header } from "../../components/header";
import Footer from "../../components/footer";

export default function Home() {
  return (

    <div>
      <Head>
        <title>タイトル</title>
        <meta name="description" content="開発中" />
      </Head>
      <Header />

      <Footer />

      <h1>Hello Next.js</h1>

    </div>
  );
}