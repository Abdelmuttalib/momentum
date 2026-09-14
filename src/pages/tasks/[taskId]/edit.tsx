// Compatibility alias: canonical task edit lives at
// /projects/[projectId]/tasks/[taskId]/edit. This route resolves the task's
// project and redirects there.

import { useEffect } from "react";
import { DataLoader } from "@/components/data-loader";
import { AppLayout } from "@/components/layout/app-layout";
import { SpinLoader } from "@/components/spin-loader";
import { useTask } from "@/features/tasks/hooks/use-tasks";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { requireAuthPage } from "@/server/auth-guard";
import { type GetServerSideProps } from "next";

export default function GlobalEditTaskRedirectPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const companyId = session?.user?.company.id;

  const taskId =
    typeof router.query.taskId === "string" ? router.query.taskId : undefined;
  const { data: task, isLoading, error } = useTask({
    taskId: taskId ?? "",
    companyId,
  });

  useEffect(() => {
    if (task) {
      void router.replace(`/projects/${task.projectId}/tasks/${task.id}/edit`);
    }
  }, [task, router]);

  return (
    <>
      <AppLayout>
        <DataLoader data={task} isLoading={isLoading || !taskId} error={error}>
          {() => <SpinLoader />}
        </DataLoader>
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuthPage();
