import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Flex, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import { Toast } from "@/components/Toast";

export default function Confirmation() {
  const route = useRouter();
  const { addToast } = Toast();
  const [hasEmail, setHasEmail] = useState(true);
  const hasInitiatedRef = useRef(false);

  useEffect(() => {
    const handleConfirmation = async () => {
      if (hasInitiatedRef.current) return;

      const userEmail = route.query.email as string;

      if (!userEmail) {
        setHasEmail(false);

        addToast({
          title: "Erro ao confirmar e-mail.",
          message: "Parâmetro de e-mail não encontrado na URL.",
          type: "error"
        });

        return;
      }

      try {
        hasInitiatedRef.current = true;

        const response = await fetch("/api/sendConfirmationEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ userEmail })
        });

        if (!response.ok) {
          addToast({
            title: "Erro ao confirmar e-mail.",
            message: "Erro ao enviar e-mail de confirmação: " + response.statusText,
            type: "error"
          });
          return;
        }

        addToast({
          title: "E-mail confirmado com sucesso.",
          message:
            "Nossa equipe avaliará suas informações e assim que aprovado seu cadastro, você receberá um e-mail de confirmação.",
          type: "success"
        });

        setTimeout(() => {
          route.push("/");
        }, 3000);
      } catch (error) {
        addToast({
          title: "Erro de processamento",
          message: "Ocorreu um erro inesperado. Tente novamente.",
          type: "error"
        });
      }
    };

    if (route.isReady && !hasInitiatedRef.current) {
      handleConfirmation();
    }
  }, [route.isReady, route.query.email, addToast, route]);

  return (
    <>
      <Head>
        <title>Seu e-mail está sendo confirmado... - SkateHub</title>
      </Head>
      <Flex
        w={["100dvw"]}
        h={["100dvh"]}
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        bg="gray.900"
        backgroundSize="cover"
        backgroundRepeat="no-repeat"
        backgroundBlendMode="overlay"
        backgroundPosition="center 80%"
        backgroundImage="../alexander-londono-unsplash-2.jpeg"
        px={["4", "0"]}
      >
        {hasEmail ? (
          <>
            <Image src="../loader.svg" alt="Loading" width={100} height={100} />
            <Text as="h1" fontSize="3xl" fontWeight="bold" letterSpacing="normal" align="center" display="flex">
              Seu e-mail está sendo confirmado...
            </Text>
            <Text fontWeight="normal" align="center" color="gray.300" mt="2">
              Por favor, aguarde alguns instantes.
            </Text>
          </>
        ) : (
          <>
            <Text as="h1" fontSize="3xl" fontWeight="bold" letterSpacing="normal" align="center" display="flex">
              Erro ao confirmar e-mail.
            </Text>
            <Text fontWeight="normal" align="center" color="gray.300" mt="2">
              Parâmetro de e-mail não encontrado na URL.
            </Text>
            <Link href="/">
              <Text color="blue.500" align="center" mt="2">
                Voltar para a página inicial
              </Text>
            </Link>
          </>
        )}
      </Flex>
    </>
  );
}
