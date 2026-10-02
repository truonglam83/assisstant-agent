import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Chỉ cho phép đúng một email đăng nhập (chủ app).
// Xem IDEAS.md §9 (Bảo mật và đăng nhập).
const ALLOWED_EMAIL = process.env.ALLOWED_EMAIL;

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ profile }) {
      if (!ALLOWED_EMAIL) {
        console.error(
          "ALLOWED_EMAIL chưa được cấu hình trong .env.local — từ chối mọi đăng nhập.",
        );
        return false;
      }
      if (profile?.email !== ALLOWED_EMAIL) {
        console.warn(
          `Từ chối đăng nhập: email "${profile?.email}" khác với ALLOWED_EMAIL "${ALLOWED_EMAIL}".`,
        );
        return false;
      }
      return true;
    },
    async session({ session }) {
      return session;
    },
  },
});
