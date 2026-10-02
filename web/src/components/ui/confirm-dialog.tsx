"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";

export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel = "Huỷ",
  danger = false,
  onCancel,
  onConfirm,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
}) {
  const [submitting, setSubmitting] = useState(false);

  return (
    <Dialog onClose={onCancel} widthClassName="max-w-[420px]">
      <div className="flex flex-col gap-4 p-6">
        <h2 className="font-serif text-lg font-semibold text-text">{title}</h2>
        <p className="text-sm leading-relaxed text-text-muted">{description}</p>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 rounded-lg border border-border-input px-4 text-sm font-medium text-text"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={async () => {
              setSubmitting(true);
              await onConfirm();
              setSubmitting(false);
            }}
            className={`h-10 rounded-lg px-4 text-sm font-semibold text-white disabled:opacity-60 ${
              danger ? "bg-danger hover:bg-danger-hover" : "bg-accent hover:bg-accent-hover"
            }`}
          >
            {submitting ? "Đang xử lý…" : confirmLabel}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
