import { signOut, useSession } from "next-auth/react";
import useTranslation from "next-translate/useTranslation";
import { LogOut, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";

export default function UserAccountMenu() {
  const { t } = useTranslation("common");
  const { data: session } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="body-lg flex h-10 w-10 items-center justify-center gap-2 rounded-full border-gray-100 p-0 text-2xl text-primary-700 hover:border-gray-200"
        >
          <User className="h-6 w-6 text-gray-800" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 rounded-lg bg-white p-0 py-3">
        <div className="flex w-full items-center gap-3 bg-slate-100 px-3 py-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100">
            <div className="block rounded-full text-2xl">A</div>
          </div>
          <div className="inline-flex flex-col">
            <h6 className="inline-block font-semibold">
              {/* {session?.user.phoneNumber} */}
              {session?.user.email}
            </h6>
            <p className="inline-block text-gray-600">{session?.user.name}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="px-3 py-3 font-medium hover:bg-primary hover:text-white focus:bg-primary focus:text-white"
          onClick={() => void signOut()}
        >
          <LogOut className="mr-2 h-5 w-5" />
          <p className="body-sm">{t("buttons.signOut")}</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
