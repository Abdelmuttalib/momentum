import { SettingsContentLayout, SettingsSectionTitle } from ".";
import { CompanySettings } from "@/components/views/settings";
import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "@/server/auth";

export default function CompanySettingsPage() {
  return (
    <SettingsContentLayout>
      <SettingsSectionTitle>Company</SettingsSectionTitle>
      <CompanySettings />
    </SettingsContentLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const userSession = await getServerAuthSession({ req, res });

  if (!userSession) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
