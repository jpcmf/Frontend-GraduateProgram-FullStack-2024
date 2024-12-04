import Link from "next/link";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Text,
  useBreakpointValue,
  Spinner,
  Link as ChakraLink,
  Divider,
  SimpleGrid,
  VStack,
  HStack
} from "@chakra-ui/react";

import { Input } from "@/components/Form/Input";
import { Layout } from "@/shared/components/Layout";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export function UserEdit() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterForm>();

  const handleEditUser: SubmitHandler<RegisterForm> = async values => {
    console.log("Editando...");
  };

  return (
    <Layout>
      <Box as="form" onSubmit={handleSubmit(handleEditUser)} flex="1" borderRadius={8} bg="gray.800" p={["6", "8"]}>
        <Flex mb="8" direction="column">
          <Heading size="lg" fontWeight="normal">
            Editar
          </Heading>
          <Divider my="6" borderColor="gray.700" />
          <VStack spacing={["6", "8"]}>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input label="Nome completo" {...register("name")} error={errors.name} />
              <Input type="email" label="E-mail" {...register("email")} error={errors.email} />
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input type="password" label="Senha" {...register("password")} error={errors.password} />
              <Input
                type="password"
                label="Confirmar senha"
                {...register("password_confirmation")}
                error={errors.password_confirmation}
              />
            </SimpleGrid>
          </VStack>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Button as="a" size="sm" fontSize="sm" colorScheme="whiteAlpha" onClick={() => router.push("/dashboard")}>
                Cancelar
              </Button>
              <Button type="submit" isLoading={isSubmitting} size="sm" fontSize="sm" colorScheme="blue">
                Salvar
              </Button>
            </HStack>
          </Flex>
        </Flex>
      </Box>
    </Layout>
  );
}
