import { RiSearchLine } from "react-icons/ri";
import { Flex, Icon, Input } from "@chakra-ui/react";

export function Search() {
  return (
    <Flex
      as="label"
      flex="1"
      py="4"
      px="8"
      maxWidth={400}
      color="gray.200"
      position="relative"
      bg="gray.800"
      borderRadius="full"
      alignItems="center"
      style={{ marginLeft: "88px" }}
    >
      <Input
        color="gray.50"
        variant="unstyled"
        px="4"
        mr="4"
        placeholder="Buscar..."
        _placeholder={{ color: "gray.500" }}
      />
      <Icon as={RiSearchLine} fontSize="20" cursor="pointer" />
    </Flex>
  );
}
