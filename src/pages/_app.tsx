import { theme } from "../styles/theme";
import { fonts } from "@/lib/fonts";
import { Session } from "next-auth";
import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { SidebarDrawerProvider } from "@/contexts/SidebarDrawerContext";

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-roboto: ${fonts.roboto.style.fontFamily};
          }
        `}
      </style>
      <SessionProvider session={pageProps.session}>
        <ChakraProvider theme={theme}>
          <SidebarDrawerProvider>
            <Component {...pageProps} />
          </SidebarDrawerProvider>
        </ChakraProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
