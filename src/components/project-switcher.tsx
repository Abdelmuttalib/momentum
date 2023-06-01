"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";

import cn from "@/utils/cn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
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

const groups = [
  // {
  //   label: "Personal Account",
  //   teams: [
  //     {
  //       label: "Alicia Koch",
  //       value: "personal",
  //     },
  //   ],
  // },
  {
    label: "Teams",
    teams: [
      {
        label: "Acme Inc.",
        value: "acme-inc",
      },
      {
        label: "Monsters Inc.",
        value: "monsters",
      },
    ],
  },
];

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
  const { data: projects } = api.project.getAllProjectsByTeam.useQuery({
    teamId: teamId,
  });

  const { asPath, push } = useRouter();

  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
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
            "w-[250px] justify-between truncate whitespace-nowrap text-gray-900",
            className
          )}
        >
          <Avatar className="mr-2 h-6 w-6">
            <AvatarImage
              src={`https://avatar.vercel.sh/${currentProject.name}.png`}
              alt={currentProject.name}
            />
            <AvatarFallback className="mr-2 h-6 w-6 rounded-full bg-gradient-to-br from-primary-700 to-primary-500"></AvatarFallback>
          </Avatar>
          <p className="max-w-[180px] truncate">{currentProject.name}</p>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[250px] rounded-lg bg-white p-0">
        <DropdownMenuSeparator />
        {projects?.length ? (
          projects?.map((project) => (
            <Link
              key={project.id}
              href={`/team/${teamId}/projects/${project.id}`}
            >
              <DropdownMenuItem
                className="whitespace-nowrap px-3 py-3 font-medium"
                // onClick={() => void signOut()}
              >
                <Avatar className="mr-2 h-6 w-6">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${currentProject}.png`}
                    alt={project.name}
                  />
                  <AvatarFallback className="mr-2 h-6 w-6 rounded-full bg-gradient-to-br from-primary-700 to-primary-500"></AvatarFallback>
                </Avatar>
                <p className="truncate whitespace-nowrap">{project.name}</p>
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    asPath === `/team/${teamId}/projects/${project.id}`
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
