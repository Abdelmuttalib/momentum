import { PRIMARY_THEME_COLORS } from "@/utils/theme-colors";
import { type ThemeColorType, useThemeColor } from "@/hooks/use-theme-color";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/utils/cn";

export function ThemeColorSelect({ className }: { className?: string }) {
  const [themeColor, setThemeColor] = useThemeColor();

  return (
    <Select
      defaultValue={themeColor.colorName}
      onValueChange={(v: ThemeColorType) =>
        setThemeColor({
          colorName: v,
        })
      }
    >
      <SelectTrigger className={cn("w-28", className)}>
        <SelectValue placeholder="Theme Color" />
      </SelectTrigger>
      <SelectContent>
        {PRIMARY_THEME_COLORS?.map(
          ({ name, color }: { name: ThemeColorType; color: string }) => (
            <SelectItem key={`${name}`} value={name}>
              <span className="inline-flex items-center pr-2">
                <span
                  style={{
                    backgroundColor: color,
                  }}
                  className={cn("mr-2 block h-2.5 w-2.5 rounded-sm")}
                ></span>
                <span className="capitalize">{name}</span>
              </span>
            </SelectItem>
          ),
        )}
      </SelectContent>
    </Select>
  );
}

export function ThemeModeSelect({ className }: { className?: string }) {
  const { theme, setTheme, themes } = useTheme();

  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <Select defaultValue={theme} onValueChange={(v) => setTheme(v)}>
      <SelectTrigger className={cn("w-28", className)}>
        <SelectValue placeholder="Theme Color" />
      </SelectTrigger>
      <SelectContent>
        {themes?.map((theme) => (
          <SelectItem key={`${theme}`} value={theme}>
            <span className="inline-flex items-center pr-2">
              {/* <span
                  style={{
                    backgroundColor: color,
                  }}
                  className={cn("mr-2 block h-2.5 w-2.5 rounded-sm")}
                ></span> */}
              <span className="capitalize">{theme}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
