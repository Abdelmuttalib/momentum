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
import { type Role, type User as UserType } from "@prisma/client";
import Link from "next/link";
import { cn } from "@/lib/cn";
import Image from "next/image";
import { getUserName } from "@/lib/user";
import { type Session } from "next-auth";

export function UserAvatar({
  user,
  size = "default",
  triggerClassName,
  contentClassName,
}: {
  user:
    | UserType
    | Session["user"]
    | {
        id: string;
        name: string;
        email: string;
        image: string;
        role: Role;
      };
  size?: "default" | "sm" | "lg";
  triggerClassName?: string;
  contentClassName?: string;
}) {
  if (!user) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "relative inline-flex shrink-0 items-center justify-center rounded-full text-sm uppercase",
              {
                "h-8 w-8 text-lg": size === "default",
                "h-10 w-10 text-lg": size === "lg",
                "h-6 w-6": size === "sm",
                "bg-accent": !user?.image,
              },
              triggerClassName
            )}
          >
            {user && user?.image ? (
              <Image
                src={user?.image}
                alt="profile image"
                // width={size === "sm" ? 24 : 32}
                // height={size === "sm" ? 24 : 32}
                layout="fill"
                className="rounded-full object-cover"
              />
            ) : (
              <>{user?.name ? user.name[0] : user.email[0]}</>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className={cn("", contentClassName)}>
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
            <p className="font-medium text-foreground">{user.name}</p>
            <p className="text-muted-foreground">{user.email}</p>
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
        {user?.name && user?.name[0]}
      </div>
      <p className="truncate font-medium">{user?.name}</p>
    </div>
  );
}

export default function UserMenu() {
  const { data: session } = useSession();
  const { push } = useRouter();

  const userName = getUserName(session?.user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="border-foreground-lighter inline-flex h-12 max-w-full items-center gap-x-2 truncate border text-muted-foreground hover:border-white"
        >
          <span>
            <UserAvatar user={session?.user} size="sm" />
          </span>
          <span className="truncate">{userName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => void push("/profile")}>
            <UserIcon className="mr-2 h-5 w-5" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => void push("/settings")}>
            <Settings className="mr-2 h-5 w-5" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => void push("/teams")}>
            <Users className="mr-2 h-5 w-5" />
            <span>Teams</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/company">
              <UserPlus className="mr-2 h-5 w-5" />
              <span>Invite users</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Plus className="mr-2 h-5 w-5" />
            <span>New Team</span>
          </DropdownMenuItem>
          {/* <DropdownMenuItem className="space-x-4">
            <span>Theme</span>
            <ThemeSwitcher />
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => void signOut()}>
          <LogOut className="mr-2 h-5 w-5" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
