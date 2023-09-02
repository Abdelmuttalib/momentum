import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User as UserIcon,
  UserPlus,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type User as UserType } from "@prisma/client";
import Link from "next/link";
import { cn } from "@/utils/cn";

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">Hover</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Add to library</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>;

export function UserAvatar({
  user,
  size = "default",
  triggerClassName,
  contentClassName,
}: {
  user: UserType;
  size?: "default" | "sm";
  triggerClassName?: string;
  contentClassName?: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "inline-flex items-center justify-center rounded-full bg-gray-900 uppercase text-gray-100",
              {
                "h-8 w-8 text-lg": size === "default",
                "h-6 w-6": size === "sm",
              },
              triggerClassName
            )}
          >
            {user?.firstName ? user.firstName[0] : user.email[0]}
          </div>
        </TooltipTrigger>
        <TooltipContent className={cn("bg-gray-900", contentClassName)}>
          <div className="text-sm">
            <p className="font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function User() {
  const { data: session } = useSession();

  return (
    <div className="flex h-fit w-full items-center justify-start gap-3 truncate">
      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-lg text-gray-100">
        {session?.user?.firstName[0]}
      </div>
      <p className="truncate font-medium">
        {session?.user?.firstName} {session?.user?.lastName}
      </p>
    </div>
  );
}

export default function UserMenu() {
  const { data: session } = useSession();
  const { push } = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex h-fit w-full items-center justify-start gap-3 truncate border-2 border-transparent bg-transparent px-2 py-2 hover:border-gray-800 hover:bg-transparent">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-600">
            {session?.user?.firstName[0]}
          </div>
          <p className="truncate">
            {session?.user?.firstName} {session?.user?.lastName}
          </p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => void push("/profile")}>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => void push("/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => void push("/teams")}>
            <Users className="mr-2 h-4 w-4" />
            <span>Teams</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/company">
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Invite users</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Plus className="mr-2 h-4 w-4" />
            <span>New Team</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {/* <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Github className="mr-2 h-4 w-4" />
          <span>GitHub</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LifeBuoy className="mr-2 h-4 w-4" />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Cloud className="mr-2 h-4 w-4" />
          <span>API</span>
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => void signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
