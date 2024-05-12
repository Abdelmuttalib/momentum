import { useTheme } from "next-themes";

import { IconButton, iconButtonVariants } from "@/components/ui/icon-button";

import { Menu, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { MoonIcon, SunIcon } from "lucide-react";
import { Fragment } from "react";

import { useMounted } from "@/hooks/use-mounted";
import { type ThemeColorType, useThemeColor } from "@/hooks/use-theme-color";

import { cn } from "@/utils/cn";
import { PRIMARY_THEME_COLORS } from "@/utils/theme-colors";

export default function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <IconButton
      type="button"
      variant="ghost"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn("hidden text-foreground-light sm:inline-flex", className)}
    >
      {theme === "light" ? (
        <SunIcon className="w-5" />
      ) : (
        <MoonIcon className="w-5" />
      )}
    </IconButton>
  );
}

export function ThemeColorSelect() {
  const [themeColor, setThemeColor] = useThemeColor();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          as="button"
          className={cn(
            iconButtonVariants({
              variant: "ghost",
            }),
            "hidden sm:flex"
          )}
        >
          <p className="w-5 text-foreground-light">i</p>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-layer text-foreground shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="relative">
            {PRIMARY_THEME_COLORS?.map(
              ({ name, color }: { name: ThemeColorType; color: string }) => (
                <Menu.Item key={`${name}`}>
                  <button
                    onClick={() => {
                      setThemeColor({
                        colorName: name,
                      });
                    }}
                    className={cn(
                      "flex w-full items-center px-3 py-2.5 font-medium capitalize text-foreground",
                      {
                        "bg-primary-100 text-foreground":
                          name === themeColor.colorName,
                        "hover:bg-accent-hover": name !== themeColor.colorName,
                      }
                    )}
                  >
                    <span
                      style={{
                        backgroundColor: color,
                      }}
                      className={cn("mr-2 h-4 w-4 rounded-full")}
                    ></span>
                    <>{name}</>
                    {name == themeColor.colorName && (
                      <CheckIcon className="absolute right-2 h-4 w-4 text-current" />
                    )}
                  </button>
                </Menu.Item>
              )
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
