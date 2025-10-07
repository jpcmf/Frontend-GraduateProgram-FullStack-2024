import React from "react";

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay
} from "@chakra-ui/react";

type ReusableModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footerContent?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "full";
  isCentered?: boolean;
};

// Reusable Modal Component
export const ReusableModal = ({
  isOpen,
  onClose,
  // title,
  children,
  // footerContent,
  size = "md",
  isCentered = true
}: ReusableModalProps) => {
  const OverlayOne = () => <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px) hue-rotate(90deg)" />;

  return (
    <Modal isCentered={isCentered} isOpen={isOpen} onClose={onClose} size={size}>
      <OverlayOne />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};
