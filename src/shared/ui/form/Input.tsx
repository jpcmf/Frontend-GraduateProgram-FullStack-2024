import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
  InputGroup,
  InputLeftAddon,
  InputProps as ChakraInputProps,
  useColorModeValue
} from "@chakra-ui/react";

interface InputProps extends ChakraInputProps {
  label?: string;
  error?: FieldError;
  isInputGroup?: boolean;
  InputLeftAddonText?: string;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, label, error = null, isInputGroup, InputLeftAddonText, ...rest },
  ref
) => {
  const bgColor = useColorModeValue("blackAlpha.100", "gray.900");
  const bgInputGroupColor = useColorModeValue("blackAlpha.200", "blackAlpha.500");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const bgHoverColor = useColorModeValue("blackAlpha.200", "blackAlpha.300");
  return (
    <FormControl isInvalid={!!error}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      {!isInputGroup ? (
        <ChakraInput
          name={name}
          id={name}
          focusBorderColor="gray.600"
          color={textColor}
          bgColor={bgColor}
          variant="filled"
          _hover={{ bgColor: bgHoverColor }}
          size="md"
          ref={ref}
          {...rest}
        />
      ) : (
        <InputGroup size="md">
          <InputLeftAddon bgColor={bgInputGroupColor} borderColor={bgInputGroupColor} textColor={textColor}>
            {InputLeftAddonText}
          </InputLeftAddon>
          <ChakraInput
            name={name}
            id={name}
            focusBorderColor="gray.600"
            bgColor={bgColor}
            variant="filled"
            _hover={{ bgColor: bgHoverColor }}
            size="md"
            ref={ref}
            {...rest}
          />
        </InputGroup>
      )}

      {!!error && (
        <FormErrorMessage as="small" color="red.500" ml="1" mt="2" display="block" fontSize="smaller" fontWeight="300">
          {error?.message}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};

export const Input = forwardRef(InputBase);
