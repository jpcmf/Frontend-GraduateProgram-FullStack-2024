import { theme } from '../styles/theme'
import { fonts } from '@/lib/fonts'
import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { SidebarDrawerProvider } from '@/contexts/SidebarDrawerContext'

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
      <ChakraProvider theme={theme}>
        <SidebarDrawerProvider>
          <Component {...pageProps} />
        </SidebarDrawerProvider>
      </ChakraProvider>
    </>
  )
}

export default MyApp
