"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Flex, Text } from "@chakra-ui/react";

import { Toast } from "@/components/Toast";

export default function Confirmation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = Toast();
  const [hasEmail, setHasEmail] = useState(true);
  const hasInitiatedRef = useRef(false);

  useEffect(() => {
    const handleConfirmation = async () => {
      if (hasInitiatedRef.current) return;

      // Parse the email directly from the raw search string to avoid
      // URLSearchParams interpreting '+' as a space (RFC 3986 vs HTML form encoding).
      // useSearchParams().get() silently converts '+' → ' ', which breaks emails
      // like user+tag@example.com. Instead we extract and decodeURIComponent manually.
      let userEmail: string | null = null;
      if (typeof window !== "undefined") {
        const match = window.location.search.match(/[?&]email=([^&]*)/);
        userEmail = match ? decodeURIComponent(match[1]) : null;
      } else {
        // SSR fallback: useSearchParams value (+ already decoded to space here,
        // but this path is only reached during server-render before hydration)
        const raw = searchParams?.get("email");
        userEmail = raw ? decodeURIComponent(raw) : null;
      }

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
          router.push("/");
        }, 3000);
      } catch {
        addToast({
          title: "Erro de processamento",
          message: "Ocorreu um erro inesperado. Tente novamente.",
          type: "error"
        });
      }
    };

    handleConfirmation();
  }, [searchParams, addToast, router]);

  return (
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
      position="absolute"
      top={0}
      left={0}
      zIndex={10}
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
  );
}
