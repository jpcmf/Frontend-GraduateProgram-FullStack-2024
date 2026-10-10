"use client";

import { Box, Button, Flex, Grid, HStack, Link, Stack, Text } from "@chakra-ui/react";

import { LogoSkateHub } from "../../LogoSkateHub";
import { SectionLabel } from "../SectionLabel";

/* ---------------------------- Brand ---------------------------- */
// export const Brand = ({ size = '2xl' }: { size?: string }) => (
//   <Text fontSize={size} fontWeight="900" letterSpacing="-0.02em" color="white">
//     Skate<Text as="span" color="accent.base">Hub</Text>
//   </Text>
// )

/* ---------------------------- Footer ---------------------------- */
const FooterColumn = ({ title, links }: { title: string; links: string[] }) => (
  <Box>
    <SectionLabel color="content.body" mb={3}>
      {title}
    </SectionLabel>
    <Stack as="ul" listStyleType="none" spacing={1.5}>
      {links.map(l => (
        <li key={l}>
          <Link href="#" _hover={{ color: "white", textDecoration: "none" }}>
            {l}
          </Link>
        </li>
      ))}
    </Stack>
  </Box>
);

export const Footer = () => (
  <Box
    as="footer"
    mt={10}
    pt={10}
    pb={6}
    px={{ base: 4, lg: 8 }}
    bg="surface.header"
    borderTop="1px solid"
    borderColor="line.subtle"
    fontSize="xs"
    color="content.muted"
  >
    <Box maxW="1780px" mx="auto">
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
        gap={8}
        pb={8}
        borderBottom="1px solid"
        borderColor="line.faint"
      >
        <Stack spacing={2}>
          {/* <Brand size="xl" /> */}
          <LogoSkateHub width={150} color="gray" />
          <Text lineHeight="relaxed">
            Conectando skatistas de todo o mundo. Descubra novos picos, acompanhe sessões e fortaleça a cena local.
          </Text>
        </Stack>
        <FooterColumn title="Navegação" links={["Dashboard", "Skatistas", "Spots", "Cadastro", "Login"]} />
        <FooterColumn title="Legal" links={["Termos de Serviço", "Política de Privacidade", "Sobre Nós"]} />
        <Box>
          <SectionLabel color="content.body" mb={3}>
            Contribua
          </SectionLabel>
          <Text mb={3}>
            Esse projeto foi criado e é mantido por{" "}
            <Link href="#" color="content.secondary" fontWeight="semibold" textDecoration="underline">
              jpcmf.dev
            </Link>
          </Text>
          <Button variant="danger" size="sm" leftIcon={<span>❤️</span>}>
            Quero contribuir
          </Button>
        </Box>
      </Grid>
      <Flex
        pt={6}
        direction={{ base: "column", sm: "row" }}
        justify="space-between"
        align="center"
        gap={4}
        fontSize="11px"
      >
        <Text>© 2026 SkateHub. Todos os direitos reservados.</Text>
        <HStack spacing={3}>
          <Text>⚛️ React</Text>
          <Text>•</Text>
          <Text>Next.js</Text>
          <Text>•</Text>
          <Text>⚡ Chakra UI</Text>
        </HStack>
      </Flex>
    </Box>
  </Box>
);
