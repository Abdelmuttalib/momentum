"use client";

import * as React from "react";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils/cn";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { Project } from "@prisma/client";
import Link from "next/link";

const groups = [
  {
    label: "Personal Account",
    teams: [
      {
        label: "Alicia Koch",
        value: "personal",
      },
    ],
  },
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

const company = {
  label: "Acme Inc.",
  value: "acme-inc",

  teams: [
    {
      label: "Acme Website",
      value: "acme-website",
    },
    {
      label: "Acme Dashboard",
      value: "acme-dashboard",
    },

    {
      label: "Acme API",
      value: "acme-api",
    },
  ],

  projects: [
    {
      label: "Acme Website",
      value: "acme-website",
    },
    {
      label: "Acme Dashboard",
      value: "acme-dashboard",
    },

    {
      label: "Acme API",
      value: "acme-api",
    },
  ],
};

type Team = (typeof groups)[number]["teams"][number];

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

export default function MainSwitcher() {
  const { query, asPath } = useRouter();

  const { data: teams } = api.team.getAllTeamsByCompanyId.useQuery();

  const { teamId, projectId } = query as { teamId: string; projectId: string };
  const currentTeam = teams?.find((team) => team.id === teamId);

  const { data: projects } = api.project.getAllProjectsByTeamId.useQuery(
    {
      teamId: teamId,
    },
    {
      enabled: !!teamId,
    }
  );

  const currentProject = projects?.find(
    (project) => project.id === query.projectId
  );

  const [isTeamPath, isProjectPath] = React.useMemo(() => {
    return [!!teamId, !!projectId];
  }, [teamId, projectId]);

  return (
    <div className="flex items-center gap-x-2">
      <Link
        href="/teams"
        aria-label="logo"
        className="flex items-center space-x-1.5"
      >
        {/* <div aria-hidden="true" className="flex space-x-1">
                  <div className="h-4 w-4 rounded-full bg-gray-900 dark:bg-white"></div>
                  <div className="h-6 w-2 bg-primary"></div>
                </div> */}
        <div className="flex h-7 w-7 items-center justify-center rounded bg-gray-900 font-semibold text-gray-100 dark:border">
          M
        </div>
        {/* <span className="text-2xl font-bold tracking-tighter text-gray-900 dark:text-white">
          Momentum
        </span> */}
      </Link>
      {isTeamPath && (
        <span className="mx-2 text-2xl font-light text-gray-300 dark:text-gray-700">
          /
        </span>
      )}
      {isTeamPath && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage
                src={`https://avatar.vercel.sh/dd.png`}
                alt=""
                // src={`https://avatar.vercel.sh/${selectedTeam.value}.png`}
                // alt={selectedTeam.label}
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <p className="font-medium">team</p>
          </div>
          <Switcher
            // TODO: fix types
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            teams={teams}
            projects={projects}
            // TODO: fix types
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            currentTeam={currentTeam}
            currentProject={currentProject}
          />
        </div>
      )}
      {isProjectPath && (
        <span className="mx-2 text-2xl font-light text-gray-300 dark:text-gray-700">
          /
        </span>
      )}
      {isProjectPath && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage
                src={`https://avatar.vercel.sh/dd.png`}
                alt=""
                // src={`https://avatar.vercel.sh/${selectedTeam.value}.png`}
                // alt={selectedTeam.label}
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <p className="font-medium">{currentProject?.name}</p>
          </div>
          <Switcher
            // TODO: fix types
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            teams={teams}
            projects={projects}
            // TODO: fix types
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            currentTeam={currentTeam}
            currentProject={currentProject}
          />
        </div>
      )}
    </div>
  );
}

type TeamSwitcherProps = PopoverTriggerProps & {
  teams: Team[] | undefined;
  projects: Project[] | undefined;
  currentTeam: Team | undefined;
  currentProject: Project | undefined;
};

function Switcher({
  className,
  teams,
  projects,
  currentTeam,
  currentProject,
}: TeamSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);

  const { query, asPath, push } = useRouter();

  const { teamId, projectId } = query as { teamId: string; projectId: string };

  // <>
  // <Avatar className="mr-2 h-5 w-5">
  //   <AvatarImage
  //     src={`https://avatar.vercel.sh/${selectedTeam.value}.png`}
  //     alt={selectedTeam.label}
  //   />
  //   <AvatarFallback>SC</AvatarFallback>
  // </Avatar>
  // {selectedTeam.label}
  // </>

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            size="icon"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-fit rounded-md border-transparent", className)}
          >
            <CaretSortIcon className="h-5 w-5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="relative flex w-full max-w-2xl flex-col p-2 md:flex-row">
          <span className="absolute right-1 top-1 rounded-md border px-1.5 text-sm">
            Esc
          </span>
          {/* team command */}
          <Command>
            <CommandList>
              <CommandInput placeholder="Search team..." />
              <CommandEmpty>No team found.</CommandEmpty>
              <CommandGroup key="teams-command-group" heading="Teams">
                {teams?.map((team) => (
                  <CommandItem
                    key={team.id}
                    onSelect={() => {
                      // setSelectedTeam(team);
                      setOpen(false);
                      push(`/teams/${team.id}`);
                    }}
                    className="text-sm"
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${team.name}.png`}
                        alt={team.name}
                        // className="grayscale"
                      />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    {team.name}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        currentTeam && currentTeam.id === team.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            {/* <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewTeamDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Team
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList> */}
          </Command>
          {/* project command */}
          <Command>
            <CommandList>
              <CommandInput placeholder="Search project..." />
              <CommandEmpty>No project found.</CommandEmpty>
              <CommandGroup
                key="projects-command-group"
                heading="Projects"
                className=""
              >
                {projects?.map((project) => (
                  <CommandItem
                    key={project.id}
                    onSelect={() => {
                      // setSelectedTeam(team);
                      setOpen(false);
                      push(`/teams/${teamId}/projects/${project.id}`);
                    }}
                    className="text-sm"
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${project.name}.png`}
                        alt={project.name}
                        // className="grayscale"
                      />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    {project.name}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        currentProject && currentProject.id === project.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            {/* <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewTeamDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Project
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList> */}
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
          <DialogDescription>
            Add a new team to manage products and customers.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Team name</Label>
              <Input id="name" placeholder="Acme Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Subscription plan</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">
                    <span className="font-medium">Free</span> -{" "}
                    <span className="text-muted-foreground">
                      Trial for two weeks
                    </span>
                  </SelectItem>
                  <SelectItem value="pro">
                    <span className="font-medium">Pro</span> -{" "}
                    <span className="text-muted-foreground">
                      $9/month per user
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
            Cancel
          </Button>
          <Button type="submit">Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
