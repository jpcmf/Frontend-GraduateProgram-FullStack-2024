import { useToast } from "@chakra-ui/react";

type ToastProps = {
  message: string;
  title: string;
  type: "success" | "info" | "warning" | "error";
};

export const Toast = () => {
  const toast = useToast();

  const addToast = ({ title, message, type }: ToastProps) => {
    toast({
      title: title,
      description: message,
      status: type,
      position: "bottom-right",
      isClosable: true,
      duration: 5700,
      variant: "solid"
    });
  };

  return { addToast };
};
