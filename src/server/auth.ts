// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/server/db";
import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import type { Invitation, Role, User } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      image?: string;
      role: Role;
      companyId: string;
      emailVerified: boolean;
      sentInvitations?: Invitation[];
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  callbacks: {
    jwt({ token, user }: { token: any; user: User }) {
      // if (user && user.phoneNumber) {
      //   token.phoneNumber = user.phoneNumber;
      // }
      // if (user && user.id) {
      //   token.id = user.id;
      // }
      // return token;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return {
        ...token,
        ...(user && user.id ? { id: user.id } : {}),
        ...(user && user.email ? { email: user.email } : {}),
        ...(user && user.emailVerified
          ? { emailVerified: user.emailVerified }
          : {}),
        ...(user && user.role ? { role: user.role } : {}),
        ...(user && user.companyId ? { companyId: user.companyId } : {}),
      };
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          ...(token && token.id ? { id: token.id } : {}),
          ...(token && token.email ? { email: token.email } : {}),
          ...(token && token.emailVerified
            ? { emailVerified: token.emailVerified }
            : {}),
          ...(token && token.role ? { role: token.role } : {}),
          ...(token && token.companyId ? { companyId: token.companyId } : {}),
        },
      };
    },
  },
  // adapter: PrismaAdapter(prisma),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/ban-ts-comment

  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return Promise.resolve(null);
        }
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        if (!user) {
          return Promise.resolve(null);
        }

        if (user && credentials) {
          // Any object returned will be saved in `user` property of the JWT
          const isPasswordMatch = await bcrypt.compare(
            credentials?.password,
            user.password
          );
          if (isPasswordMatch) {
            return Promise.resolve(user);
          }
        } else {
          // If you return null or false then the credentials will be rejected
          return Promise.resolve(null);
          // You can also Reject this callback with an Error or with a URL:
          // throw new Error('error message') // Redirect to error page
          // throw '/path/to/redirect'        // Redirect to a URL
        }
      },
    }),
    // DiscordProvider({
    //   clientId: env.DISCORD_CLIENT_ID,
    //   clientSecret: env.DISCORD_CLIENT_SECRET,
    // }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
