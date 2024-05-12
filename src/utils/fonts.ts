import type { FontName, FontValue } from "@/hooks/use-font";

export type FontDataType = {
  name: FontName;
  value: FontValue;
};

export type FontSizeValue = "default" | "small" | "large";

export const FONTS: FontDataType[] = [
  {
    name: "General Sans",
    value: "general-sans",
  },
  {
    name: "Inter",
    value: "inter",
  },
  {
    name: "Plus Jakarta",
    value: "plus-jakarta",
  },
  {
    name: "Onest",
    value: "onest",
  },
];

export const FONT_SIZES: FontSizeValue[] = ["small", "default", "large"];
