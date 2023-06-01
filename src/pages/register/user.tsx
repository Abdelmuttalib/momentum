import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import cn from "@/utils/cn";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import useTranslation from "next-translate/useTranslation";
import { IconLink } from "@/components/ui/icon-button";
import { useRouter } from "next/router";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { api } from "@/utils/api";
import { LoginBackground } from "@/components/layout";

function CreateUserAccountForm() {
  const { t } = useTranslation("login");
  const { locale, asPath, back, push } = useRouter();
  const signUpValidationSchema = z
    .object({
      phoneNumber: z
        .string()
        .regex(/^1[3-9]\d{9}$/)
        .nonempty(),
      firstName: z.string().min(2).nonempty(),
      lastName: z.string().min(2).nonempty(),
      email: z.string().min(1).email(),
      password: z.string().min(8),
      confirmPassword: z.string().min(8),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
    });

  type TCreateUserAccountForm = z.infer<typeof signUpValidationSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TCreateUserAccountForm>({
    resolver: zodResolver(signUpValidationSchema),
  });

  const registerInvitedUserMutation =
    api.organization.registerInvitedUser.useMutation({
      onSuccess: async () => {
        toast.success("Account created successfully");
        await push("/login");
      },
      onError: () => {
        toast.error("Something went wrong, kindly try again!");
      },
    });

  async function onSubmit(data: TCreateUserAccountForm) {
    await registerInvitedUserMutation.mutateAsync({
      phoneNumber: data.phoneNumber,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    });

    // onCreateAccount
    // const requestOptions = {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     phoneNumber: data.phoneNumber,
    //     name: data.name,
    //     email: data.email,
    //     password: data.password,
    //   }),
    // };
    // fetch("/api/user/register", requestOptions)
    //   .then((response) => {
    //     if (response.ok) {
    //       // toast.success('Account created successfully');
    //       toast.success("账号创建成功");
    //     }
    //   })
    //   .catch(() => {
    //     toast.error("Something went wrong, kindly try again!");
    //   });
  }

  return (
    <div className="w-full max-w-md bg-white px-6 py-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="h3">{t("headings.getStarted")}</h1>
        {/* <IconLink
          variant="secondary"
          href={asPath}
          locale={locale === "en" ? "zh" : "en"}
          className="uppercase"
        >
          {locale === "en" ? "zh" : "en"}
        </IconLink> */}
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
            <div className="flex w-14 items-center justify-center rounded-l-primary border-2 border-r-0 bg-gray-100/70">
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

        {/* First Name Input */}
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <div className="w-full">
            <label htmlFor="firstName" className="block text-gray-600">
              First Name
            </label>
            <Input
              id="firstName"
              type="firstName"
              {...register("firstName", { required: true })}
              placeholder="first name"
              className={cn("mt-0.5", { "border-red-500": errors.firstName })}
            />
            {errors.firstName && (
              <p className="mt-0.5 text-sm text-red-500">
                {t(`${errors.firstName.message as string}`)}
              </p>
            )}
          </div>

          <div className="w-full">
            <label htmlFor="lastName" className="block text-gray-600">
              Last Name
            </label>
            <Input
              id="lastName"
              type="lastName"
              {...register("lastName", { required: true })}
              placeholder="last name"
              className={cn("mt-0.5", { "border-red-500": errors.lastName })}
            />
            {errors.lastName && (
              <p className="mt-0.5 text-sm text-red-500">
                {t(`${errors.lastName.message as string}`)}
              </p>
            )}
          </div>
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-gray-600">
            Email
          </label>
          <Input
            id="email"
            type="email"
            {...register("email", { required: true })}
            placeholder="Email"
            className={cn("mt-0.5", { "border-red-500": errors.email })}
          />
          {errors.email && (
            <p className="mt-0.5 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-gray-600">
            Password
          </label>
          <Input
            id="password"
            type="password"
            {...register("password", { required: true })}
            placeholder="password"
            className={cn("mt-0.5", { "border-red-500": errors.password })}
          />
          {errors.password && (
            <p className="mt-0.5 text-sm text-red-500">
              {errors.password.message}
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
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword", { required: true })}
            placeholder="confirm password"
            className={cn("mt-0.5", {
              "border-red-500": errors.confirmPassword,
            })}
          />
          {errors.confirmPassword && (
            <p className="mt-0.5 text-sm text-red-500">
              {errors?.password?.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={
            Object.keys(errors).length > 0 ||
            registerInvitedUserMutation.isLoading
          }
          isLoading={registerInvitedUserMutation.isLoading}
          className="mt-2 w-full"
        >
          {t("buttons.createAccount")}
        </Button>

        {/* Another Auth Routes */}

        <div className=" text-sm font-medium text-gray-700 sm:mb-4 sm:flex sm:items-center sm:gap-1">
          <Button
            type="button"
            variant="secondary"
            className="group mx-6 bg-transparent transition-all duration-300 hover:-ml-0.5  hover:bg-transparent focus:bg-transparent"
            onClick={() => back()}
          >
            <ArrowLeftIcon className="-ml-1 mr-1 h-5 w-5 transition-all duration-300 " />
            Back
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function RegisterUserPage() {
  return (
    <LoginBackground>
      <CreateUserAccountForm />
    </LoginBackground>
  );
}
