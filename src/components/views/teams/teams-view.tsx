import { GridViewIcon, ListViewIcon } from "@/components/icons";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { type TTeam, ViewTypeEnum } from "types";

import { TableCell, TableRow } from "@/components/ui/table-2";
import { DataTable } from "@/components/ui/data-table-2";
import { teamsListViewColumns } from "./teams-list-view-columns";
import { TeamCard } from "./TeamProjects/Team";
import { CreateTeam } from "./forms/create-team";

export function TeamsView() {
  const {
    data: teams,
    isLoading: isLoadingTeams,
    error: teamsError,
  } = api.team.getAllTeamsByCompanyId.useQuery();

  const [view, setView] = useState<ViewTypeEnum>(ViewTypeEnum.LIST);

  const [search, setSearch] = useState("");

  const filteredTeams = useMemo(() => {
    return teams?.filter((team) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      team.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, teams]);

  function handleViewChange(view: ViewTypeEnum) {
    setView(view);
  }

  return (
    <div>
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-col-reverse items-center justify-between gap-x-6 gap-y-3 pb-[7px] sm:flex-row sm:gap-y-0">
          {/* search */}
          <div className="relative ml-auto w-full flex-1">
            <Search className="absolute left-3 top-3 z-10 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search items"
              className="bg-input/50 pl-9 shadow-none hover:bg-accent/60 md:pl-9"
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

            {/* <ButtonLink
              href="/dashboard/menu/new"
              iconLeft={<Plus className="w-5" />}
            >
              New Product
            </ButtonLink> */}
            <CreateTeam />
          </div>
        </div>
        <div className="flex flex-col sm:gap-4 sm:py-4">
          <main className="grid flex-1 items-start gap-4 py-4 sm:py-0 md:gap-8">
            {view === ViewTypeEnum.LIST && (
              <TeamsListView
                data={filteredTeams}
                isLoading={isLoadingTeams}
                error={teamsError}
              />
            )}
            {view === ViewTypeEnum.GRID && (
              <TeamsGridView teams={filteredTeams} loading={isLoadingTeams} />
            )}
            <div className="text-foreground-muted text-xs">
              <strong>{filteredTeams?.length}</strong>{" "}
              {filteredTeams?.length === 1 ? "team" : "teams"}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function TeamsGridView({
  teams,
  loading,
}: {
  teams: TTeam[];
  loading: boolean;
}) {
  if (loading) {
    return "Loading...";
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}

export function TeamsListView({
  data,
  isLoading = false,
  error,
}: {
  data: TTeam[];
  isLoading: boolean;
  error: unknown;
}) {
  if (isLoading) {
    return <ListItemLoaderUI />;
  }

  return <DataTable columns={teamsListViewColumns} data={data} />;
}

function ListItemLoaderUI() {
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell"></TableCell>
      <TableCell className="py-3 text-sm text-muted-foreground">
        - no teams found
      </TableCell>
      <TableCell></TableCell>
      <TableCell className="hidden md:table-cell"></TableCell>
      <TableCell className="hidden md:table-cell"></TableCell>
      <TableCell className="hidden md:table-cell"></TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
}
