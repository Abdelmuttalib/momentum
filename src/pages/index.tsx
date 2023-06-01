import { type GetServerSideProps, type NextPage } from "next";
import { useSession } from "next-auth/react";

// import { api } from "@/utils/api";
import { Layout } from "@/components/layout";
import InSpector from "@/components/@pages/home/InSpector";
import { getServerAuthSession } from "@/server/auth";
import PrintableReport from "@/components/@pages/home/PrintableReport";
import { inspections } from "@/components/@pages/home/data";
import Seo from "@/components/Seo";

const Home: NextPage = () => {
  const onPrintReportData = () => {
    window.print();
  };

  return (
    <>
      <Seo title="InSpect | invix" />
      <div className="hidden print:block">
        <PrintableReport
          data={[...inspections["Main Building"], ...inspections["Building 1"]]}
        />
      </div>
      <div className="block print:hidden">
        <Layout pageTitle="Home" className="px-0 lg:px-0">
          <InSpector onPrint={onPrintReportData} />
        </Layout>
      </div>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerAuthSession({ req, res });

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: "/team",
      permanent: false,
    },
  };
  // return {
  //   props: {
  //     session,
  //   },
  // };
};

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// };
