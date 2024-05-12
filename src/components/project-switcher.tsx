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
  // DropdownMenuSeparator,
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
          aria-expanded={open}
          aria-label="Select a team"
          className={cn(
            "h-9 w-52 justify-between truncate whitespace-nowrap px-3 text-gray-900",
            className
          )}
        >
          <Avatar className="mr-2 h-5 w-5">
            <AvatarImage
              src={`https://avatar.vercel.sh/${currentProject.name}.png`}
              alt={currentProject.name}
            />
            <AvatarFallback className="mr-2 h-5 w-5 rounded-full bg-gradient-to-br from-primary-700 to-primary-500"></AvatarFallback>
          </Avatar>
          <p className="max-w-[140px] truncate font-medium">
            {currentProject.name}
          </p>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52 rounded-lg bg-white p-1">
        {projects?.length ? (
          projects?.map((project) => (
            <Link
              key={project.id}
              href={`/teams/${teamId}/projects/${project.id}`}
            >
              <DropdownMenuItem
                className="whitespace-nowrap px-2 py-2.5 font-medium focus:bg-primary-100/50"
                // onClick={() => void signOut()}
              >
                <Avatar className="mr-2 h-5 w-5">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${project.name}.png`}
                    alt={project.name}
                  />
                  <AvatarFallback className="mr-2 h-5 w-5 rounded-full bg-gradient-to-br from-primary-700 to-primary-500"></AvatarFallback>
                </Avatar>
                <p className="truncate whitespace-nowrap">{project.name}</p>
                <Check
                  className={cn(
                    "ml-auto h-5 w-5",
                    asPath === `/teams/${teamId}/projects/${project.id}`
                      ? "text-brand-600 opacity-100"
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
