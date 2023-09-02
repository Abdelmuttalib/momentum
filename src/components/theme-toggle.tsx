import { MoonIcon, SunIcon } from "@heroicons/react/20/solid";
import { useTheme } from "next-themes";

import { IconButton } from "@/components/ui/icon-button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <IconButton
      type="button"
      variant="outline"
      aria-label="Toggle theme"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="hidden sm:block"
    >
      {theme === "light" ? (
        <SunIcon className="w-6" />
      ) : (
        <MoonIcon className="w-6 p-0.5" />
      )}
    </IconButton>
  );
}
