import { MoonIcon, SunIcon } from "@heroicons/react/20/solid";
import { useTheme } from "next-themes";

import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/utils/cn";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  return (
    <IconButton
      type="button"
      variant="outline"
      aria-label="Toggle theme"
      // size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn("hidden sm:block", className)}
    >
      {theme === "light" ? (
        <SunIcon className="w-5" />
      ) : (
        <MoonIcon className="w-5 p-0.5" />
      )}
    </IconButton>
  );
}
