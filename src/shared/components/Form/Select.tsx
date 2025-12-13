import { forwardRef, ForwardRefRenderFunction, ReactNode } from "react";
import { FieldError } from "react-hook-form";

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select as ChakraSelect,
  SelectProps as ChakraSelectProps,
  useColorModeValue
} from "@chakra-ui/react";

interface SelectProps extends ChakraSelectProps {
  label?: string;
  error?: FieldError;
  children: ReactNode;
  placeholder?: string;
}

const SelectBase: ForwardRefRenderFunction<HTMLSelectElement, SelectProps> = (
  { name, label, error = null, children, placeholder, ...rest },
  ref
) => {
  const bgColor = useColorModeValue("blackAlpha.100", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const bgHoverColor = useColorModeValue("blackAlpha.200", "blackAlpha.300");
  return (
    <FormControl isInvalid={!!error}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <ChakraSelect
        name={name}
        id={name}
        focusBorderColor="green.500"
        bgColor={bgColor}
        color={textColor}
        variant="filled"
        _hover={{ bgColor: bgHoverColor }}
        size="md"
        ref={ref}
        placeholder={placeholder}
        {...rest}
      >
        {children}
      </ChakraSelect>

      {!!error && (
        <FormErrorMessage as="small" color="red.500" ml="1" mt="2" display="block" fontSize="smaller" fontWeight="300">
          {error?.message}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};

export const Select = forwardRef(SelectBase);
