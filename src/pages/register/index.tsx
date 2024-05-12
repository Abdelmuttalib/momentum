import {
  CreateAdminAccountForm,
  CreateCompanyForm,
} from "@/components/auth/CreateCompanyForm";
import { AuthLayout } from "@/components/layout";
import Seo from "@/components/Seo";
import { useState } from "react";

export type RegisterStep = "company" | "user";

export default function RegisterPage() {
  const [registerStep, setRegisterStep] = useState<RegisterStep>("company");

  const [companyName, setCompanyName] = useState<string>("");

  return (
    <>
      <Seo title="New Company/Workspace" />

      <AuthLayout>
        <div className="flex w-full max-w-lg flex-col items-center justify-center px-4">
          {registerStep === "company" && (
            <CreateCompanyForm
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
      </AuthLayout>
    </>
  );
}
