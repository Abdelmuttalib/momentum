/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Project as ProjectType } from "@prisma/client";
import Project, { ProjectLoader } from "./Project";

interface ProjectsProps {
  projects: ProjectType[] | undefined;
  loading: boolean;
}

export default function Projects({ projects, loading }: ProjectsProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {!loading &&
        projects?.map((project) => <Project key={project.id} {...project} />)}
      {loading &&
        !projects &&
        [...Array(6)].map((_, i) => <ProjectLoader key={i} />)}
    </div>
  );
}
