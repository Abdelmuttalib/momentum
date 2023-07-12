import { zodResolver } from "@hookform/resolvers/zod";
import type { Dispatch, FC, SetStateAction } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { cn } from "@/utils/cn";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { type TAuthType } from "./AuthContainer";
import useTranslation from "next-translate/useTranslation";
import { IconLink } from "@/components/ui/icon-button";
import { useRouter } from "next/router";

const CreateAccountForm: FC<{
  setAuthType: Dispatch<SetStateAction<TAuthType>>;
}> = ({ setAuthType }) => {
  const { t } = useTranslation("login");
  const { locale, asPath } = useRouter();
  const signUpValidationSchema = z
    .object({
      // email: z
      //   .string()
      //   .min(1, { message: 'kindly enter your email' })
      //   .email({ message: 'kindly enter a valid email' }),
      phoneNumber: z
        .string()
        .regex(/^1[3-9]\d{9}$/, "validations.phoneNumber")
        .nonempty(),
      name: z
        .string()
        .min(2, { message: "validations.name" })
        .nonempty({ message: "kindly enter your name" }),
      email: z
        .string()
        .min(1, { message: "validations.email" })
        .email({ message: "kindly enter a valid email" }),

      password: z.string().min(8, { message: "validations.password" }),
      confirmPassword: z.string().min(8, { message: "validations.password" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      // message: 'passwords do not match',
      message: "密码不匹配",
    });

  type TSignUpFormFields = z.infer<typeof signUpValidationSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignUpFormFields>({
    resolver: zodResolver(signUpValidationSchema),
  });

  const onSubmit: SubmitHandler<TSignUpFormFields> = (data): void => {
    // onCreateAccount

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phoneNumber: data.phoneNumber,
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    };

    fetch("/api/user/register", requestOptions)
      .then((response) => {
        if (response.ok) {
          // toast.success('Account created successfully');
          toast.success("账号创建成功");
          setAuthType("sign-in");
        }
      })
      .catch(() => {
        toast.error("Something went wrong, kindly try again!");
      });
  };

  return (
    <div className="w-full max-w-md bg-white px-6 py-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="h3">{t("headings.getStarted")}</h1>
        <IconLink
          variant="secondary"
          href={asPath}
          locale={locale === "en" ? "zh" : "en"}
          className="uppercase"
        >
          {locale === "en" ? "zh" : "en"}
        </IconLink>
      </div>
      <p className="text-gray-700">
        {t("paragraphs.createAccountDescription")}
      </p>

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
              className="rounded-l-none border-l-0 outline-none focus:border-l-0"
            />
          </div>
          {errors.phoneNumber && (
            <p className="mt-0.5 text-sm text-red-500">
              {t(`${errors.phoneNumber.message as string}`)}
            </p>
          )}
        </div>

        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-gray-600">
            {t("labels.name")}
          </label>
          <Input
            id="name"
            type="name"
            {...register("name", { required: true })}
            placeholder={`${t("labels.name")}`}
            className={cn("mt-0.5", { "border-red-500": errors.name })}
          />
          {errors.name && (
            <p className="mt-0.5 text-sm text-red-500">
              {t(`${errors.name.message as string}`)}
            </p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-gray-600">
            {t("labels.email")}
          </label>
          <Input
            id="email"
            type="email"
            {...register("email", { required: true })}
            placeholder={`${t("labels.email")}`}
            className={cn("mt-0.5", { "border-red-500": errors.email })}
          />
          {errors.email && (
            <p className="mt-0.5 text-sm text-red-500">
              {t(`${errors.email.message as string}`)}
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
            placeholder={`${t("labels.password")}`}
            className={cn("mt-0.5", { "border-red-500": errors.password })}
          />
          {errors.password && (
            <p className="mt-0.5 text-sm text-red-500">
              {t(`${errors.password.message as string}`)}
            </p>
          )}
        </div>

        {/* <div>
            <label htmlFor='password' className='block text-gray-600'>
              Password
            </label>
            <input
              id='password'
              type='password'
              {...register('password', { required: true })}
              placeholder='password'
              className={cn('input-2 mt-0.5', {
                'border-red-500': errors.password,
              })}
            />
            {errors.password && (
              <p className='mt-0.5 text-sm text-red-500'>
                {errors.password?.message}
              </p>
            )}
          </div> */}

        {/* Confirm Password Input */}
        <div>
          <label htmlFor="confirmPassword" className="block text-gray-600">
            {t("labels.confirmPassword")}
          </label>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword", { required: true })}
            placeholder={t("labels.confirmPassword")}
            className={cn("mt-0.5", {
              "border-red-500": errors.confirmPassword,
            })}
          />
          {errors.confirmPassword && (
            <p className="mt-0.5 text-sm text-red-500">
              {t(`${errors?.password?.message as string}`)}
            </p>
          )}
        </div>

        {/* Auth Buttton */}
        <Button
          type="submit"
          disabled={Object.keys(errors).length > 0}
          className="mt-2 w-full"
        >
          {t("buttons.createAccount")}
        </Button>

        {/* Another Auth Routes */}

        <div className="text-center text-sm font-medium text-gray-700 sm:mb-4 sm:flex sm:items-center sm:gap-1">
          <span>{t("paragraphs.alreadyHaveAnAccount")}</span>
          <button
            onClick={() => setAuthType("sign-in")}
            className="flex-2 text-primary underline"
          >
            {t("buttons.signIn")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccountForm;
