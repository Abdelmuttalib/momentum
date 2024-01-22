import {
  // Cloud,
  // CreditCard,
  // Github,
  // Keyboard,
  // LifeBuoy,
  LogOut,
  // Mail,
  // MessageSquare,
  Plus,
  // PlusCircle,
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
  // DropdownMenuPortal,
  DropdownMenuSeparator,
  // DropdownMenuShortcut,
  // DropdownMenuSub,
  // DropdownMenuSubContent,
  // DropdownMenuSubTrigger,
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
import Image from "next/image";
import ThemeToggle from "../theme-toggle";

{
  /* <TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">Hover</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Add to library</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>; */
}

export function UserAvatar({
  user,
  size = "default",
  triggerClassName,
  contentClassName,
}: {
  user: UserType;
  size?: "default" | "sm" | "lg";
  triggerClassName?: string;
  contentClassName?: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "relative inline-flex items-center justify-center rounded-full uppercase text-gray-100",
              {
                "h-8 w-8 text-lg": size === "default",
                "h-10 w-10 text-lg": size === "lg",
                "h-6 w-6": size === "sm",
                "bg-gray-900": !user?.image,
              },
              triggerClassName
            )}
          >
            {user?.image ? (
              <Image
                src={user?.image}
                alt="profile image"
                // width={size === "sm" ? 24 : 32}
                // height={size === "sm" ? 24 : 32}
                layout="fill"
                className="rounded-full object-cover"
              />
            ) : (
              <>{user?.firstName ? user.firstName[0] : user.email[0]}</>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className={cn("bg-gray-900", contentClassName)}>
          {/* {user?.image && (
            <Image
              src={user.image}
              alt="profile image"
              width={size === "sm" ? 24 : 32}
              height={size === "sm" ? 24 : 32}
            />
          )}
          {!user?.image && ( */}
          <div className="text-sm">
            <p className="font-medium text-gray-100">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function User({ user }: { user: UserType }) {
  return (
    <div className="flex h-fit w-full items-center justify-start gap-3 truncate">
      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-lg text-gray-100">
        {user?.firstName && user?.firstName[0]}
      </div>
      <p className="truncate font-medium">
        {user?.firstName} {user?.lastName}
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
        <Button className="flex h-fit w-full items-center justify-start gap-3 truncate border-2 bg-transparent px-2 py-2 hover:border-gray-800 hover:bg-transparent">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-600">
            {session?.user?.firstName[0]}
          </div>
          <p className="truncate text-gray-100">
            {session?.user?.firstName} {session?.user?.lastName}
          </p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52 bg-white">
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
          <DropdownMenuItem className="space-x-4">
            <span>Theme</span>
            <ThemeToggle />
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
