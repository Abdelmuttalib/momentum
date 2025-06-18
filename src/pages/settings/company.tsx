// import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { SettingsContentLayout } from ".";
import { CompanySettings } from "@/components/views/settings";

export default function CompanySettingsPage() {
  return (
    <SettingsContentLayout
      title="Company Settings"
      description="dd"
      actions={
        <>
          <Button>Save Changes</Button>
        </>
      }
    >
      <div>
        <CompanySettings />
      </div>
    </SettingsContentLayout>
  );
}
