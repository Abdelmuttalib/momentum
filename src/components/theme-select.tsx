import { useTheme } from "next-themes";

import { MoonIcon, SunIcon } from "lucide-react";

import { useMounted } from "@/hooks/use-mounted";

import { cn } from "@/utils/cn";
import { Button, type ButtonProps } from "@/components/ui/button";

interface ThemeSwitcherProps extends ButtonProps {
  className?: string;
}

export default function ThemeSwitcher({
  className,
  ...props
}: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn("text-foreground-light hidden sm:inline-flex", className)}
      {...props}
    >
      {theme === "light" ? (
        <SunIcon className="w-5" />
      ) : (
        <MoonIcon className="w-5" />
      )}
    </Button>
  );
}
