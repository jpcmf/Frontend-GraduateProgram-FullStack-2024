"use client";

import { createContext, ReactNode, useContext, useEffect } from "react";
import { usePathname } from "next/navigation";

import { useDisclosure, UseDisclosureReturn } from "@chakra-ui/react";

interface SidebarDrawerProviderProps {
  children: ReactNode;
}

type SidebarDrawerContextData = UseDisclosureReturn;

const SidebarDrawerContext = createContext({} as SidebarDrawerContextData);

export function SidebarDrawerProvider({ children }: SidebarDrawerProviderProps) {
  const disclosure = useDisclosure();
  const pathname = usePathname();

  useEffect(() => {
    disclosure.onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return <SidebarDrawerContext.Provider value={disclosure}>{children}</SidebarDrawerContext.Provider>;
}

export const useSidebarDrawer = () => useContext(SidebarDrawerContext);
