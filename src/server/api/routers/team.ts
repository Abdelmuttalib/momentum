/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Role } from "@prisma/client";

const teamAdminRouter = createTRPCRouter({
  createTeam: protectedProcedure
    .input(z.object({ name: z.string(), organizationId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const newTeam = await ctx.prisma.team.create({
        data: {
          name: input.name,
          organization: {
            connect: { id: input.organizationId },
          },
        },
      });
      return newTeam;
    }),

  deleteTeam: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // const project = await ctx.prisma.;
      await ctx.prisma.project.deleteMany({
        where: {
          teamId: input.id,
        },
      });

      await ctx.prisma.team.delete({
        where: { id: input.id },
      });
    }),

  getAllTeamsByOrganization: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const organizationsTeams = await ctx.prisma.team.findMany({
        where: {
          organizationId: input.organizationId,
        },
        include: {
          users: {
            select: {
              id: true,
              phoneNumber: true,
              firstName: true,
              lastName: true,
              email: true,
              emailVerified: true,
              image: true,
              role: true,
            },
          },
          projects: true,
        },
      });
      return organizationsTeams;
    }),

  getTeamByTeamId: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ input, ctx }) => {
      const team = await ctx.prisma.team.findUnique({
        where: {
          id: input.teamId,
        },
        include: {
          users: {
            select: {
              id: true,
              phoneNumber: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
        },
      });
      return team;
    }),
  // allTeams: publicProcedure.query(async ({ ctx }) => {
  //   const teams: Team[] = await ctx.prisma.team.findMany({
  //     include: {
  //       users: {
  //         select: {
  //           id: true,
  //           phoneNumber: true,
  //           firstName: true,
  //           lastName: true,
  //           email: true,
  //           emailVerified: true,
  //           image: true,
  //           role: true,
  //         },
  //       },
  //     },
  //   });
  //   return teams;
  // }),

  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      where: {
        role: {
          not: Role.ADMIN,
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

const userAdminRouter = createTRPCRouter({
  getUserTeams: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
        include: { teams: true },
      });
      return user?.teams;
    }),

  getTeamUsers: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ input, ctx }) => {
      const team = await ctx.prisma.team.findUnique({
        where: { id: input.teamId },
        include: { users: true },
      });
      return team?.users;
    }),
});

export const teamRouter = createTRPCRouter({
  admin: teamAdminRouter,
  user: userAdminRouter,
});
