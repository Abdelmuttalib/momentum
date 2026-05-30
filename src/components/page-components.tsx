import { cn } from "@/lib/cn";
import { Typography, type TypographyProps } from "./ui/typography";

// export function PageHeader({ ...props }: React.ComponentProps<'header'>) {
//   return <header className="mb-6 lg:mb-12" {...props} />
// }

type DivPropsType = React.HTMLAttributes<HTMLDivElement>;

export type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  actionsClassName?: string;
  className?: string;
};

export function PageHeader({
  title,
  description,
  actions,
  actionsClassName,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <Inline className="flex flex-col items-start gap-0">
        <PageTitle>{title}</PageTitle>

        {description && <PageDescription>{description}</PageDescription>}
      </Inline>

      {actions && (
        <PageHeaderActions className={actionsClassName}>
          {actions}
        </PageHeaderActions>
      )}
    </div>
  );
}

export function PageHeaderActions({
  className,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("flex flex-col items-center gap-2 sm:flex-row", className)}
      {...props}
    />
  );
}

{
  /* <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1> */
}

export function PageTitle({ ...props }: TypographyProps) {
  return (
    <Typography
      as="h1"
      variant="2xl/semibold"
      className="tracking-tight"
      {...props}
    />
  );
}

export function PageSubTitle({
  ...props
}: React.ComponentProps<typeof Typography>) {
  return <Typography as="h2" variant="xl/medium" {...props} />;
}

export function PageSubDescription({
  ...props
}: React.ComponentProps<typeof Typography>) {
  return (
    <Typography
      as="p"
      variant="sm/normal"
      className="text-muted-foreground"
      {...props}
    />
  );
}

export function PageDescription({
  ...props
}: React.ComponentProps<typeof Typography>) {
  return (
    <Typography
      as="p"
      variant="base/normal"
      className="text-muted-foreground"
      {...props}
    />
  );
}

export function PageHeaderTitleAndDescription({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return <PageHeader title={title} description={description} />;
}

export function FormSection({ ...props }: DivPropsType) {
  return <Stack as="section" spacing="group" {...props} />;
}

export function FormSectionBody(props: DivPropsType) {
  return (
    <Stack as="div" spacing="section">
      {props.children}
    </Stack>
  );
}

// border-b border-outline-variant pb-8

export function PageStack({ ...props }: DivPropsType) {
  return <Stack spacing="page" {...props} />;
}

export function FormStack({ children }: { children: React.ReactNode }) {
  return <Stack spacing="layout">{children}</Stack>;
}

export function FormActions({
  className,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("mt-6 flex items-stretch justify-end gap-2", className)}
      {...props}
    />
  );
}

export function FormLayout({ ...props }: { children: React.ReactNode }) {
  return (
    <div
      className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2 xl:grid-cols-3"
      {...props}
    />
  );
}

export function FormSectionHeader({
  icon,
  title,
}: {
  icon?: React.ReactNode;
  title: string;
}) {
  const Icon = icon;
  return (
    <Inline
      gap="inline"
      // className="flex items-center gap-3"
    >
      {icon && (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
          {icon}
        </div>
      )}
      <Typography as="h3" variant="lg/semibold">
        {title}
      </Typography>
    </Inline>
  );
}

type GridProps = {
  gap?: "layout" | "page" | "section" | "group" | "compact";
};

const gridGaps = {
  layout: "gap-12",
  page: "gap-10",
  section: "gap-8",
  group: "gap-6",
  compact: "gap-4",
  inline: "gap-2",
} as const;

export function Grid({
  gap = "section",
  className,
  ...props
}: GridProps & DivPropsType) {
  return (
    <div
      className={cn("grid grid-cols-12", gridGaps[gap], className)}
      {...props}
    />
  );
}

type GridItemProps = {
  col?: string;
};

export function GridItem({
  col = "col-span-12",
  className,
  ...props
}: GridItemProps & DivPropsType) {
  return <div className={cn(col, className)} {...props} />;
}

export function PageGrid(props: DivPropsType) {
  return <Grid gap="section" {...props} />;
}

export function PageGridMain({ ...props }: GridItemProps & DivPropsType) {
  return <GridItem col="col-span-12 lg:col-span-8" {...props} />;
}

export function PageGridAside({ className, children, ...props }: DivPropsType) {
  return (
    <GridItem col="col-span-12 lg:col-span-4" {...props}>
      <Stack spacing="section">{children}</Stack>
    </GridItem>
  );
}

// grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6

// spacing.ts
export const stackSpacing = {
  layout: "space-y-12", // forms, big vertical sections
  page: "space-y-10", // forms, big vertical sections
  section: "space-y-8", // dashboard sections, sidebar widgets
  group: "space-y-6", // inside cards, lists
  compact: "space-y-4", // tight elements (inputs, labels)
  inline: "space-y-2", // tight elements (inputs, labels)
} as const;

export type StackSpacing = keyof typeof stackSpacing;

// type StackProps = {
//   children: React.ReactNode
//   spacing?: StackSpacing
//   className?: string
//   as?: keyof JSX.IntrinsicElements
// }

type StackProps<T extends React.ElementType = "div"> = {
  spacing?: StackSpacing;
  as?: T;
  className?: string;
} & React.ComponentPropsWithoutRef<T>;

export function Stack<T extends React.ElementType = "div">({
  spacing = "section",
  className,
  as,
  children,
  ...props
}: StackProps<T>) {
  const Comp = as || "div";

  return (
    <Comp className={cn(stackSpacing[spacing], className)} {...props}>
      {children}
    </Comp>
  );
}

type InlineProps = {
  gap?: keyof typeof gridGaps;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function Inline({ gap = "compact", className, ...props }: InlineProps) {
  return (
    <div
      className={cn("flex items-center", gridGaps[gap], className)}
      {...props}
    />
  );
}

// export function Stack({ children, spacing = 'section', className, as: Comp = 'div' }: StackProps) {
//   return <Comp className={cn(stackSpacing[spacing], className)}>{children}</Comp>
// }
