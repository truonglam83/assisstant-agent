"use client";

import { useState } from "react";

/** Công tắc bật/tắt tái sử dụng được (lịch chạy, cài đặt…). */
export function ToggleSwitch({
  defaultChecked,
  label,
  onChange,
}: {
  defaultChecked: boolean;
  label: string;
  onChange: (checked: boolean) => Promise<void> | void;
}) {
  const [checked, setChecked] = useState(defaultChecked);
  const [pending, setPending] = useState(false);

  async function handleToggle() {
    const next = !checked;
    setChecked(next);
    setPending(true);
    await onChange(next);
    setPending(false);
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={pending}
      onClick={handleToggle}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors disabled:opacity-60 ${
        checked ? "bg-accent" : "bg-border-input"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}
