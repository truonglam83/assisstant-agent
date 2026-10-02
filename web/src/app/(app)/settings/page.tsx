import { MOCK_INTEGRATIONS } from "@/lib/mock/integrations";
import { IntegrationRow } from "@/components/integrations/integration-row";
import { MobileMenuButton } from "@/components/layout/mobile-menu-button";

export default function SettingsPage() {
  return (
    <>
      <header className="flex h-[68px] shrink-0 items-center gap-2 border-b border-border px-3 md:gap-0 md:px-8">
        <MobileMenuButton />
        <div className="flex flex-col gap-0.5">
          <h1 className="font-serif text-lg font-semibold text-text md:text-[22px]">Cài đặt</h1>
          <div className="hidden text-[13px] text-text-muted md:block">Kết nối dịch vụ ngoài</div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col items-center gap-2.5 overflow-y-auto py-6">
        <div className="flex w-[640px] max-w-full flex-col gap-2.5 px-4">
          {MOCK_INTEGRATIONS.map((integration) => (
            <IntegrationRow key={integration.provider} integration={integration} />
          ))}
        </div>
      </div>
    </>
  );
}
