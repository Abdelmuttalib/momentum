import type { ThemeColorType } from "@/hooks/use-theme-color";

export type PrimaryColor = {
  color: string;
  name: ThemeColorType;
};

export const PRIMARY_THEME_COLORS: PrimaryColor[] = [
  {
    name: "default",
    color: "#4040F2",
  },
  {
    name: "rose",
    color: "#f43f5e",
  },
  {
    name: "indigo",
    color: "#6366f1",
  },
  {
    name: "emerald",
    color: "#10b981",
  },
  {
    name: "blue",
    color: "#3461ff",
  },
  {
    name: "orange",
    color: "#f97316",
  },
];
