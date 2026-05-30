// components/view-toggle.tsx

import { LayoutGrid, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { type ViewMode } from "@/lib/types";
import { DEFAULT_VIEW_MODE } from "@/hooks/use-view-mode";

type ViewModeContainerProps = {
  defaultView?: ViewMode;
  table: React.ReactNode;
  cards: React.ReactNode;
};

export function ViewModeContainer({
  defaultView = DEFAULT_VIEW_MODE,
  table,
  cards,
}: ViewModeContainerProps) {
  const [view, setView] = useState<ViewMode>(defaultView);

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-1">
        <Button
          size="icon-sm"
          variant={view === "table" ? "outline" : "ghost"}
          onClick={() => setView("table")}
        >
          <Table className="h-4 w-4" />
        </Button>

        <Button
          size="icon-sm"
          variant={view === "cards" ? "outline" : "ghost"}
          onClick={() => setView("cards")}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </div>

      {view === "table" ? table : cards}
    </div>
  );
}
