import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "@/styles/theme";
import { fonts } from "@/lib/fonts";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarDrawerProvider } from "@/contexts/SidebarDrawerContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-roboto: ${fonts.roboto.style.fontFamily};
          }
        `}
      </style>

      <AuthProvider>
        <ChakraProvider theme={theme}>
          <SidebarDrawerProvider>
            <Component {...pageProps} />
          </SidebarDrawerProvider>
        </ChakraProvider>
      </AuthProvider>
    </>
  );
}

export default MyApp;
