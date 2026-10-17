"use client";

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
  const bgInputGroupColor = useColorModeValue("blackAlpha.200", "blackAlpha.500");
  const textColor = useColorModeValue("gray.800", "gray.100");

  return (
    <FormControl isInvalid={!!error}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      {!isInputGroup ? (
        <ChakraInput
          name={name}
          id={name}
          focusBorderColor="gray.600"
          variant="filled"
          size="md"
          fontSize="sm"
          ref={ref}
          {...rest}
        />
      ) : (
        <InputGroup size="md">
          <InputLeftAddon bgColor={bgInputGroupColor} textColor={textColor} fontSize="sm">
            {InputLeftAddonText}
          </InputLeftAddon>
          <ChakraInput
            name={name}
            id={name}
            focusBorderColor="gray.600"
            variant="filled"
            size="md"
            fontSize="sm"
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
