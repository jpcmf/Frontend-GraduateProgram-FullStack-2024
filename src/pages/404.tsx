import Link from "next/link";
import Image from "next/image";
import { Container, Flex, Text } from "@chakra-ui/react";

export default function Error404() {
  return (
    <Container minHeight="100vh" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
      <Flex marginBottom="4">
        <Image src="/error404.gif" alt="404 Page Not Found" width={475} height={267} quality={80} />
      </Flex>
      <Text as="h1" fontSize="4xl" fontWeight="bold" textAlign="center" color="red.500">
        404 Página Não Encontrada
      </Text>
      <Text as="h2" fontSize="2xl" fontWeight="bold">
        Oops! Algo deu errado.
      </Text>
      <Text as="p" marginTop="4" fontSize="lg" textAlign="center">
        A página que você está procurando pode ter sido removida ou está temporariamente indisponível.
      </Text>
      <Flex marginTop="4">
        <Link href="/">Voltar para a página inicial</Link>
      </Flex>
    </Container>
  );
}
