import "@/styles/globals.css";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { PortfolioProvider } from "@/contexts/PortfolioContext";
import { PortfolioDataProvider } from "@/contexts/PortfolioDataContext";
import { NewsProvider } from "@/contexts/NewsContext";
import { PortfolioNewsProvider } from "@/contexts/PortfolioNewsContext"; // <-- Import this

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const isPortfolioPage = router.pathname === "/portfolio" || router.pathname === "/insights";

  const AppTree = (
    <PortfolioProvider>
      <PortfolioDataProvider>
        <NewsProvider>
          {isPortfolioPage ? (
            <PortfolioNewsProvider>
              <Component {...pageProps} />
            </PortfolioNewsProvider>
          ) : (
            <Component {...pageProps} />
          )}
        </NewsProvider>
      </PortfolioDataProvider>
    </PortfolioProvider>
  );

  return AppTree;
}