// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { XMarkIcon } from "@heroicons/react/20/solid";
// import type { User } from "@prisma/client";
// import { GetResult } from "@prisma/client/runtime";
// import { Upload } from "lucide-react";
// import Image from "next/image";

// interface ProfileImageUploaderProps {
//   isLoadingUserData: boolean;
//   userData: (GetResult<User, unknown> & {}) | null | undefined;
//   onUploadProfileImage: (imageFile: File[] | null) => Promise<void>;
//   uploading: boolean;
//   updateUserProfileImageMutation: any;
//   setImageFile: any;
//   setInputImagePreviewUrl: any;
//   inputImagePreviewUrl: string | null;
//   imageFile: File | null;
// }

// export default function ProfileImageUploader({
//   isLoadingUserData,
//   userData,
//   onUploadProfileImage,
//   uploading,
//   updateUserProfileImageMutation,
//   setImageFile,
//   setInputImagePreviewUrl,
//   inputImagePreviewUrl,
//   imageFile,
// }: ProfileImageUploaderProps) {
//   return (
//     <div>
//       {/* upload */}
//       {isLoadingUserData && <Skeleton className="h-24 w-24 rounded-full" />}
//       {userData?.image && (
//         <div className="group relative h-24 w-24">
//           <Image
//             src={userData?.image}
//             alt="profile image"
//             layout="fill"
//             className="rounded-full object-cover"
//           />
//           {/* <label
//                     htmlFor="image"
//                     className="dark:hover:bg-bray-800 hidden h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50 group-hover:absolute group-hover:flex group-hover:bg-white/[0.7] dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
//                   >
//                     <div className="flex flex-col items-center justify-center pb-6 pt-5">
//                       <Upload className="h-6 w-6 text-gray-500 dark:text-gray-400" />
//                     </div>
//                     <input
//                       id="image"
//                       type="file"
//                       className="hidden"
//                       accept="image/png, image/jpg"
//                       onChange={(e) => {
//                         const imageFileValue = e.target.files;
//                         if (!imageFileValue) setInputImagePreviewUrl(null);
//                         if (imageFileValue && imageFileValue[0]) {
//                           setImageFile(imageFileValue[0]);
//                           const imagePreviewUrl = URL.createObjectURL(
//                             imageFileValue[0]
//                           );
//                           setInputImagePreviewUrl(imagePreviewUrl);
//                         }
//                       }}
//                       disabled={
//                         uploading || updateUserProfileImageMutation.isLoading
//                       }
//                     />
//                   </label> */}
//         </div>
//       )}
//       {!userData?.image && (
//         <div className="flex w-fit flex-col items-center gap-y-2">
//           {inputImagePreviewUrl ? (
//             <div className="flex flex-col items-center gap-1">
//               <div className="relative h-24 w-24">
//                 <Image
//                   src={inputImagePreviewUrl}
//                   alt="profile image"
//                   // width={80}
//                   // height={80}
//                   layout="fill"
//                   className="rounded-full object-cover"
//                 />
//               </div>
//             </div>
//           ) : (
//             <label
//               htmlFor="image"
//               className="dark:hover:bg-bray-800 flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
//             >
//               <div className="flex flex-col items-center justify-center pb-6 pt-5">
//                 <Upload className="h-6 w-6 text-gray-500 dark:text-gray-400" />
//                 {/* <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
//                       <span className="font-semibold">
//                         upload profile picture
//                       </span>{" "}
//                       or drag and drop
//                     </p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       PNG or JPG
//                       (MAX. 800x400px)
//                     </p> */}
//                 {/* <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
//                       <span className="font-semibold">Click to upload</span> or
//                       drag and drop
//                     </p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       SVG, PNG, JPG or GIF (MAX. 800x400px)
//                     </p> */}
//               </div>
//               <input
//                 id="image"
//                 type="file"
//                 className="hidden"
//                 accept="image/png, image/jpg"
//                 // {...register("image", { required: true })}
//                 onChange={(e) => {
//                   const imageFileValue = e.target.files;
//                   if (!imageFileValue) setInputImagePreviewUrl(null);
//                   if (imageFileValue && imageFileValue[0]) {
//                     setImageFile(imageFileValue[0]);
//                     const imagePreviewUrl = URL.createObjectURL(
//                       imageFileValue[0]
//                     );
//                     setInputImagePreviewUrl(imagePreviewUrl);
//                   }
//                 }}
//                 disabled={uploading || updateUserProfileImageMutation.isLoading}
//               />
//             </label>
//           )}
//           <div className="mx-1 flex w-full flex-col gap-y-1.5">
//             <Button
//               type="button"
//               size="sm"
//               onClick={async () => {
//                 if (imageFile) {
//                   await onUploadProfileImage(imageFile);
//                 }
//               }}
//               disabled={
//                 uploading ||
//                 !inputImagePreviewUrl ||
//                 !imageFile ||
//                 updateUserProfileImageMutation.isLoading
//               }
//               isLoading={uploading || updateUserProfileImageMutation.isLoading}
//               className="inline-flex w-full items-center gap-x-1"
//             >
//               <Upload className="h-4 w-4" />
//               Upload
//             </Button>
//             <Button
//               type="button"
//               variant="destructive-outline"
//               size="sm"
//               onClick={() => {
//                 setImageFile(null);
//                 setInputImagePreviewUrl(null);
//               }}
//               disabled={
//                 uploading ||
//                 !inputImagePreviewUrl ||
//                 updateUserProfileImageMutation.isLoading
//               }
//             >
//               <XMarkIcon className="h-4 w-4" />
//               Remove Image
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
