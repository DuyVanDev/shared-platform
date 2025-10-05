"use client";

import ToastContainer from "@/components/Toast";
import { useState, useCallback } from "react";

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<
    {
      id: number;
      message: string;
      type?: "success" | "error" | "info" | "confirm";
      onConfirm?: () => void;
    }[]
  >([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, message, type }]);
      // 🕒 Chỉ auto close với toast thường
      setTimeout(() => removeToast(id), 3000);
    },
    [removeToast]
  );

  const confirmToast = useCallback((message: string, onConfirm: () => void) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type: "confirm", onConfirm }]);
    // ❌ KHÔNG setTimeout → confirm sẽ chỉ đóng khi người dùng bấm
  }, []);

  const ToastComponent = (
    <ToastContainer toasts={toasts} removeToast={removeToast} />
  );

  return { addToast, confirmToast, ToastComponent };
}
