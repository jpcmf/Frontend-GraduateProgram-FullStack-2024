import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea as ChakraTextarea,
  TextareaProps as ChakraTextareaProps,
  useColorModeValue
} from "@chakra-ui/react";

interface TextareaProps extends ChakraTextareaProps {
  label?: string;
  error?: FieldError;
}

const TextareaBase: ForwardRefRenderFunction<HTMLTextAreaElement, TextareaProps> = (
  { name, label, error = null, ...rest },
  ref
) => {
  const bgColor = useColorModeValue("blackAlpha.100", "gray.900");
  const bgHoverColor = useColorModeValue("blackAlpha.200", "blackAlpha.300");
  const textColor = useColorModeValue("gray.800", "gray.100");
  return (
    <FormControl isInvalid={!!error}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <ChakraTextarea
        name={name}
        id={name}
        focusBorderColor="gray.600"
        bgColor={bgColor}
        color={textColor}
        variant="filled"
        _hover={{ bgColor: bgHoverColor }}
        size="md"
        ref={ref}
        {...rest}
      />

      {!!error && (
        <FormErrorMessage as="small" color="red.500" ml="1" mt="2" display="block" fontSize="smaller" fontWeight="300">
          {error?.message}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};

export const Textarea = forwardRef(TextareaBase);
