import { type FontValue, useFont } from "@/hooks/use-font";

import { cn } from "@/lib/cn";
import { FONTS } from "@/lib/fonts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { localesData, resolveLocale } from "@/i18n/config";
import { useRouter } from "next/router";

export function FontSelect() {
  const [font, setFont] = useFont();

  const { locale } = useRouter();

  const resolved = resolveLocale(locale);

  const localeDirection = localesData[resolved].direction;

  return (
    <>
      <Select
        defaultValue={font.font}
        onValueChange={(value: FontValue) => {
          setFont({
            font: value,
          });
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a font" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {FONTS?.map(({ name, value, direction }) => {
              const fontClass = `font-${value}`;

              return (
                <SelectItem
                  key={value}
                  value={value}
                  className={cn("capitalize", fontClass)}
                  disabled={!direction.includes(localeDirection)}
                >
                  {name}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}
