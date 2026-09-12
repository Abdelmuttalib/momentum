import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/lib/api";
import { cn } from "@/lib/cn";
import supabase from "@/lib/supabase";
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
import { SettingsContentLayout, SettingsSectionTitle } from ".";
import { ButtonLoaderIcon } from "@/components/common/button-loader-icon";
import {
  SettingDivider,
  SettingSection,
} from "@/components/settings/setting-section";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrl } from "@/lib/avatar";

const profileFormSchema = z.object({
  name: z.string(),
  image: z.any(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function UploadIcon({ className }: { className?: ClassValue }) {
  return (
    <svg
      className={cn("mb-4 h-8 w-8 text-muted-foreground", className)}
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
    <SettingsContentLayout>
      <SettingsSectionTitle>Profile</SettingsSectionTitle>
      <ProfileSettings />
    </SettingsContentLayout>
  );
}

type ImageFile = File | null;

export function ProfileSettings() {
  const { data: session } = useSession();
  const user = session?.user;
  const apiContext = api.useContext();
  const form = useForm<ProfileFormValues>();
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
        const path = `${fileName}.${ext}`;

        const decodedFileData = decode(base64FileData);
        await uploadImageToStorage(path, decodedFileData, imageContentType);

        const publicImageUrl = getUploadedImagePublicUrl(path);

        // await insertImageToDatabase(publicImageUrl, description, is_public);

        await updateUserProfileImageMutation.mutateAsync({
          userId: user?.id,
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
      userId: user?.id,
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
    const { name } = data;

    await updateUserInfoMutation.mutateAsync({
      userId: user?.id,
      name,
    });
  }

  const controlsDisabled =
    uploading ||
    updateUserProfileImageMutation.isLoading ||
    isLoadingUserData ||
    updateUserInfoMutation.isLoading;

  return (
    <div className="flex flex-col">
      <SettingSection
        title="Photo"
        description="Your avatar across the workspace."
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="group relative h-20 w-20 shrink-0">
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
            {userData &&
              !userData?.image &&
              !inputImagePreviewUrl &&
              !isLoadingUserData && (
                <Avatar className="h-full w-full">
                  <AvatarImage
                    src={getAvatarUrl(userData?.name, { text: "S", size: 80 })}
                    alt="profile image"
                  />
                </Avatar>
              )}

            {/* <label
              htmlFor="image"
              className={cn(
                "flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-input bg-muted hover:bg-accent",
                {
                  "absolute hidden group-hover:flex group-hover:bg-muted/60":
                    userData?.image && !isLoadingUserData,
                  flex:
                    !userData?.image &&
                    !inputImagePreviewUrl &&
                    isLoadingUserData,
                  hidden: isLoadingUserData,
                }
              )}
            >
              <span className="sr-only">Choose a profile photo</span>
              <Upload className="h-5 w-5 text-muted-foreground" />
              <input
                id="image"
                type="file"
                className="hidden"
                accept="image/png, image/jpg, image/jpeg"
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
                disabled={controlsDisabled}
              />
            </label> */}
          </div>
          {/* <div className="flex flex-row gap-2 sm:flex-col lg:flex-row">
            <Button
              type="button"
              size="sm"
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
              className="inline-flex items-center gap-x-1"
            >
              <ButtonLoaderIcon
                isPending={
                  uploading || updateUserProfileImageMutation.isLoading
                }
              />
              <Upload className="h-4 w-4" />
              Upload
            </Button>
            <Button
              type="button"
              size="sm"
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
            >
              <XMarkIcon className="h-4 w-4" />
              Remove
            </Button>
          </div> */}
        </div>
      </SettingSection>

      <SettingDivider />

      <SettingSection title="Name" description="How your name appears.">
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={form.handleSubmit(onUpdateInfo)}
          className="flex max-w-md flex-col gap-3"
        >
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              inputMode="text"
              type="text"
              placeholder="Your name"
              {...form.register("name", {
                required: true,
              })}
              defaultValue={userData?.name || ""}
              disabled={controlsDisabled}
              data-invalid={form.formState.errors?.name?.message}
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="self-start"
            disabled={controlsDisabled}
          >
            <ButtonLoaderIcon
              isPending={updateUserInfoMutation.isLoading || uploading}
            />
            Save changes
          </Button>
        </form>
      </SettingSection>
    </div>
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
