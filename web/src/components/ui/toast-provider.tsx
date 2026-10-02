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

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

export type ToastInput = string | { type?: ToastType; message: string };

export type ToastFn = ((input: ToastInput, typeOverride?: ToastType) => void) & {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

interface ToastContextValue {
  toast: ToastFn;
  showToast: ToastFn;
}

const noopToast = (() => {}) as unknown as ToastFn;
noopToast.success = () => {};
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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-success-text">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12l3 3 5-6" />
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-danger">
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-accent">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
};

const colorMap: Record<ToastType, string> = {
  success: "border-success-border bg-white text-text shadow-lg",
  error: "border-danger-border bg-[#fff6f4] text-danger-text shadow-lg",
  info: "border-border bg-white text-text shadow-lg",
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
                className="ml-2 text-text-muted hover:text-text shrink-0 p-0.5"
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
