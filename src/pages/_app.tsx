import { AppProps } from "next/app";

import { ChakraProvider } from "@chakra-ui/react";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import QueryProvider from "@/components/QueryProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarDrawerProvider } from "@/contexts/SidebarDrawerContext";
import { fonts } from "@/lib/fonts";
import { Layout } from "@/shared/components/Layout";
import { theme } from "@/styles/theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-roboto: ${fonts.roboto.style.fontFamily};
            --font-raleway: ${fonts.raleway.style.fontFamily};
          }
          #__next {
            display: flex;
            flex-direction: column;
            height: 100dvh;
          }
        `}
      </style>

      <ErrorBoundary>
        <AuthProvider>
          <ChakraProvider theme={theme}>
            <SidebarDrawerProvider>
              <QueryProvider>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </QueryProvider>
            </SidebarDrawerProvider>
          </ChakraProvider>
        </AuthProvider>
      </ErrorBoundary>
    </>
  );
}

export default MyApp;
