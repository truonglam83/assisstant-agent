"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

export type ToastType = "success" | "warning" | "error" | "info";

export interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

export type ToastInput = string | { type?: ToastType; message: string };

export type ToastFn = ((input: ToastInput, typeOverride?: ToastType) => void) & {
  success: (message: string) => void;
  warning: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

interface ToastContextValue {
  toast: ToastFn;
  showToast: ToastFn;
}

const noopToast = (() => {}) as unknown as ToastFn;
noopToast.success = () => {};
noopToast.warning = () => {};
noopToast.error = () => {};
noopToast.info = () => {};

const ToastContext = createContext<ToastContextValue>({
  toast: noopToast,
  showToast: noopToast,
});

export function useToast() {
  return useContext(ToastContext);
}

const iconMap: Record<ToastType, ReactNode> = {
  success: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-[#24633d]">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12l3 3 5-6" />
    </svg>
  ),
  warning: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-[#b5561f]">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-[#a5432f]">
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-[#2f5d50]">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
};

const colorMap: Record<ToastType, string> = {
  // Xanh lá dịu, ấm cúng chuẩn style web
  success: "border-[#b8d7c1] bg-[#edf6f0] text-[#1c472c] shadow-lg shadow-black/5",
  // Vàng ấm đồng điệu với token badge (#B5561F)
  warning: "border-[#ebd4af] bg-[#fdf5e6] text-[#783c11] shadow-lg shadow-black/5",
  // Hồng đỏ sang trọng, hài hoà với token danger (#FBEEEA / #A5432F)
  error: "border-[#eabeb4] bg-[#fbf0ec] text-[#842d1e] shadow-lg shadow-black/5",
  // Xanh ngọc trầm / cream thanh lịch (#2F5D50)
  info: "border-[#cadcd4] bg-[#f3f7f5] text-[#1f4238] shadow-lg shadow-black/5",
};

let toastCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const trigger = useCallback((input: ToastInput, typeOverride?: ToastType) => {
    let type: ToastType = typeOverride ?? "info";
    let message = "";

    if (typeof input === "string") {
      message = input;
    } else if (input && typeof input === "object") {
      type = input.type ?? typeOverride ?? "info";
      message = input.message ?? "";
    }

    if (!message) return;

    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const toastHandler = useCallback(
    Object.assign(
      (input: ToastInput, typeOverride?: ToastType) => trigger(input, typeOverride),
      {
        success: (msg: string) => trigger(msg, "success"),
        warning: (msg: string) => trigger(msg, "warning"),
        error: (msg: string) => trigger(msg, "error"),
        info: (msg: string) => trigger(msg, "info"),
      }
    ) as ToastFn,
    [trigger]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as unknown as { toast: ToastFn; showToast: ToastFn }).toast = toastHandler;
      (window as unknown as { toast: ToastFn; showToast: ToastFn }).showToast = toastHandler;
    }
  }, [toastHandler]);

  const toastPortal = mounted && typeof document !== "undefined"
    ? createPortal(
        <div
          id="toast-root"
          className="fixed right-5 top-5 z-[999999] flex flex-col gap-2.5 pointer-events-none"
          aria-live="polite"
        >
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-[14px] font-medium transition-all duration-200 min-w-[280px] max-w-[420px] ${colorMap[t.type]}`}
              style={{
                animation: "toast-fade-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {iconMap[t.type]}
                <span className="truncate leading-snug">{t.message}</span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="ml-2 text-current opacity-40 hover:opacity-100 shrink-0 p-0.5 transition-opacity"
                aria-label="Đóng"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>,
        document.body
      )
    : null;

  return (
    <ToastContext.Provider value={{ toast: toastHandler, showToast: toastHandler }}>
      {children}
      {toastPortal}
    </ToastContext.Provider>
  );
}
