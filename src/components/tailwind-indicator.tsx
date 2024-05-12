import { cn } from "@/utils/cn";
import { FontSelect } from "./font-select";
import { FontSizeSelect } from "./font-size-select";
import ThemeSwitcher, { ThemeColorSelect } from "./theme-select";

export default function TailwindIndicator() {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed bottom-1 left-1 z-50 flex h-6 w-6 items-center justify-center rounded-xl bg-gray-800 p-3 font-mono text-xs font-semibold text-white">
      <div className="block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden">sm</div>
      <div className="hidden md:block lg:hidden">md</div>
      <div className="hidden lg:block xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  );
}

export function UICustomizer({ className }: { className?: string }) {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <div
      className={cn(
        "fixed left-1 right-1 top-1 z-50 mx-auto flex w-fit items-center justify-center rounded-lg border px-2 py-1.5 text-sm",
        className
      )}
    >
      <FontSelect />
      <FontSizeSelect />
      <ThemeColorSelect />
      <ThemeSwitcher />
    </div>
  );
}
