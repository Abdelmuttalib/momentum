import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import type { Dispatch, FC, SetStateAction } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { cn } from "@/utils/cn";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { type TAuthType } from "./AuthContainer";
import useTranslation from "next-translate/useTranslation";
import { IconLink } from "../ui/icon-button";

const SignInForm: FC<{
  setAuthType: Dispatch<SetStateAction<TAuthType>>;
}> = ({ setAuthType }) => {
  const { t } = useTranslation("login");
  const { push, locale, asPath } = useRouter();
  const signInValidationSchema = z.object({
    phoneNumber: z
      .string()
      .regex(/^1[3-9]\d{9}$/, "validations.phoneNumber")
      .nonempty(),
    password: z
      .string()
      .min(8, { message: "validations.password" })
      .max(50)
      .nonempty(),
  });

  type TSignInFormFields = z.infer<typeof signInValidationSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignInFormFields>({
    resolver: zodResolver(signInValidationSchema),
  });

  const onSubmit: SubmitHandler<TSignInFormFields> = (data) => {
    // onSignIn
    signIn("credentials", {
      phoneNumber: data.phoneNumber,
      password: data.password,
      callbackUrl: "/",
      redirect: false,
      // callbackUrl: `${window.location.origin}/dashboard/projects`,
    })
      .then(async (response) => {
        if (response?.ok) {
          // toast.success('Signed in successfully');
          toast.success("登录成功");
          if (response.url) {
            await push(response.url);
          }
        }
        // const userSignedInData = response?.data;
      })
      .catch(() => {
        toast.error("Something went wrong, kindly try again");
      });
  };

  return (
    <div className="w-full max-w-md bg-white px-6 py-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="h3 text-gray-800">{t("headings.signIn")}</h1>
        <IconLink
          variant="secondary"
          href={asPath}
          locale={locale === "en" ? "zh" : "en"}
          className="uppercase"
        >
          {locale === "en" ? "zh" : "en"}
        </IconLink>
      </div>

      <p className="text-gray-700">{t("paragraphs.signinDescription")}</p>

      <form
        className="mt-10 flex flex-col gap-3"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Phone Number Input */}
        <div>
          <label htmlFor="phoneNumber">{t("labels.phoneNumber")}</label>
          <div className="relative flex">
            <div className="rounded-l-primary flex w-14 items-center justify-center border-2 border-r-0 bg-gray-100/70">
              <span className="label-sm text-gray-600">+86</span>
            </div>
            <Input
              id="phoneNumber"
              {...register("phoneNumber")}
              type="tel"
              placeholder="1XXXXXXXXX"
              // className='rounded-l-none border-l-0 outline-none'
              className={cn("rounded-l-none border-l-2 outline-none", {
                "border-red-500": errors.password,
              })}
            />
          </div>
          {errors.phoneNumber && (
            <p className="mt-0.5 text-sm text-red-500">
              {t(errors.phoneNumber.message as string)}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-gray-600">
            {t("labels.password")}
          </label>
          <Input
            id="password"
            type="password"
            {...register("password", { required: true })}
            // placeholder='password'
            placeholder={t("labels.password")}
            className={cn("mt-1", { "border-red-500": errors.password })}
          />
          {errors.password && (
            <p className="mt-0.5 text-sm text-red-500">
              {t(errors.password?.message as string)}
            </p>
          )}
        </div>

        {/* Auth Buttton */}
        <Button
          type="submit"
          disabled={Object.keys(errors).length > 0}
          className="mt-2 w-full"
        >
          {t("buttons.signIn")}
        </Button>

        {/* Another Auth Routes */}
        <div className="text-center text-sm font-medium text-gray-700 sm:mb-4 sm:flex sm:items-center sm:gap-1">
          <span>{t("paragraphs.alreadyHaveAnAccount")}</span>
          <button
            onClick={() => setAuthType("create-account")}
            className="flex-2 text-primary underline"
          >
            {/* Register a new organization */}
            {t("buttons.createAnAccount")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
