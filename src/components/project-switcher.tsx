import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/utils/cn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { api } from "@/utils/api";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import type { Project, Team } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ProjectSwitcherProps {
  className?: string;
  currentProject: Project;
  teamId: Team["id"];
}

export default function ProjectSwitcher({
  className,
  currentProject,
  teamId,
}: ProjectSwitcherProps) {
  const { data: projects } = api.project.getAllProjectsByTeamId.useQuery({
    teamId: teamId,
  });

  const { asPath } = useRouter();

  const [open, setOpen] = React.useState(false);
  // const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  // const [selectedTeam, setSelectedTeam] = React.useState<Team>(
  //   groups[0].teams[0] as Team
  // );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a team"
          className={cn(
            "h-10 w-52 justify-between truncate whitespace-nowrap px-3 text-gray-900",
            className
          )}
        >
          <Avatar className="mr-2 h-5 w-5">
            <AvatarImage
              src={`https://avatar.vercel.sh/${currentProject.name}.png`}
              alt={currentProject.name}
            />
            <AvatarFallback className="from-primary-700 to-primary-500 mr-2 h-5 w-5 rounded-full bg-gradient-to-br"></AvatarFallback>
          </Avatar>
          <p className="max-w-[140px] truncate text-base font-semibold">
            {currentProject.name}
          </p>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52 rounded-lg bg-white p-0">
        <DropdownMenuSeparator />
        {projects?.length ? (
          projects?.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/team/${teamId}/projects/${project.id}`}
            >
              <DropdownMenuItem
                className="whitespace-nowrap px-3 py-3 font-medium"
                // onClick={() => void signOut()}
              >
                <Avatar className="mr-2 h-6 w-6">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${project.name}.png`}
                    alt={project.name}
                  />
                  <AvatarFallback className="from-primary-700 to-primary-500 mr-2 h-6 w-6 rounded-full bg-gradient-to-br"></AvatarFallback>
                </Avatar>
                <p className="truncate whitespace-nowrap">{project.name}</p>
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    asPath ===
                      `/dashboard/team/${teamId}/projects/${project.id}`
                      ? "text-primary-700 opacity-100"
                      : "opacity-0"
                  )}
                />
              </DropdownMenuItem>
            </Link>
          ))
        ) : (
          <p>No projects yet</p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
