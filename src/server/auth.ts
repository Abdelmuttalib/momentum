import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  type User as NextAuthUser,
} from "next-auth";
import { prisma } from "@/server/db";
import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import type { Company, Invitation, Role, User } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type JWT } from "next-auth/jwt";
import { type AdapterUser } from "next-auth/adapters";

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
      name: string;
      email: string;
      image?: string;
      role: Role;
      emailVerified: boolean;
      sentInvitations?: Invitation[];
      company: Company;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    // Explicit rolling-session behavior (matches NextAuth v4 defaults).
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: NextAuthUser | AdapterUser;
    }) {
      const companyId =
        user && "companyId" in user
          ? (user as Pick<User, "companyId">).companyId
          : undefined;
      let company: Company | null = null;

      if (companyId) {
        company = await prisma.company.findUnique({
          where: {
            id: companyId,
          },
        });
      }
      const appUser = user as Partial<User> | undefined;
      return {
        ...token,
        ...(appUser?.id ? { id: appUser.id } : {}),
        ...(appUser?.name ? { name: appUser.name } : {}),
        ...(appUser?.email ? { email: appUser.email } : {}),
        ...(appUser?.emailVerified
          ? { emailVerified: appUser.emailVerified }
          : {}),
        ...(appUser?.role ? { role: appUser.role } : {}),
        ...(company ? { company: company } : {}),
      };
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          ...(token?.id ? { id: token.id } : {}),
          ...(token?.name ? { name: token.name } : {}),
          ...(token?.email ? { email: token.email } : {}),
          ...(token?.emailVerified
            ? { emailVerified: token.emailVerified }
            : {}),
          ...(token?.role ? { role: token.role } : {}),
          ...(token?.company ? { company: token.company } : {}),
        },
      };
    },
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return Promise.resolve(null);
        }
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
          include: {
            company: true,
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
          return Promise.resolve(null);
        } else {
          // If you return null or false then the credentials will be rejected
          return Promise.resolve(null);
          // You can also Reject this callback with an Error or with a URL:
          // throw new Error('error message') // Redirect to error page
          // throw '/path/to/redirect'        // Redirect to a URL
        }
      },
    }),
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
