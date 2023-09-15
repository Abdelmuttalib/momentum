/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
      });
      return user;
    }),

  updateUserInfo: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.update({
        where: { id: input.userId },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
        },
      });
      return user;
    }),

  updateUserProfileImage: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        image: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.update({
        where: { id: input.userId },
        data: {
          image: input.image,
        },
      });
      return user;
    }),
});
