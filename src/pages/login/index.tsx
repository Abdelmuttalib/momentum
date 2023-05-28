import { type GetServerSideProps } from "next";

import Auth from "@/components/auth/AuthContainer";
import { LoginBackground } from "@/components/layout";

import { getServerAuthSession } from "@/server/auth";

const LoginPage = () => {
  return (
    <LoginBackground>
      <Auth />
    </LoginBackground>
  );
};

export default LoginPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (session?.user) {
    return {
      redirect: {
        destination: "/team",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
};
