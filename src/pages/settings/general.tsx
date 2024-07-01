import { Layout } from "@/components/layout";
// import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/router";
import { SettingsContentLayout, settingsPaths } from ".";

export default function GeneralSettings() {
  const { pathname } = useRouter();

  return (
    <SettingsContentLayout
      title="General Settings"
      description="dd"
      actions={
        <>
          <Button variant="primary">Save Changes</Button>
        </>
      }
    >
      {/* record */}
      <div className="border-b py-6 text-sm lg:flex lg:items-start">
        <div className="space-y-1 lg:mb-0 lg:mr-5 lg:w-2/5 lg:flex-shrink-0">
          <h3 className="text-foreground">
            Store name <span className="text-red-500">*</span>
          </h3>
          <p className="max-w-[420px] text-foreground-lighter">
            Appears on receipts, invoices, and more{" "}
          </p>
        </div>
        <div className="lg:flex-grow">
          <Input
            id="input_name"
            type="text"
            className=""
            placeholder="store name"
          />
        </div>
      </div>

      {/* record */}
      <div className="border-b py-6 text-sm lg:flex lg:items-start">
        <div className="mb-1 space-y-1 lg:mb-0 lg:mr-5 lg:w-2/5 lg:flex-shrink-0">
          <h3 className="text-foreground">
            Email <span className="text-red-500">*</span>
          </h3>
          <p className="max-w-[420px] text-foreground-lighter">
            Contact email address
          </p>
        </div>
        <div className="lg:flex-grow">
          <Input
            id="input_name"
            type="text"
            className=""
            placeholder="store name"
          />
        </div>
      </div>
      {/* record */}
      <div className="border-b py-6 text-sm lg:flex lg:items-start">
        <div className="mb-1 space-y-1 lg:mb-0 lg:mr-5 lg:w-2/5 lg:flex-shrink-0">
          <h3 className="text-foreground">
            Contact number <span className="text-red-500">*</span>
          </h3>
          <p className="max-w-[420px] text-foreground-lighter">
            {/* description for contact number field */}
            Contact number for your store
          </p>
        </div>
        <div className="lg:flex-grow">
          <Input
            id="input_name"
            type="text"
            className=""
            placeholder="store name"
          />
        </div>
      </div>
      {/* record */}
      <div className="border-b py-6 text-sm lg:flex lg:items-start">
        <div className="mb-1 space-y-1 lg:mb-0 lg:mr-5 lg:w-2/5 lg:flex-shrink-0">
          <h3 className="text-foreground">
            Address <span className="text-red-500">*</span>
          </h3>
          <p className="max-w-[420px] text-foreground-lighter">
            {/* description for contact number field */}
            Address for your store
          </p>
        </div>
        <div className="flex gap-x-4 lg:flex-grow">
          <Input
            id="input_address"
            type="text"
            className=""
            placeholder="address"
          />

          <Input id="input_city" type="text" className="" placeholder="city" />
        </div>
      </div>
    </SettingsContentLayout>
  );
}
