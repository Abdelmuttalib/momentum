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
import type { User } from "@prisma/client";

const saltRounds = 10;

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
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }: {token: any, user: User}) {
      // if (user && user.phoneNumber) {
      //   token.phoneNumber = user.phoneNumber;
      // }
      // if (user && user.id) {
      //   token.id = user.id;
      // }
      // console.log("USER JWT: ", user);
      // return token;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return {
        ...token,
        ...(user && user.id ? { id: user.id } : {}),
        ...(user && user.phoneNumber ? { phoneNumber: user.phoneNumber } : {}),
        ...(user && user.role ? { role: user.role } : {}),
      };
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          ...(token && token.id ? { id: token.id } : {}),
          ...(token && token.phoneNumber
            ? { phoneNumber: token.phoneNumber }
            : {}),
          ...(token && token.role ? { role: token.role } : {}),
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
        if (!credentials?.phoneNumber || !credentials?.password) {
          return Promise.resolve(null);
        }
        const user = await prisma.user.findUnique({
          where: {
            phoneNumber: credentials?.phoneNumber,
          },
        });

        if (!user) {
          return Promise.resolve(null);
        }

        const hashedPassword = await bcrypt.hash(
          credentials?.password,
          saltRounds
        );

        console.log("user: ", user);
        if (user && credentials) {
          console.log("credentials: ", credentials);
          // Any object returned will be saved in `user` property of the JWT
          const isPasswordMatch = await bcrypt.compare(
            credentials?.password,
            hashedPassword
          );
          console.log(isPasswordMatch);
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
