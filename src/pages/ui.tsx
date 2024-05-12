import DesignSystemGuide from "@/components/design-system";
import CustomDialog from "@/components/ui/animated-dialog";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Typography, type TypographyProps } from "@/components/ui/typography";
import { ArrowRight } from "lucide-react";
import React from "react";
// import { cn } from "@/utils/cn";

export default function UI() {
  return (
    <div className="flex min-h-screen w-full justify-center py-44">
      <div>
        <DesignSystemGuide />
        {/* <DesignSystemStarter /> */}
        {/* <DesignSystem /> */}
      </div>
    </div>
  );
}

// variant: {
//   // xs
//   "xs/regular": "text-xs font-regular leading-xs",
//   "xs/medium": "text-xs font-medium leading-xs",
//   "xs/semibold": "text-xs font-semibold leading-xs",
//   "xs/bold": "text-xs font-bold leading-xs",

//   // sm
//   "sm/regular": "text-sm font-regular leading-sm",
//   "sm/medium": "text-sm font-medium leading-sm",
//   "sm/semibold": "text-sm font-semibold leading-sm",
//   "sm/bold": "text-sm font-bold leading-sm",

//   // base
//   "base/regular": "text-base font-regular leading-base",
//   "base/medium": "text-base font-medium leading-base",
//   "base/semibold": "text-base font-semibold leading-base",
//   "base/bold": "text-base font-bold leading-base",

//   // md
//   "md/regular": "text-md font-regular leading-md",
//   "md/medium": "text-md font-medium leading-md",
//   "md/semibold": "text-md font-semibold leading-md",
//   "md/bold": "text-md font-bold leading-md",

//   // lg
//   "lg/regular": "text-lg font-regular leading-lg",
//   "lg/medium": "text-lg font-medium leading-lg",
//   "lg/semibold": "text-lg font-semibold leading-lg",
//   "lg/bold": "text-lg font-bold leading-lg",

//   // xl
//   "xl/regular": "text-xl font-regular leading-xl",
//   "xl/medium": "text-xl font-medium leading-xl",
//   "xl/semibold": "text-xl font-semibold leading-xl",
//   "xl/bold": "text-xl font-bold leading-xl",

//   // display-xs
//   "display-xs/regular": "text-display-xs font-regular leading-display-xs",
//   "display-xs/medium": "text-display-xs font-medium leading-display-xs",
//   "display-xs/semibold": "text-display-xs font-semibold leading-display-xs",
//   "display-xs/bold": "text-display-xs font-bold leading-display-xs",

//   // display-sm
//   "display-sm/regular": "text-display-sm font-regular leading-display-sm",
//   "display-sm/medium": "text-display-sm font-medium leading-display-sm",
//   "display-sm/semibold": "text-display-sm font-semibold leading-display-sm",
//   "display-sm/bold": "text-display-sm font-bold leading-display-sm",

//   // display-md
//   "display-md/regular": "text-display-md font-regular leading-display-md",
//   "display-md/medium": "text-display-md font-medium leading-display-md",
//   "display-md/semibold": "text-display-md font-semibold leading-display-md",
//   "display-md/bold": "text-display-md font-bold leading-display-md",

//   // display-lg
//   "display-lg/regular": "text-display-lg font-regular leading-display-lg",
//   "display-lg/medium": "text-display-lg font-medium leading-display-lg",
//   "display-lg/semibold": "text-display-lg font-semibold leading-display-lg",
//   "display-lg/bold": "text-display-lg font-bold leading-display-lg",

//   // display-xl
//   "display-xl/regular": "text-display-xl font-regular leading-display-xl",
//   "display-xl/medium": "text-display-xl font-medium leading-display-xl",
//   "display-xl/semibold": "text-display-xl font-semibold leading-display-xl",
//   "display-xl/bold": "text-display-xl font-bold leading-display-xl",

//   // display-2xl
//   "display-2xl/regular":
//     "text-display-2xl font-regular leading-display-2xl",
//   "display-2xl/medium": "text-display-2xl font-medium leading-display-2xl",
//   "display-2xl/semibold":
//     "text-display-2xl font-semibold leading-display-2xl",
//   "display-2xl/bold": "text-display-2xl font-bold leading-display-2xl",
// },

