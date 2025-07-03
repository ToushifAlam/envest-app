import Head from "next/head";
import Navbar from "@/components/Navbar";
import PortfolioInput from "@/components/PortfolioInput";
import PortfolioSummary from "@/components/PortfolioSummary";
import PortfolioNews from "@/components/PortfolioNews";
import { PortfolioDataProvider } from "@/contexts/PortfolioDataContext";

export default function PortfolioPage() {
  return (
    <>
      <Head>
        <title>Envest – Portfolio</title>
      </Head>
      <Navbar />
      <main style={{ padding: "32px" }}>
        <PortfolioDataProvider>
          <PortfolioInput />
          <PortfolioSummary />
          <PortfolioNews />
        </PortfolioDataProvider>
      </main>
    </>
  );
}