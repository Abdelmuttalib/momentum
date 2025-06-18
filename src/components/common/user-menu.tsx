import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Settings,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
  Bell,
  CreditCard,
  Users,
  ChevronUp,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Role } from "@prisma/client";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const { data: session } = useSession();
  const user = session?.user;

  console.log("user: ", user);

  const { theme, setTheme } = useTheme();

  function handleThemeToggle() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  async function handleSignOut() {
    await signOut();
  }

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto w-full justify-start p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <div className="flex w-full items-center space-x-3">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={user.image ?? `https://avatar.vercel.sh/${user.email}`}
                alt={user.name}
              />
              <AvatarFallback className="text-xs font-medium">
                {user.name}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 text-left">
              <div className="flex items-center space-x-1">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <Badge variant="secondary" className="h-4 px-1 py-0 text-xs">
                  {user.role}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
            <ChevronUp className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64"
        align="end"
        alignOffset={-4}
        sideOffset={8}
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={user.image || `https://avatar.vercel.sh/${user.name}`}
                  alt={user.name}
                />
                <AvatarFallback className="text-xs">
                  {user?.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-x-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>

                  <Badge variant="secondary" className="h-4 px-1 py-0 text-xs">
                    {user.role}
                  </Badge>
                </div>
                <p className="mt-1 text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between"></div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/teams" className="cursor-pointer">
            <Users className="mr-2 h-4 w-4" />
            <span>Manage Teams</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleThemeToggle}>
          <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span>Toggle theme</span>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/help" className="cursor-pointer">
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={handleSignOut}
          className="bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground focus:bg-destructive/70 focus:text-destructive-foreground"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
