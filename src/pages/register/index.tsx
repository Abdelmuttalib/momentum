import {
  CreateAdminAccountForm,
  CreateOrganizationForm,
} from "@/components/auth/CreateOrganizationForm";
import { LoginBackground } from "@/components/layout";
import { useState } from "react";

export type RegisterStep = "company" | "user";

export default function RegisterPage() {
  const [registerStep, setRegisterStep] = useState<RegisterStep>("company");

  const [companyName, setCompanyName] = useState<string>("");

  return (
    <LoginBackground>
      <div className="flex flex-col items-center justify-center px-4">
        {registerStep === "company" && (
          <CreateOrganizationForm
            setRegisterStep={setRegisterStep}
            setCompanyName={setCompanyName}
          />
        )}
        {registerStep === "user" && (
          <CreateAdminAccountForm
            companyName={companyName}
            setRegisterStep={setRegisterStep}
          />
        )}
      </div>
    </LoginBackground>
  );
}
