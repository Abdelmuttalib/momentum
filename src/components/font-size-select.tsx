import { type FontSizeValue, useFontSize } from "@/hooks/use-font-size";

import { FONT_SIZES } from "@/utils/fonts";
import { cn } from "@/utils/cn";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FontSizeSelect() {
  const [fontSize, setFontSize] = useFontSize();

  return (
    <>
      <Select
        defaultValue={fontSize.fontSize}
        onValueChange={(value: FontSizeValue) => {
          setFontSize({
            fontSize: value,
          });
        }}
      >
        <SelectTrigger className="w-full capitalize">
          <SelectValue placeholder="Select a status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {FONT_SIZES?.map((fontS) => {
              const fontClass = `font-${fontS}`;

              return (
                <SelectItem
                  key={fontS}
                  value={fontS}
                  className={cn("capitalize", fontClass)}
                >
                  {fontS}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}
