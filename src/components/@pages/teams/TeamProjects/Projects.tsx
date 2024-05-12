/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Project as ProjectType } from "@prisma/client";
import Project, { ProjectLoader } from "./Project";

interface ProjectsProps {
  projects: ProjectType[] | undefined;
  loading: boolean;
}

export default function Projects({ projects, loading }: ProjectsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {!loading &&
        projects?.map((project) => <Project key={project.id} {...project} />)}
      {loading &&
        !projects &&
        [...Array(6)].map((_, i) => <ProjectLoader key={i} />)}
    </div>
  );
}
