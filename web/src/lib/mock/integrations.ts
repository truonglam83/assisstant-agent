// Dữ liệu mẫu — xem docs/DATABASE.md §3 (`integrations`).

export type MockIntegration = {
  provider: "google";
  label: string;
  connected: boolean;
  accountEmail?: string;
  scopes: string[];
};

export const MOCK_INTEGRATIONS: MockIntegration[] = [
  {
    provider: "google",
    label: "Gmail",
    connected: true,
    accountEmail: "ban@gmail.com",
    scopes: ["gmail.send"],
  },
];
