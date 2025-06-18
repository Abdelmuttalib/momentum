import { AppLayout } from "@/components/layout/app-layout";
import { Seo } from "@/components/seo";
import { siteConfig } from "@/config/site-config";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/utils/api";
import { type GetServerSideProps } from "next";

export default function ProjectsPage() {
  const { data } = api.company.getAllCompanyProjects.useQuery();
  console.log(data);

  return (
    <>
      <Seo title="Projects | Momentum" />
      <AppLayout>
        projects
        {JSON.stringify(data)}
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const userSession = await getServerAuthSession({ req, res });

  if (!userSession) {
    return {
      redirect: {
        destination: siteConfig.pages.main.links.signIn.href,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
