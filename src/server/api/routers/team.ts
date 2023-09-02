/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";

import {
  createTRPCRouter,
  protectedAdminProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

export const teamRouter = createTRPCRouter({
  // admin
  createTeam: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const companyId = ctx.session.user.company.id;
      const userId = ctx.session.user.id;
      const newTeam = await ctx.prisma.team.create({
        data: {
          name: input.name,
          company: {
            connect: { id: companyId },
          },
          users: {
            connect: { id: userId },
          },
        },
      });
      return newTeam;
    }),

  deleteTeam: protectedAdminProcedure
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

  getAllTeamsByCompanyId: protectedProcedure.query(async ({ ctx }) => {
    const companyId = ctx.session.user.company.id;
    const companyTeams = await ctx.prisma.team.findMany({
      where: {
        companyId,
      },
      include: {
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            emailVerified: true,
            image: true,
            role: true,
          },
        },
        projects: true,
        tasks: true,
      },
    });
    return companyTeams;
  }),

  getTeam: protectedProcedure
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
              firstName: true,
              lastName: true,
              email: true,
              emailVerified: true,
              image: true,
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
    const currentUserId = ctx.session.user.id;
    const users = await ctx.prisma.user.findMany({
      where: {
        id: {
          not: currentUserId,
        },
        // role: {
        //   not: Role.ADMIN,
        // },
      },
      include: { teams: true },
    });
    return users;
  }),

  getTeamMembers: protectedProcedure
    .input(
      z.object({
        teamId: z.string().nonempty(),
      })
    )
    .query(async ({ input, ctx }) => {
      // const companyId = ctx.session.user.company.id;
      const teamMembers = await ctx.prisma.team.findUnique({
        where: {
          id: input.teamId,
        },
        include: {
          users: true,
        },
      });

      return teamMembers;
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

  // user
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

  getAllCompanyMembersByCompanyId: protectedProcedure
    .input(
      z.object({
        companyId: z.string(),
        userId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      // get all users under this company
      const companyMembers = await ctx.prisma.user.findMany({
        where: {
          companyId: input.companyId,
          NOT: {
            id: input.userId,
          },
        },
      });

      return companyMembers;
    }),
});
