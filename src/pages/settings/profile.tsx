import Container from "@/components/@pages/landing-page/container";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form-label";
import { Skeleton } from "@/components/ui/skeleton";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import supabase from "@/utils/supabase";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { decode } from "base64-arraybuffer";
import imageCompression from "browser-image-compression";
import { type ClassValue } from "clsx";
import { Upload } from "lucide-react";
import { nanoid } from "nanoid";
import { type GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { SettingsPageTabs } from ".";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const profileFormSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  image: z.any(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function UploadIcon({ className }: { className?: ClassValue }) {
  return (
    <svg
      className={cn("mb-4 h-8 w-8 text-gray-500 dark:text-gray-400", className)}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 20 16"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1"
        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
      />
    </svg>
  );
}

export default function SettingsProfilePage() {
  return (
    <Layout pageTitle="">
      <SettingsPageTabs />
    </Layout>
  );
}

type ImageFile = File | null;

export function ProfileSettings() {
  const { data: session } = useSession();
  const user = session?.user;
  const apiContext = api.useContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>();
  const [uploading, setUploading] = useState(false);
  const [inputImagePreviewUrl, setInputImagePreviewUrl] = useState<
    string | null
  >(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const updateUserProfileImageMutation =
    api.user.updateUserProfileImage.useMutation({
      onSuccess: async () => {
        toast.success("Image Uploaded Successfully");
        await apiContext.user.getUser.invalidate();
        setUploading(false);
        setInputImagePreviewUrl(null);
        setImageFile(null);
      },
      onError: () => {
        toast.error("Image Upload Failed");
        setUploading(false);
      },
    });

  const uploadImageToStorage = async (
    imageFilePath: string,
    imageDecodedFileData: ArrayBuffer,
    fileType: string
  ) => {
    const { error: uploadError } = await supabase.storage
      .from("user-profile-images")
      .upload(imageFilePath, imageDecodedFileData, {
        contentType: fileType,
        upsert: true,
      });

    if (uploadError) {
      throw new Error("Unable to upload image to storage");
    }
  };

  function getUploadedImagePublicUrl(imagePath: string) {
    const { data } = supabase.storage
      .from("user-profile-images")
      .getPublicUrl(imagePath);

    const { publicUrl: publicImageUrl } = data;

    return publicImageUrl;
  }

  async function onUploadProfileImage(imageFile: ImageFile) {
    try {
      setUploading(true);
      const inputImage = imageFile;

      if (!inputImage) {
        return;
      }

      const compressedImage = await imageCompression(inputImage, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });

      const reader = new FileReader();

      reader.readAsDataURL(compressedImage);

      reader.onload = async (e) => {
        const image = e.target?.result as string;

        const imageContentType = image.match(/data:(.*);base64/)?.[1];
        const base64FileData = image.split("base64,")?.[1];

        if (!imageContentType || !base64FileData) {
          throw new Error("Image data not valid");
        }

        const fileName = nanoid();
        const ext = imageContentType?.split("/")[1];
        const path = `${fileName}.${ext as string}`;

        const decodedFileData = decode(base64FileData);
        await uploadImageToStorage(path, decodedFileData, imageContentType);

        const publicImageUrl = getUploadedImagePublicUrl(path);

        // await insertImageToDatabase(publicImageUrl, description, is_public);

        await updateUserProfileImageMutation.mutateAsync({
          userId: user?.id as string,
          image: publicImageUrl,
        });
      };
    } catch (error) {
      console.error(error);
      toast.error("Image Upload Failed");
      setUploading(false);
    }
  }

  const { data: userData, isLoading: isLoadingUserData } =
    api.user.getUser.useQuery({
      userId: user?.id as string,
    });

  const updateUserInfoMutation = api.user.updateUserInfo.useMutation({
    onSuccess: async () => {
      toast.success("User info updated successfully");
      await apiContext.user.getUser.invalidate();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  async function onUpdateInfo(data: ProfileFormValues) {
    if (inputImagePreviewUrl || imageFile) {
      await onUploadProfileImage(imageFile);
    }
    const { firstName, lastName } = data;

    await updateUserInfoMutation.mutateAsync({
      userId: user?.id as string,
      firstName,
      lastName,
    });
  }
  return (
    <Container className="flex flex-col gap-10 py-3 sm:py-7">
      {/* <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Personal Information
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Use a permanent address where you can receive mail.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="col-span-full">
            <label
              htmlFor="photo"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Photo
            </label>
            <div className="relative mt-2 flex items-center gap-x-3 sm:col-span-3">
              {userData?.image ? (
                <div className="relative h-20 w-20">
                  <Image
                    src={userData?.image}
                    alt="profile image"
                    layout="fill"
                    className="rounded-full object-cover"
                  />
                </div>
              ) : (
                <svg
                  className="h-20 w-20 text-gray-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              )}

              <button
                type="button"
                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Change
              </button>
            </div>
          </div>
          <div className="sm:col-span-3">
            <FormLabel htmlFor="firstName">First name</FormLabel>
            <Input
              id="firstName"
              inputMode="text"
              type="text"
              placeholder="first name"
              {...register("firstName", {
                required: true,
              })}
              defaultValue={userData?.firstName || ""}
              disabled={
                isLoadingUserData ||
                updateUserInfoMutation.isLoading ||
                uploading
              }
              error={errors?.firstName}
            />
          </div>

          <div className="sm:col-span-3">
            <FormLabel htmlFor="last-name">Last name</FormLabel>
            <Input type="text" name="last-name" id="last-name" disabled />
          </div>

          <div className="sm:col-span-4">
            <FormLabel htmlFor="email">Email address</FormLabel>
            <Input
              id="email"
              name="email"
              type="email"
              disabled
              defaultValue={userData?.email || ""}
            />
          </div>

          <div className="sm:col-span-3">
            <FormLabel htmlFor="country">Country</FormLabel>
            <Select
              // {...field}
              // onValueChange={(value) => field.onChange(value as TaskStatus)}
              value="Mexico"
              defaultValue="Country"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Country" defaultValue="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Philippines">Philippines</SelectItem>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Mexico">Mexico</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2 sm:col-start-1">
            <FormLabel htmlFor="city">City</FormLabel>
            <div className="mt-2">
              <Input
                type="text"
                name="city"
                id="city"
                disabled
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
      </div> */}
      <div className="w-full">
        <h1 className="h5">Profile Settings</h1>
      </div>

      <div className="flex flex-col gap-7 divide-y-2">
        <div className="flex w-full flex-col gap-x-4 gap-y-4 md:flex-row">
          {/* profile image uploader */}
          <div className="h-fit ">
            {/* upload */}

            <div className="flex flex-col items-center gap-y-2 sm:flex-row sm:gap-x-4 lg:flex-col">
              <div className="group relative h-24 w-24 md:h-32 md:w-32">
                {isLoadingUserData && (
                  <Skeleton className="h-full w-full rounded-full" />
                )}
                {inputImagePreviewUrl && (
                  <Image
                    src={inputImagePreviewUrl}
                    alt="profile image"
                    // width={80}
                    // height={80}
                    layout="fill"
                    className="rounded-full object-cover"
                  />
                )}
                {!inputImagePreviewUrl && userData?.image && (
                  <Image
                    src={userData?.image}
                    alt="profile image"
                    layout="fill"
                    className="rounded-full object-cover"
                  />
                )}
                <label
                  htmlFor="image"
                  className={cn(
                    "dark:hover:bg-bray-800 flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600 md:h-32 md:w-32",
                    {
                      "absolute hidden group-hover:flex group-hover:bg-gray-50/50":
                        userData?.image && !isLoadingUserData,
                      flex:
                        !userData?.image &&
                        !inputImagePreviewUrl &&
                        isLoadingUserData,
                      hidden: isLoadingUserData,
                    }
                  )}
                >
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <Upload className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  </div>
                  <input
                    id="image"
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpg, image/jpeg"
                    // {...register("image", { required: true })}
                    onChange={(e) => {
                      const imageFileValue = e.target.files;
                      if (!imageFileValue) setInputImagePreviewUrl(null);
                      if (imageFileValue && imageFileValue[0]) {
                        setImageFile(imageFileValue[0]);
                        const imagePreviewUrl = URL.createObjectURL(
                          imageFileValue[0]
                        );
                        setInputImagePreviewUrl(imagePreviewUrl);
                      }
                    }}
                    disabled={
                      uploading ||
                      updateUserProfileImageMutation.isLoading ||
                      isLoadingUserData ||
                      updateUserInfoMutation.isLoading
                    }
                  />
                </label>
              </div>
              <div className="flex w-fit flex-col gap-y-1.5">
                <Button
                  type="button"
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={async () => {
                    if (imageFile) {
                      await onUploadProfileImage(imageFile);
                    }
                  }}
                  disabled={
                    uploading ||
                    !inputImagePreviewUrl ||
                    !imageFile ||
                    updateUserProfileImageMutation.isLoading
                  }
                  isLoading={
                    uploading || updateUserProfileImageMutation.isLoading
                  }
                  className="inline-flex items-center gap-x-1"
                  leftIcon={<Upload className="h-4 w-4" />}
                >
                  Upload
                </Button>
                <Button
                  type="button"
                  variant="destructive-outline"
                  onClick={() => {
                    setImageFile(null);
                    setInputImagePreviewUrl(null);
                  }}
                  disabled={
                    uploading ||
                    !inputImagePreviewUrl ||
                    updateUserProfileImageMutation.isLoading
                  }
                  leftIcon={<XMarkIcon className="h-4 w-4" />}
                >
                  Remove Image
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pb-8">
            <div className="py-2">
              <form
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onSubmit={handleSubmit(onUpdateInfo)}
                className="flex flex-col gap-5 divide-y-2"
              >
                <div className="flex w-full flex-col space-y-4">
                  <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-end lg:w-fit lg:space-y-4">
                    <div className="relative w-full">
                      <FormLabel
                        htmlFor="firstName"
                        className="text-sm font-medium text-gray-700"
                      >
                        First Name
                      </FormLabel>
                      <Input
                        id="firstName"
                        inputMode="text"
                        type="text"
                        placeholder="first name"
                        {...register("firstName", {
                          required: true,
                        })}
                        defaultValue={userData?.firstName || ""}
                        disabled={
                          isLoadingUserData ||
                          updateUserInfoMutation.isLoading ||
                          uploading
                        }
                        error={errors?.firstName}
                      />
                    </div>
                    <div className="relative w-full">
                      <FormLabel
                        htmlFor="lastName"
                        className="text-sm font-medium text-gray-700"
                      >
                        Last Name
                      </FormLabel>
                      <Input
                        id="lastName"
                        inputMode="text"
                        type="text"
                        placeholder="last name"
                        {...register("lastName", {
                          required: true,
                        })}
                        defaultValue={userData?.lastName || ""}
                        disabled={
                          isLoadingUserData ||
                          updateUserInfoMutation.isLoading ||
                          uploading
                        }
                        error={errors?.lastName}
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="sm:w-fit sm:self-end"
                    isLoading={updateUserInfoMutation.isLoading || uploading}
                    disabled={
                      isLoadingUserData ||
                      updateUserInfoMutation.isLoading ||
                      uploading
                    }
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const userSession = await getServerAuthSession({ req, res });

  if (!userSession) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
