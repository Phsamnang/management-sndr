import { authService } from "@/service/auth-service";
import { AuthOptions, Session } from "next-auth";
import { JWT} from "next-auth/jwt";
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
      async jwt({ token, user }: { token: JWT, user: any }) {
      // Attach the token to the JWT if the user object is available (on successful login)
      if (user) {
        token.user = user;
        token.accessToken = user.token; // Store the Spring token in the JWT
      }
      return token;
    },
    async session({ session, token }: { session: Session, token: JWT }) {
      // Pass the JWT token (including the Spring token) to the session
      session.user = token.user;
      session.accessToken = token.accessToken; // Expose the token in the session
      return session;
    },
  },
};


declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as
   * a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User;
    accessToken?: string;
  }
}