import type { FontName, FontValue } from "@/hooks/use-font";

export type FontDataType = {
  name: FontName;
  value: FontValue;
  direction: string[];
};

export type FontSizeValue = "default" | "small" | "large";

export const FONTS: FontDataType[] = [
  {
    name: "Inter",
    value: "inter",
    direction: ["ltr"],
  },
  {
    name: "Plus Jakarta",
    value: "plus-jakarta",
    direction: ["ltr"],
  },
  {
    name: "Onest",
    value: "onest",
    direction: ["ltr"],
  },
  {
    name: "IBM Plex Sans Arabic",
    value: "ibm-plex-sans-arabic",
    direction: ["rtl"],
  },
];

export const FONT_SIZES: FontSizeValue[] = ["small", "default", "large"];
