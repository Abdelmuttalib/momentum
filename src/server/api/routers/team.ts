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
import { TaskStatus } from "@/utils/enums";
import { createTeamFormSchema } from "@/schema";

export const teamRouter = createTRPCRouter({
  // admin
  createTeam: protectedProcedure
    .input(createTeamFormSchema)
    .mutation(async ({ input, ctx }) => {
      const companyId = ctx.session.user.company.id;
      const userId = ctx.session.user.id;
      const newTeam = await ctx.prisma.team.create({
        data: {
          name: input.name,
          description: input.description,
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

  updateTeamName: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const team = await ctx.prisma.team.update({
        where: { id: input.teamId },
        data: {
          name: input.name,
        },
      });
      return team;
    }),

  getAllTeamsByCompanyId: protectedProcedure.query(async ({ ctx }) => {
    const companyId = ctx.session.user.company.id;
    const companyTeams = await ctx.prisma.team.findMany({
      where: {
        companyId,
      },
      include: {
        users: true,
        projects: true,
        tasks: true,
      },
    });
    return companyTeams;
  }),

  getTeamTasksCompletedThisWeek: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ input, ctx }) => {
      const dateToday = new Date();
      const tasksCompletedThisWeek = await ctx.prisma.team.findMany({
        where: {
          id: input.teamId,
          tasks: {
            some: {
              status: TaskStatus.COMPLETED,
              updatedAt: {
                gte: dateToday.toISOString(),
              },
            },
          },
        },
        include: {},
      });
      return tasksCompletedThisWeek;
    }),

  getTeam: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ input, ctx }) => {
      const team = await ctx.prisma.team.findUnique({
        where: {
          id: input.teamId,
        },
        include: {
          users: true,
          projects: true,
          // users: {
          //   select: {
          //     id: true,
          //     name: true,
          //     email: true,
          //     emailVerified: true,
          //     image: true,
          //     role: true,
          //   },
          // },
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
  //           name: true,
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
        teamId: z.string(),
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

      console.log("input", input, teamMembers);

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
