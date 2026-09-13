import { AppLayout } from "@/components/layout/app-layout";
import {
  PageStack,
  PageSubTitle,
  PageSubDescription,
  Stack,
} from "@/components/page-components";
import { CompactPageHeader } from "@/components/common/page-header";
import { Seo } from "@/components/seo";
import { useTranslations } from "next-intl";

export default function HelpPage() {
  const t = useTranslations("help");
  return (
    <>
      <Seo title="Help | Momentum" />

      <AppLayout>
        <PageStack>
          <CompactPageHeader
            title={t("title")}
            description={t("description")}
          />

          <Stack>
            <div>
              <PageSubTitle>{t("gettingStartedTitle")}</PageSubTitle>
              <PageSubDescription>
                {t("gettingStartedBody")}
              </PageSubDescription>
            </div>

            <div>
              <PageSubTitle>{t("projectsTitle")}</PageSubTitle>
              <PageSubDescription>
                {t("projectsBody")}
              </PageSubDescription>
            </div>

            <div>
              <PageSubTitle>{t("tasksTitle")}</PageSubTitle>
              <PageSubDescription>
                {t("tasksBody")}
              </PageSubDescription>
            </div>

            <div>
              <PageSubTitle>{t("teamsTitle")}</PageSubTitle>
              <PageSubDescription>
                {t("teamsBody")}
              </PageSubDescription>
            </div>

            <div>
              <PageSubTitle>{t("invitingTitle")}</PageSubTitle>
              <PageSubDescription>
                {t("invitingBody")}
              </PageSubDescription>
            </div>

            <div>
              <PageSubTitle>{t("needMoreTitle")}</PageSubTitle>
              <PageSubDescription>
                {t("needMoreBody")}
              </PageSubDescription>
            </div>
          </Stack>
        </PageStack>
      </AppLayout>
    </>
  );
}
