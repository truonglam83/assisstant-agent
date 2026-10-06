import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import { SignJWT } from "jose";

declare module "next-auth" {
  interface Session {
    apiToken?: string;
    user: {
      id?: string;
    } & DefaultSession["user"];
  }
}

// Chỉ cho phép đúng một email đăng nhập (chủ app).
// Xem IDEAS.md §9 (Bảo mật và đăng nhập).
const ALLOWED_EMAIL = process.env.ALLOWED_EMAIL;

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
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
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id ?? user.email ?? token.sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && process.env.AUTH_SECRET) {
        const secretKey = new TextEncoder().encode(process.env.AUTH_SECRET);
        const apiToken = await new SignJWT({
          email: session.user.email,
          name: session.user.name,
          sub: token.sub ?? session.user.email,
        })
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt()
          .setExpirationTime("30d")
          .sign(secretKey);

        session.apiToken = apiToken;
      }
      return session;
    },
  },
});
