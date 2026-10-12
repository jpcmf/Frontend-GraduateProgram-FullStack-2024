import { FiImage, FiMapPin } from "react-icons/fi";

import { Button, Flex, HStack, Input } from "@chakra-ui/react";

import { useAuth } from "@/shared/hooks";

import { Panel } from "../Panel";
import { SkaterAvatar } from "../Skaters";

export const Composer = () => {
  const { user } = useAuth();
  return (
    <Panel>
      <HStack spacing={3} pb={3} borderBottom="1px solid" borderColor="line.faint">
        {/* <InitialsAvatar initials="LH" bg="surface.raised" size={10} /> */}
        <SkaterAvatar user={user} withRing={true} w="44px" h="44px" />
        <Input size="md" placeholder="Dropou onde hoje? Compartilhe manobra ou pico..." />
      </HStack>
      <Flex justify="space-between" align="center" pt={3}>
        <HStack spacing={2}>
          <Button variant="quiet" size="sm" leftIcon={<FiImage color="#22c55e" />}>
            Foto/Vídeo
          </Button>
          <Button variant="quiet" size="sm" leftIcon={<FiMapPin color="#22c55e" />}>
            Marcar Pico
          </Button>
        </HStack>
        <Button variant="accent" size="sm">
          Publicar
        </Button>
      </Flex>
    </Panel>
  );
};
