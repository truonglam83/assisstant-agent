"use client";

import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { schedulesApi } from "@/lib/api/schedules";

export function ScheduleEnableToggle({
  scheduleId,
  defaultEnabled,
}: {
  scheduleId: string;
  defaultEnabled: boolean;
}) {
  return (
    <ToggleSwitch
      defaultChecked={defaultEnabled}
      label="Bật/tắt lịch"
      onChange={(next) => schedulesApi.toggle(scheduleId, next)}
    />
  );
}
