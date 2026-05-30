import { type ViewMode } from "@/lib/types";
import { useState } from "react";

export const DEFAULT_VIEW_MODE: ViewMode = "table";

export function useViewMode(initialView: ViewMode = DEFAULT_VIEW_MODE) {
  const [view, setView] = useState<ViewMode>(initialView);

  return {
    view,
    isTable: view === "table",
    isCards: view === "cards",
    setView,
  };
}
