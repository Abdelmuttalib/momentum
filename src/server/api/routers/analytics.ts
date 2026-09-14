import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getCompanyOverview } from "@/server/analytics/company";
import { getProjectOverview } from "@/server/analytics/project";
import { getUserOverview } from "@/server/analytics/user";
import { getDashboardOverview } from "@/server/analytics/dashboard";

const rangeSchema = z.enum(["7d", "30d", "90d", "all"]);

export const analyticsRouter = createTRPCRouter({
  companyOverview: protectedProcedure
    .input(z.object({ range: rangeSchema.optional().default("30d") }))
    .query(async ({ input, ctx }) => {
      const companyId = ctx.session.user.company.id;
      return getCompanyOverview(ctx.prisma, companyId, input.range);
    }),

  projectOverview: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1),
        range: rangeSchema.optional().default("30d"),
      })
    )
    .query(async ({ input, ctx }) => {
      const companyId = ctx.session.user.company.id;
      return getProjectOverview(
        ctx.prisma,
        companyId,
        input.projectId,
        input.range
      );
    }),

  userOverview: protectedProcedure
    .input(z.object({ range: rangeSchema.optional().default("30d") }))
    .query(async ({ ctx, input }) => {
      const companyId = ctx.session.user.company.id;
      // Identity strictly from the session — no userId input exists,
      // so one user can never request another user's analytics.
      return getUserOverview(
        ctx.prisma,
        companyId,
        ctx.session.user.id,
        input.range
      );
    }),

  dashboardOverview: protectedProcedure.query(async ({ ctx }) => {
    const companyId = ctx.session.user.company.id;
    return getDashboardOverview(ctx.prisma, companyId, ctx.session.user.id);
  }),
});
