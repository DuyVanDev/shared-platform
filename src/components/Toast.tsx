"use client";

import { X } from "lucide-react";

interface Toast {
  id: number;
  message: string;
  type?: "success" | "error" | "info" | "confirm";
  onConfirm?: () => void; // callback khi bấm Có
}

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: number) => void;
}

export default function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed top-0 right-[50%] z-[9999] flex flex-col gap-2 mt-3 translate-x-1/2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex flex-col gap-2 px-4 py-3 rounded-xl shadow-md text-white transition-all duration-300
            ${toast.type === "success" ? "bg-green-500" :
              toast.type === "error" ? "bg-red-500" :
              toast.type === "confirm" ? "bg-yellow-500" :
              "bg-gray-700"}
          `}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)}>
              <X className="w-4 h-4 opacity-80 hover:opacity-100 transition" />
            </button>
          </div>

          {/* Nếu là confirm thì hiển thị 2 nút */}
          {toast.type === "confirm" && (
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => {
                  toast.onConfirm?.();
                  removeToast(toast.id);
                }}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-md text-sm transition"
              >
                Có
              </button>
              <button
                onClick={() => removeToast(toast.id)}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-md text-sm transition"
              >
                Không
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
