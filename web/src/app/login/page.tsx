import { signIn } from "@/auth";

/** Auth.js trả `error` qua query string khi redirect về `pages.error` (đang trỏ về /login). */
const ERROR_MESSAGES: Record<string, string> = {
  AccessDenied:
    "Email này chưa được cấp quyền đăng nhập. Hãy chọn đúng tài khoản Google đã cấu hình trong ALLOWED_EMAIL.",
  Configuration:
    "App chưa cấu hình đúng (thiếu AUTH_GOOGLE_ID/AUTH_GOOGLE_SECRET hoặc AUTH_SECRET). Kiểm tra .env.local.",
};
const DEFAULT_ERROR_MESSAGE = "Đăng nhập thất bại. Thử lại nhé.";

export default async function LoginPage(props: PageProps<"/login">) {
  const searchParams = await props.searchParams;
  const errorCode =
    typeof searchParams.error === "string" ? searchParams.error : undefined;
  const errorMessage = errorCode
    ? (ERROR_MESSAGES[errorCode] ?? DEFAULT_ERROR_MESSAGE)
    : undefined;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-app-bg px-4">
      <div className="flex items-center gap-2.5">
        <div className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-accent font-serif text-lg font-semibold text-white">
          T
        </div>
        <div className="font-serif text-2xl font-semibold text-text">
          Trợ lý
        </div>
      </div>

      <div className="flex w-full max-w-[360px] flex-col gap-5 rounded-2xl border border-border bg-white p-7 text-center">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-serif text-xl font-semibold text-text">
            Đăng nhập
          </h1>
          <p className="text-sm text-text-muted">
            Đăng nhập để sử dụng Trợ lý AI cá nhân của bạn
          </p>
        </div>

        {errorMessage ? (
          <div
            role="alert"
            className="rounded-xl border border-danger-border bg-danger-bg px-4 py-3 text-left text-sm text-danger-text"
          >
            {errorMessage}
          </div>
        ) : null}

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2.5 rounded-[10px] bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-hover"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#EA4335"
                d="M12 10.2v3.9h5.5c-.24 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.9 1.5l2.6-2.6C16.9 2.9 14.7 2 12 2 6.9 2 2.7 6.1 2.7 11.2S6.9 20.4 12 20.4c6.9 0 9.3-4.8 9.3-7.3 0-.5 0-.9-.1-1.2H12z"
              />
            </svg>
            Đăng nhập với Google
          </button>
        </form>
      </div>
    </div>
  );
}
