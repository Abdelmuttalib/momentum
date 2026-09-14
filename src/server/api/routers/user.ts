import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { safeUserSelect } from "@/server/db/selects";

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      const companyId = ctx.session.user.company.id;
      const user = await ctx.prisma.user.findFirst({
        where: { id: input.userId, companyId },
        select: safeUserSelect,
      });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return user;
    }),

  updateUserInfo: protectedProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        name: z.string().min(1).max(100),
        image: z.string().max(2048).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const companyId = ctx.session.user.company.id;
      const isSelf = input.userId === ctx.session.user.id;
      const isAdmin = ctx.session.user.role === "ADMIN";
      if (!isSelf && !isAdmin) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const existing = await ctx.prisma.user.findFirst({
        where: { id: input.userId, companyId },
        select: { id: true },
      });
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const user = await ctx.prisma.user.update({
        where: { id: input.userId },
        data: {
          name: input.name,
        },
        select: safeUserSelect,
      });
      return user;
    }),

  updateUserProfileImage: protectedProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        image: z.string().max(2048),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const companyId = ctx.session.user.company.id;
      const isSelf = input.userId === ctx.session.user.id;
      const isAdmin = ctx.session.user.role === "ADMIN";
      if (!isSelf && !isAdmin) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const existing = await ctx.prisma.user.findFirst({
        where: { id: input.userId, companyId },
        select: { id: true },
      });
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const user = await ctx.prisma.user.update({
        where: { id: input.userId },
        data: {
          image: input.image,
        },
        select: safeUserSelect,
      });
      return user;
    }),
});
