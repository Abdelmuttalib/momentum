import { AppLayout } from "@/components/layout/app-layout";
import { Seo } from "@/components/seo";

export default function TeamManagePage() {
  return (
    <>
      <Seo title="Teams" />

      <AppLayout>
        <div className="flex flex-1 flex-col"></div>
      </AppLayout>
    </>
  );
}
