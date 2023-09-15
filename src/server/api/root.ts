import { createTRPCRouter } from "@/server/api/trpc";
import { teamRouter } from "./routers/team";
import { projectRouter } from "./routers/project";
import { taskRouter } from "./routers/task";
import { companyRouter } from "./routers/company";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  company: companyRouter,
  team: teamRouter,
  project: projectRouter,
  task: taskRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
