import { FieldError } from "react-hook-form";
import { forwardRef, ForwardRefRenderFunction } from "react";
import {
  Text,
  Input as ChakraInput,
  FormLabel,
  FormControl,
  InputProps as ChakraInputProps,
  FormErrorMessage,
  InputGroup,
  InputLeftAddon,
  InputRightAddon
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
  return (
    <FormControl isInvalid={!!error}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      {!isInputGroup ? (
        <ChakraInput
          name={name}
          id={name}
          focusBorderColor="blue.500"
          bgColor="gray.900"
          variant="filled"
          _hover={{ bgColor: "gray.900" }}
          size="lg"
          ref={ref}
          {...rest}
        />
      ) : (
        <InputGroup size="lg">
          <InputLeftAddon bgColor="gray.500" borderColor="gray.500" textColor="gray.900">
            {InputLeftAddonText}
          </InputLeftAddon>
          <ChakraInput
            name={name}
            id={name}
            focusBorderColor="blue.500"
            bgColor="gray.900"
            variant="filled"
            _hover={{ bgColor: "gray.900" }}
            size="lg"
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
