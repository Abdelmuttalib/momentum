import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/common/button-link";
import { Heading, Text } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { routes } from "@/lib/routes";
import { Plus } from "lucide-react";
import { type BoardDensity } from "@/features/tasks/hooks/use-board-density";
import { cn } from "@/lib/cn";

export type BoardHeaderProps = {
  projectId: string;
  projectName: string;
  projectDescription?: string | null;
  taskCount: number;
  density: BoardDensity;
  onDensityChange: (density: BoardDensity) => void;
};

export function BoardHeader({
  projectId,
  projectName,
  projectDescription,
  taskCount,
  density,
  onDensityChange,
}: BoardHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Text size="xs" tone="muted" as="span" className="shrink-0">
            Projects
          </Text>
          <Text size="xs" tone="muted" as="span" aria-hidden="true">
            /
          </Text>
          <Heading level="page" className="truncate">
            {projectName}
          </Heading>
          <Badge variant="secondary" className="shrink-0">
            {taskCount}
          </Badge>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <div
            role="group"
            aria-label="Board density"
            className="flex items-center rounded-md border p-0.5"
          >
            {(["compact", "comfortable"] as BoardDensity[]).map((mode) => (
              <Button
                key={mode}
                type="button"
                variant="ghost"
                size="sm"
                aria-pressed={density === mode}
                onClick={() => onDensityChange(mode)}
                className={cn(
                  "h-7 px-2 text-xs capitalize",
                  density === mode && "bg-accent text-accent-foreground"
                )}
              >
                {mode}
              </Button>
            ))}
          </div>
          <ButtonLink
            href={routes.projects.tasks.new({ projectId })}
            size="sm"
          >
            <Plus className="h-4 w-4" />
            New task
          </ButtonLink>
        </div>
      </div>

      {projectDescription && (
        <Text size="sm" tone="muted" className="line-clamp-1">
          {projectDescription}
        </Text>
      )}
    </div>
  );
}
