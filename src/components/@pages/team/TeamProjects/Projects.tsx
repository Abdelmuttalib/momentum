import type { Project as ProjectType, Team } from "@prisma/client";
import Project from "./Project";

interface ProjectsProps {
  team: Team;
  projects: ProjectType[] | undefined;
}

export default function Projects({ projects }: ProjectsProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {projects?.map((project) => (
        <Project key={project.id} {...project} />
      ))}
    </div>
  );
}
