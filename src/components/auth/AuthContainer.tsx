import React, { useState } from "react";
import SignInForm from "./SignInForm";
import CreateAccountForm from "./CreateAccountForm";

export type TAuthType = "sign-in" | "create-account";

const Auth = () => {
  const [authType, setAuthType] = useState<TAuthType>("sign-in");

  return (
    <div className="flex w-full items-center justify-center">
      {authType === "sign-in" ? (
        <SignInForm setAuthType={setAuthType} />
      ) : (
        <CreateAccountForm setAuthType={setAuthType} />
      )}
    </div>
  );
};

export default Auth;
