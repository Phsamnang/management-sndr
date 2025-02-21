import { authService } from "@/service/auth-service";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        const user = await authService.login(credentials);
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
  },
};


declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as
   * a prop on the `SessionProvider` React Context
   */
  interface Session {
    refreshTokenExpires?: number;
    accessTokenExpires?: number;
    refreshToken?: string;
    accessToken?: string;
    error?: string;
    user?: User;
    visitor_id?: string;
  }

  interface User {
    status: {
      code: number;
      message: string;
    };
    data: {
      access_token: string;
      token_type: string;
      expires_in: number;
      refresh_token: string;
    };
    sub: string;
    scope: string;
    biller_id: string;
    visitor_id?: string;
  }
}   