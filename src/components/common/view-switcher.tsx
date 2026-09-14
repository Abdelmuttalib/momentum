import { LayoutGrid, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type ViewMode } from "@/lib/types";

type Props = {
  value: ViewMode;
  onChange: (view: ViewMode) => void;
};

export function ViewSwitcher({ value, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="View mode"
      className="flex gap-1"
    >
      <Button
        size="icon-sm"
        variant={value === "table" ? "outline" : "ghost"}
        aria-pressed={value === "table"}
        aria-label="Table view"
        title="Table view"
        onClick={() => onChange("table")}
      >
        <Table className="h-4 w-4" />
      </Button>

      <Button
        size="icon-sm"
        variant={value === "cards" ? "outline" : "ghost"}
        aria-pressed={value === "cards"}
        aria-label="Cards view"
        title="Cards view"
        onClick={() => onChange("cards")}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </div>
  );
}
