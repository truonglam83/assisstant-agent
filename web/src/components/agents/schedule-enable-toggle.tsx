"use client";

import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { schedulesApi } from "@/lib/api/schedules";
import { useToast } from "@/components/ui/toast-provider";

export function ScheduleEnableToggle({
  scheduleId,
  defaultEnabled,
}: {
  scheduleId: string;
  defaultEnabled: boolean;
}) {
  const { toast } = useToast();

  return (
    <ToggleSwitch
      defaultChecked={defaultEnabled}
      label="Bật/tắt lịch"
      onChange={(next) => {
        schedulesApi.toggle(scheduleId, next);
        toast({
          type: "info",
          message: next ? "Đã kích hoạt lịch chạy" : "Đã tạm dừng lịch chạy",
        });
      }}
    />
  );
}
