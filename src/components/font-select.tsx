import { type FontValue, useFont } from "@/hooks/use-font";

import { cn } from "@/utils/cn";
import { FONTS } from "@/utils/fonts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FontSelect() {
  const [font, setFont] = useFont();

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
          <SelectValue placeholder="Select a status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {FONTS?.map(({ name, value }) => {
              const fontClass = `font-${value}`;

              return (
                <SelectItem
                  key={value}
                  value={value}
                  className={cn("capitalize", fontClass)}
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
