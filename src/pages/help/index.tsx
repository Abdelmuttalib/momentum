import { AppLayout } from "@/components/layout/app-layout";
import {
  PageHeader,
  PageStack,
  PageSubTitle,
  PageSubDescription,
  Stack,
} from "@/components/page-components";
import { Seo } from "@/components/seo";

export default function HelpPage() {
  return (
    <>
      <Seo title="Help | Momentum" />

      <AppLayout>
        <PageStack>
          <PageHeader
            title="Help & Documentation"
            description="Learn how to manage projects, tasks, teams, and your workspace."
          />

          <Stack>
            <div>
              <PageSubTitle>Getting Started</PageSubTitle>
              <PageSubDescription>
                Create a project, organize work into tasks, assign team members,
                and track progress through completion.
              </PageSubDescription>
            </div>

            <div>
              <PageSubTitle>Projects</PageSubTitle>
              <PageSubDescription>
                Projects are containers for related work. Create projects to
                group tasks, collaborate with teammates, and track progress
                toward a goal.
              </PageSubDescription>
            </div>

            <div>
              <PageSubTitle>Tasks</PageSubTitle>
              <PageSubDescription>
                Tasks represent individual pieces of work. Tasks can be assigned
                to team members, prioritized, labeled, commented on, and moved
                through their workflow status.
              </PageSubDescription>
            </div>

            <div>
              <PageSubTitle>Teams</PageSubTitle>
              <PageSubDescription>
                Teams allow you to organize users and projects. Assign projects
                to teams to keep work grouped by department or function.
              </PageSubDescription>
            </div>

            <div>
              <PageSubTitle>Inviting Members</PageSubTitle>
              <PageSubDescription>
                Administrators can invite new members to join the workspace.
                Once a user accepts an invitation, they will gain access
                according to their assigned role.
              </PageSubDescription>
            </div>

            <div>
              <PageSubTitle>Need More Help?</PageSubTitle>
              <PageSubDescription>
                If you encounter issues or have questions about using the
                platform, contact your workspace administrator.
              </PageSubDescription>
            </div>
          </Stack>
        </PageStack>
      </AppLayout>
    </>
  );
}
