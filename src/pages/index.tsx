import { type GetServerSideProps } from "next";

import { getServerAuthSession } from "@/server/auth";
import Seo from "@/components/Seo";

export default function HomePage() {
  return (
    <>
      <Seo title="Momentum" />
      <main className="flex h-full min-h-[100svh] w-full items-center justify-center text-7xl font-semibold tracking-tight text-gray-800">
        Momentum
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const session = await getServerAuthSession({ req, res });

  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: "/login",
  //       permanent: false,
  //     },
  //   };
  // }

  // return {
  //   redirect: {
  //     destination: "/team",
  //     permanent: false,
  //   },
  // };
  return {
    props: {},
  };
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
