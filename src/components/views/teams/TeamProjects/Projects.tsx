/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Project as ProjectType } from "@prisma/client";
import Project, { ProjectLoader } from "./Project";
import { useMemo, useState } from "react";
import { api } from "@/utils/api";
import { IconButton } from "@/components/ui/icon-button";
import { GridViewIcon, ListViewIcon } from "@/components/icons";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProjectsListView } from "./projects-list-view";
import { ViewTypeEnum } from "types";

interface ProjectsProps {
  projects: ProjectType[] | undefined;
  loading: boolean;
}

export default function Projects({ projects, loading }: ProjectsProps) {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!projects) {
    return <div>No projects found</div>;
  }

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

export function ProjectsView() {
  const {
    data: projects,
    isLoading: isLoadingCompanyProjects,
    error: companyProjectsError,
  } = api.company.getCompanyProjects.useQuery();

  const [view, setView] = useState<ViewTypeEnum>(ViewTypeEnum.LIST);

  const [search, setSearch] = useState("");

  const filteredProjects = useMemo(() => {
    return projects?.filter((project) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      project.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, projects]);

  function handleViewChange(view: ViewTypeEnum) {
    setView(view);
  }

  return (
    <div>
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-col-reverse items-center justify-between gap-x-6 gap-y-3 pb-[7px] sm:flex-row sm:gap-y-0">
          {/* search */}
          <div className="relative ml-auto w-full flex-1">
            <Search className="absolute left-3 top-[1.13rem] z-10 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search items"
              className="h-11 w-full rounded-md border-none bg-background pl-9 shadow-none hover:bg-accent/60 md:pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {/* actions */}
          <div className="flex w-full items-center gap-x-2 sm:w-auto">
            <IconButton
              size="sm"
              variant={view === ViewTypeEnum.LIST ? "secondary" : "ghost"}
              onClick={() => handleViewChange(ViewTypeEnum.LIST)}
            >
              <ListViewIcon />
            </IconButton>
            <IconButton
              size="sm"
              variant={view === ViewTypeEnum.GRID ? "secondary" : "ghost"}
              onClick={() => handleViewChange(ViewTypeEnum.GRID)}
            >
              <GridViewIcon />
            </IconButton>

            {/* <CreateTeam /> */}
            {/* <ButtonLink
              href="/dashboard/menu/new"
              iconLeft={<Plus className="w-5" />}
            >
              New Product
            </ButtonLink> */}
          </div>
        </div>
        <div className="flex flex-col sm:gap-4 sm:py-4">
          <main className="grid flex-1 items-start gap-4 py-4 sm:py-0 md:gap-8">
            {view === ViewTypeEnum.LIST && (
              <ProjectsListView
                data={filteredProjects}
                isLoading={isLoadingCompanyProjects}
                error={companyProjectsError}
              />
            )}
            {view === ViewTypeEnum.GRID && (
              <Projects
                projects={filteredProjects}
                loading={isLoadingCompanyProjects}
              />
            )}
            <div className="text-foreground-muted text-xs">
              <strong>{filteredProjects?.length}</strong> items
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
