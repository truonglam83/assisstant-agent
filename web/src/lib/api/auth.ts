import { callApi } from "./http";

export interface AuthMeResponse {
  authenticated: boolean;
  user?: {
    email: string;
    name?: string;
    sub?: string;
  };
}

export const authApi = {
  getMe(): Promise<AuthMeResponse> {
    return callApi<AuthMeResponse>("/auth/me", { method: "GET" }, async () => ({
      authenticated: false,
    }));
  },
};
