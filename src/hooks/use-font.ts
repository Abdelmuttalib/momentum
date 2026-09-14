import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type FontName =
  | "Inter"
  | "Plus Jakarta"
  | "Onest"
  | "IBM Plex Sans Arabic";
export type FontValue =
  | "inter"
  | "plus-jakarta"
  | "onest"
  | "ibm-plex-sans-arabic";

export type Font = {
  font: FontValue;
};

const fontAtom = atomWithStorage<Font>("font", {
  font: "inter",
});

export function useFont() {
  return useAtom(fontAtom);
}
