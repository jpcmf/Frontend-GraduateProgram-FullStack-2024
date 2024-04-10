import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Flex, Text } from "@chakra-ui/react";

import { Toast } from "@/components/Toast";

export default function Confirmation() {
  const route = useRouter();
  const { addToast } = Toast();

  useEffect(() => {
    function getQueryParam(name: string) {
      const params = new URLSearchParams(window.location.search);
      return params.get(name);
    }

    async function sendConfirmationEmail() {
      try {
        const userEmail = getQueryParam("email");

        if (!userEmail) {
          addToast({
            title: "Erro ao confirmar e-mail.",
            message: "Parâmetro de e-mail não encontrado na URL.",
            type: "error"
          });
          return;
        }

        const response = await fetch("/api/sendConfirmationEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ userEmail })
        });

        if (response.ok) {
          addToast({
            title: "E-mail confirmado com sucesso.",
            message:
              "Nossa equipe avaliará suas informações e assim que aprovado seu cadastro, você receberá um e-mail de confirmação.",
            type: "success"
          });

          route.push("/");
        } else {
          addToast({
            title: "Erro ao confirmar e-mail.",
            message: "Erro ao enviar e-mail de confirmação: " + response.statusText,
            type: "error"
          });
        }
      } catch (error: any) {
        addToast({
          title: "Erro ao confirmar e-mail.",
          message: "Erro ao enviar e-mail de confirmação: " + error.message,
          type: "error"
        });
      }
    }
    sendConfirmationEmail();
  }, []);

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
        <Image src="../loader.svg" alt="Loading" width={100} height={100} />
        <Text as="h1" fontSize="3xl" fontWeight="bold" letterSpacing="normal" align="center" display="flex">
          Seu e-mail está sendo confirmado...
        </Text>
        <Text fontWeight="normal" align="center" color="gray.300">
          Por favor, aguarde alguns instantes.
        </Text>
      </Flex>
    </>
  );
}
