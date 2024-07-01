/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Project as ProjectType } from "@prisma/client";
import Project, { ProjectLoader } from "./Project";
import { useMemo, useState } from "react";
import { api } from "@/utils/api";
import { IconButton } from "@/components/ui/icon-button";
import { GridViewIcon, ListViewIcon } from "@/components/icons";
import { Plus, Search } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { projectsListViewColumns } from "./projects-list-view-columns";
import { DataTable } from "@/components/ui/data-table-2";
import { Input } from "@/components/ui/input";
import { ProjectsListView } from "./projects-list-view";

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

enum ViewTypeEnum {
  LIST = "list",
  GRID = "grid",
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
    return projects?.filter((item) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      item.name.toLowerCase().includes(search.toLowerCase())
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
            <Search className="text-muted-foreground absolute left-4 top-3 h-5 w-5" />
            <Input
              type="search"
              placeholder="Search items"
              className="h-11 w-full rounded-md border-none bg-background pl-12 shadow-none hover:bg-accent-hover/60"
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
            <ButtonLink
              href="/dashboard/menu/new"
              iconLeft={<Plus className="w-5" />}
            >
              New Product
            </ButtonLink>
          </div>
        </div>
        <div className="flex flex-col sm:gap-4 sm:py-4">
          <main className="grid flex-1 items-start gap-4 py-4 sm:py-0 md:gap-8">
            {view === ViewTypeEnum.LIST && (
              <ProjectsListView data={projects} isLoading={isLoadingCompanyProjects} error={companyProjectsError} />
            )}
            {view === ViewTypeEnum.GRID && (
              <Projects projects={projects} loading={isLoadingCompanyProjects} />
            )}
            <div className="text-xs text-foreground-muted">
              <strong>{filteredProjects?.length}</strong> items
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
