import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/cn";

export default function UI() {
  return (
    <div className="flex min-h-screen w-full justify-center py-44">
      <div>
        <DesignSystem />
      </div>
    </div>
  );
}

function DesignSystem() {
  return (
    <div className="flex flex-col gap-y-10">
      {/* Typography */}
      <section>
        <h1 className="h1">heading 1</h1>
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
          <Button variant="outline-destructive">Button Secondary</Button>
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
