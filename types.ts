import type { Project, Team, User } from "@prisma/client";
import { type Session } from "next-auth";

export type TTeam = Team & {
  users: User[];
  projects: Project[];
};

export interface TNextAuthSession {
  session: Session | null;
}
