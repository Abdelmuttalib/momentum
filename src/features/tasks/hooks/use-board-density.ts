import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type BoardDensity = "compact" | "comfortable";

const boardDensityAtom = atomWithStorage<BoardDensity>(
  "board-density",
  "compact"
);

export function useBoardDensity() {
  return useAtom(boardDensityAtom);
}
