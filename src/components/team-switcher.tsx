"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";

import cn from "@/utils/cn";
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
import type { Team } from "@prisma/client";

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

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TeamSwitcherProps extends PopoverTriggerProps {
  className?: string;
  currentTeam: Team;
}

export default function TeamSwitcher({
  className,
  currentTeam,
}: TeamSwitcherProps) {
  const { data: session } = useSession();
  const { data: teams } = api.team.admin.getAllTeamsByOrganization.useQuery({
    organizationId: session?.user?.organizationId as string,
  });

  const { asPath, push } = useRouter();

  console.log("in: ", teams);

  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  // const [selectedTeam, setSelectedTeam] = React.useState<Team>(
  //   groups[0].teams[0] as Team
  // );

  const selectedTeam = teams?.find((team) => `/team/${team.id}` === asPath);
  console.log("sss: ", selectedTeam);

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
              src={`https://avatar.vercel.sh/${currentTeam.name}.png`}
              alt={currentTeam.name}
            />
            <AvatarFallback className="mr-2 h-6 w-6 rounded-full bg-gradient-to-br from-primary-700 to-primary-500"></AvatarFallback>
          </Avatar>
          <p className="max-w-[180px] truncate">{currentTeam.name}</p>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[250px] rounded-lg bg-white p-0">
        <DropdownMenuSeparator />
        {teams?.map((team) => (
          <Link key={team.id} href={`/team/${team.id}`}>
            <DropdownMenuItem
              className="whitespace-nowrap px-3 py-3 font-medium"
              // onClick={() => void signOut()}
            >
              <Avatar className="mr-2 h-6 w-6">
                <AvatarImage
                  src={`https://avatar.vercel.sh/monsters.png`}
                  alt={team.name}
                />
                <AvatarFallback className="mr-2 h-6 w-6 rounded-full bg-gradient-to-br from-primary-700 to-primary-500"></AvatarFallback>
              </Avatar>
              <p className="truncate whitespace-nowrap">{team.name}</p>
              <Check
                className={cn(
                  "ml-auto h-4 w-4",
                  asPath === `/team/${team.id}`
                    ? "text-primary-700 opacity-100"
                    : "opacity-0"
                )}
              />
            </DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
