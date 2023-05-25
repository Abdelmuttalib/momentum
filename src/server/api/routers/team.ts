/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import type { Team } from "@prisma/client";

export const teamRouter = createTRPCRouter({
  createTeam: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const newTeam = await ctx.prisma.team.create({
        data: {
          name: input.name,
        },
      });
      return newTeam;
    }),

  deleteTeam: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.team.delete({
        where: { id: input.id },
      });
    }),

  allTeams: publicProcedure.query(async ({ ctx }) => {
    const teams: Team[] = await ctx.prisma.team.findMany({
      include: {
        users: {
          select: {
            id: true,
            phoneNumber: true,
            name: true,
            email: true,
            emailVerified: true,
            image: true,
            role: true,
          },
        },
      },
    });
    return teams;
  }),

  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      where: {
        role: {
          not: "Admin",
        },
      },
      include: { teams: true },
    });
    return users;
  }),

  addUserToTeam: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const team = await ctx.prisma.team.update({
        where: { id: input.teamId },
        data: {
          users: {
            connect: { id: input.userId },
          },
        },
      });
      return team;
    }),
  removeUserFromTeam: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const team = await ctx.prisma.team.update({
        where: { id: input.teamId },
        data: {
          users: {
            disconnect: { id: input.userId },
          },
        },
      });
      return team;
    }),
});