const typographyVariants: TypographyProps["variant"][] = [
  "display-2xl/regular",
  "display-2xl/medium",
  "display-2xl/semibold",
  "display-2xl/bold",
  "display-xl/regular",
  "display-xl/medium",
  "display-xl/semibold",
  "display-xl/bold",
  "display-lg/regular",
  "display-lg/medium",
  "display-lg/semibold",
  "display-lg/bold",
  "display-md/regular",
  "display-md/medium",
  "display-md/semibold",
  "display-md/bold",
  "display-sm/regular",
  "display-sm/medium",
  "display-sm/semibold",
  "display-sm/bold",
  "display-xs/regular",
  "display-xs/medium",
  "display-xs/semibold",
  "display-xs/bold",
  "xl/regular",
  "xl/medium",
  "xl/semibold",
  "xl/bold",
  "lg/regular",
  "lg/medium",
  "lg/semibold",
  "lg/bold",
  "md/regular",
  "md/medium",
  "md/semibold",
  "md/bold",
  "base/regular",
  "base/medium",
  "base/semibold",
  "base/bold",
  "sm/regular",
  "sm/medium",
  "sm/semibold",
  "sm/bold",
  "xs/regular",
  "xs/medium",
  "xs/semibold",
  "xs/bold",
];

function DesignSystemStarter() {
  const [open, setOpen] = React.useState(false);
  const text = "The quick brown fox jumps over the lazy dog.";
  return (
    <div className="flex flex-col gap-y-10">
      {/* colors */}
      <div></div>
      {/* typography */}
      <div className="container mx-auto">
        <div className="flex flex-col gap-y-28">
          <Typography
            as="h1"
            variant="display-xl/semibold"
            className="max-w-xl text-center capitalize"
          >
            The open source issue tracking tool
          </Typography>
          {typographyVariants.map((variant) => (
            <TYPE key={variant} type={variant as string}>
              <Typography as="h1" variant={variant}>
                {text}
              </Typography>
            </TYPE>
          ))}
        </div>
      </div>
      {/* buttons */}
      <Button rightIcon={<ArrowRight className="w-[18px]" />}>
        Get Started
      </Button>
    </div>
  );
}

function TYPE({ type, children }: { type: string; children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col justify-between gap-y-2">
      <p>
        <Badge className="text-base capitalize">
          {type.replace("-", " ").replace("/", " - ")}
        </Badge>
      </p>
      {children}
    </div>
  );
}

function DesignSystem() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex flex-col gap-y-10">
      {/* Typography */}
      <section>
        <h1 className="h1 font-headline">heading 1</h1>
        <h2 className="h2">heading 2</h2>
        <h3 className="h3">heading 3</h3>
        <h4 className="h4">heading 4</h4>
        <h5 className="h5">heading 5</h5>
        <h6 className="h6">heading 6</h6>
        <p className="body-lg">body lg</p>
        <p className="body-md">body md</p>
        <p className="body-sm">body sm</p>
        <p className="label-lg">label lg</p>
        <p className="label-md">label md</p>
        <p className="label-sm">label sm</p>
      </section>

      {/* Colors */}
      <section></section>

      {/* Buttons */}
      {/* #fefffe */}
      {/* #f8fdfe */}
      <section>
        <div className="flex w-fit flex-col items-center justify-center gap-3 xl:flex-row">
          <Button variant="primary">Button Primary</Button>

          <Button variant="outline">Button Outline</Button>
          <Button variant="secondary">Button Secondary</Button>
          {/* <Button variant="danger">Button Danger</Button>
        <Button variant="warning">Button Warning</Button>
        <Button variant="success">Button Success</Button>
        <Button variant="info">Button Info</Button>
        <Button variant="light">Button Light</Button>
        <Button variant="dark">Button Dark</Button> */}
          <Button variant="link">Button Link</Button>
          <Button variant="ghost">Button Ghost</Button>
          <Button variant="destructive">Button Destructive</Button>
          <Button variant="destructive-outline">Button Secondary</Button>
        </div>
      </section>
      {/* Inputs */}
      <div>
        <Label>Label</Label>
        <Input
          placeholder="email"
          error={{
            message: "error message",
            type: "required",
            types: {
              required: "required",
            },
          }}
        />
      </div>
      {/* Form */}
      {/* Card */}
      {/* Modal */}
      <div>
        <CustomDialog
          triggerButton={
            <Button
              type="button"
              variant="primary"
              onClick={() => setOpen(true)}
            >
              Button Primary
            </Button>
          }
          open={open}
          onClose={() => setOpen(false)}
          title="Custom Dialog"
          description="
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam"
          className="w-full max-w-md"
        >
          <div className="flex flex-col gap-y-3">
            <Input placeholder="email" />
            <Input placeholder="password" />
            <Button variant="primary">Button Primary</Button>
            <Button variant="outline">Button Primary</Button>
            <Button variant="secondary">Button Primary</Button>
          </div>
        </CustomDialog>
      </div>
      {/* Toast */}
      {/* Table */}
      {/* Badge */}
      {/* Tag */}
      {/* Pagination */}
      {/* Breadcrumb */}
      {/* Menu */}
      {/* Dropdown */}
      {/* Tabs */}
    </div>
  );
}
