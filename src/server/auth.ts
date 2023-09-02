/* eslint-disable @typescript-eslint/no-unsafe-return */
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
import type { Company, Invitation, Role, User } from "@prisma/client";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { default as jsonwebtoken } from "jsonwebtoken";

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
      // companyId: string;
      emailVerified: boolean;
      sentInvitations?: Invitation[];
      company: Company;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }),
  // adapter: PrismaAdapter(prisma),
  callbacks: {
    async jwt({ token, user }: { token: any; user: User }) {
      // if (user && user.phoneNumber) {
      //   token.phoneNumber = user.phoneNumber;
      // }
      // if (user && user.id) {
      //   token.id = user.id;
      // }
      // return token;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      let company: Company;

      if (user && user.companyId) {
        company = await prisma.company.findUnique({
          where: {
            id: user.companyId,
          },
        });
      }
      return {
        ...token,
        ...(user && user.id ? { id: user.id } : {}),
        ...(user && user.firstName ? { firstName: user.firstName } : {}),
        ...(user && user.lastName ? { lastName: user.lastName } : {}),
        ...(user && user.email ? { email: user.email } : {}),
        ...(user && user.emailVerified
          ? { emailVerified: user.emailVerified }
          : {}),
        ...(user && user.role ? { role: user.role } : {}),
        ...(company ? { company: company } : {}),
      };
    },
    session: ({ session, token }) => {
      const signingSecret = process.env.SUPABASE_JWT_SECRET;
      if (signingSecret) {
        const payload = {
          aud: "authenticated",
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: token.id,
          email: token.email,
          role: "authenticated",
        };
        session.supabaseAccessToken = jsonwebtoken.sign(payload, signingSecret);
      }
      return {
        ...session,
        user: {
          ...session.user,
          ...(token && token.id ? { id: token.id } : {}),
          ...(token && token.firstName ? { firstName: token.firstName } : {}),
          ...(token && token.lastName ? { lastName: token.lastName } : {}),
          ...(token && token.email ? { email: token.email } : {}),
          ...(token && token.emailVerified
            ? { emailVerified: token.emailVerified }
            : {}),
          ...(token && token.role ? { role: token.role } : {}),
          ...(token && token.company ? { company: token.company } : {}),
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
