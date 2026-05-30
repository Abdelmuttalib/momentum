import { LayoutGrid, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type ViewMode } from "@/lib/types";

type Props = {
  value: ViewMode;
  onChange: (view: ViewMode) => void;
};

export function ViewSwitcher({ value, onChange }: Props) {
  return (
    <div className="flex gap-1">
      <Button
        size="icon-sm"
        variant={value === "table" ? "default" : "outline"}
        onClick={() => onChange("table")}
      >
        <Table className="h-4 w-4" />
      </Button>

      <Button
        size="icon-sm"
        variant={value === "cards" ? "default" : "outline"}
        onClick={() => onChange("cards")}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </div>
  );
}
