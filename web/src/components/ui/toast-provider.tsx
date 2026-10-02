"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

/* ─── Types ─── */

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
  removing?: boolean;
}

interface ToastContextValue {
  toast: (opts: { type?: ToastType; message: string }) => void;
}

/* ─── Context ─── */

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

/* ─── Icons ─── */

const iconMap: Record<ToastType, ReactNode> = {
  success: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12l3 3 5-6" />
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
};

/* ─── Styles ─── */

const colorMap: Record<ToastType, string> = {
  success: "border-success-border bg-success-bg text-success-text-strong",
  error: "border-danger-border bg-danger-bg text-danger-text",
  info: "border-border bg-white text-text",
};

/* ─── Provider ─── */

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    ({ type = "info", message }: { type?: ToastType; message: string }) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, type, message }]);

      // Auto-dismiss: mark as removing (slide out), then remove from DOM
      setTimeout(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, removing: true } : t)),
        );
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 300);
      }, 3500);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}

      {/* Toast container — fixed top-right */}
      {toasts.length > 0 ? (
        <div
          className="fixed right-4 top-4 z-[100] flex flex-col gap-2"
          aria-live="polite"
        >
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium shadow-md ${colorMap[t.type]} ${
                t.removing
                  ? "animate-[slide-out-right_0.3s_ease-in_forwards]"
                  : "animate-[slide-in-right_0.3s_ease-out]"
              }`}
            >
              {iconMap[t.type]}
              {t.message}
            </div>
          ))}
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}
