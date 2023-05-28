import {
  CreateAdminAccountForm,
  CreateOrganizationForm,
} from "@/components/auth/CreateOrganizationForm";
import { LoginBackground } from "@/components/layout";
import { useState } from "react";

export type TRegisterStep = "organization" | "user";

export default function RegisterPage() {
  const [registerStep, setRegisterStep] =
    useState<TRegisterStep>("organization");

  const [organizationName, setOrganizationName] = useState<string>("");

  return (
    <LoginBackground>
      <div className="flex flex-col items-center justify-center px-4">
        {registerStep === "organization" && (
          <CreateOrganizationForm
            setRegisterStep={setRegisterStep}
            setOrganizationName={setOrganizationName}
          />
        )}
        {registerStep === "user" && (
          <CreateAdminAccountForm
            organizationName={organizationName}
            setRegisterStep={setRegisterStep}
          />
        )}
      </div>
    </LoginBackground>
  );
}
