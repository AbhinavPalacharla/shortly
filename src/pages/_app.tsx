import "../../styles/globals.css";
import { withTRPC } from "@trpc/next";
import { AppType } from "next/dist/shared/lib/utils";
import { AppRouter } from "./api/trpc/[trpc]";
import Inspect from "inspx";
import * as Toast from "@radix-ui/react-toast";
import { Layout } from "../components/layout/Layout";
import { ThemeProvider } from "next-themes";

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <Inspect>
      <ThemeProvider attribute="class">
        <Toast.Provider swipeThreshold={50} swipeDirection="left">
          {/* <Layout> */}
          <Component {...pageProps} />
          {/* </Layout> */}
        </Toast.Provider>
      </ThemeProvider>
    </Inspect>
  );
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";

    return {
      url,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp);
