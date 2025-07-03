import Head from "next/head";
import Navbar from "../components/Navbar";
import FullNewsFeed from "@/components/FullNewsFeed";

export default function NewsPage() {
  return (
    <>
      <Head>
        <title>Envest – Full News</title>
      </Head>
      <Navbar />
      <main style={{ padding: "32px" }}>
        <FullNewsFeed />
      </main>
    </>
  );
}