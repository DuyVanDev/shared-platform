"use client";

import { useToast } from "@/hook/useToast";
import { createContext, useContext } from "react";

const ToastContext = createContext<any>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { addToast, ToastComponent, confirmToast } = useToast();

  return (
    <ToastContext.Provider value={{ addToast,confirmToast }}>
      {children}
      {ToastComponent}
    </ToastContext.Provider>
  );
}

export const useGlobalToast = () => useContext(ToastContext);
