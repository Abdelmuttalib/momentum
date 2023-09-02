import * as React from "react";
import {
  Check,
  ChevronsUpDown,
  // PlusCircle
} from "lucide-react";

import { cn } from "@/utils/cn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { useRouter } from "next/router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { api } from "@/utils/api";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TeamSwitcherProps {
  className?: string;
}

export default function TeamSwitcher({ className }: TeamSwitcherProps) {
  const { query, asPath } = useRouter();

  const [open, setOpen] = React.useState(false);

  const { data: teams } = api.team.getAllTeamsByCompanyId.useQuery();

  const { teamId } = query;
  const currentTeam = teams?.find((team) => team.id === teamId);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          // size="sm"
          // role="combobox"
          aria-expanded={open}
          aria-label="Select a team"
          className={cn(
            "h-9 w-52 justify-between truncate whitespace-nowrap px-3 text-gray-900",
            className
          )}
        >
          <Avatar className="mr-2 h-5 w-5">
            {currentTeam && (
              <AvatarImage
                src={`https://avatar.vercel.sh/${currentTeam.name}.png`}
                alt={currentTeam.name}
              />
            )}
            <AvatarFallback className="from-primary-700 to-primary-500 mr-2 h-5 w-5 rounded-full bg-gradient-to-br"></AvatarFallback>
          </Avatar>
          <p className="max-w-[140px] truncate text-left">
            {currentTeam?.name}
          </p>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52 overflow-hidden rounded-lg bg-white p-1">
        {teams?.map((team) => (
          <Link key={team.id} href={`/teams/${team.id}`}>
            <DropdownMenuItem
              className="whitespace-nowrap px-2 py-2.5 text-sm font-medium focus:bg-brand-100/50"
              // onClick={() => void signOut()}
            >
              <Avatar className="mr-2 h-5 w-5">
                <AvatarImage
                  src={`https://avatar.vercel.sh/monsters.png`}
                  alt={team.name}
                />
                <AvatarFallback className="mr-2 h-6 w-6 rounded-full bg-gradient-to-br from-brand-700 to-brand-500"></AvatarFallback>
              </Avatar>
              <p className="truncate whitespace-nowrap">{team.name}</p>
              <Check
                className={cn(
                  "ml-auto h-5 w-5",
                  asPath.includes(`/teams/${team.id}`)
                    ? "text-brand-600 opacity-100"
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
