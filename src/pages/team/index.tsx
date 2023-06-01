/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PlusIcon } from "@heroicons/react/20/solid";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { DataTable } from "@/components/@pages/team/data-table";
// import { columns } from "@/components/@pages/team/TeamMembersTable/payments";
import { api } from "@/utils/api";
import CreateTeamForm from "@/components/@pages/team/CreateTeamForm";
import { getServerAuthSession } from "@/server/auth";
import type { Session } from "next-auth";
import type { Organization, User } from "@prisma/client";
import { DataTable } from "@/components/@pages/team/TeamMembers/data-table";

import { organizationTeamsColumns } from "@/components/@pages/organization/organization-teams";

// const InviteUserForm: FC<{
//   onSuccess: () => void;
//   onCancel: () => void;
// }> = ({ onCancel }) => {
//   // const { mutate } = useSWRConfig();
//   const addProjectFormSchema = z.object({
//     phoneNumber: z
//       .string()
//       .regex(
//         /^1[3-9]\d{9}$/,
//         "Please enter a valid 10-digit phone number starting with 1 and the second digit between 3 and 9"
//       )
//       .nonempty(),
//   });

//   type TInviteUserFormFields = z.infer<typeof addProjectFormSchema>;

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<TInviteUserFormFields>({
//     resolver: zodResolver(addProjectFormSchema),
//   });

//   const onInviteUser: SubmitHandler<TInviteUserFormFields> = () => {

//   };

//   return (
//     <form
//       onSubmit={void handleSubmit(onInviteUser)}
//       className="flex max-w-md flex-col gap-2"
//     >
//       <div>
//         <label htmlFor="name">Phone Number:</label>
//         <div className="relative flex">
//           <div className="flex w-14 items-center justify-center rounded-l-primary border-2 border-r-0 bg-gray-100/70">
//             <span className="label-sm text-gray-600">+86</span>
//           </div>
//           <Input
//             id="phoneNumber"
//             {...register("phoneNumber")}
//             type="tel"
//             placeholder="1XXXXXXXXX"
//             // className='rounded-l-none border-l-0 outline-none'
//             className="rounded-l-none border-l-0 outline-none focus:border-l-0"
//           />
//         </div>
//         {errors?.phoneNumber && (
//           <p className="mt-0.5 text-sm text-red-500">
//             {errors.phoneNumber.message}
//           </p>
//         )}
//       </div>
//       <div className="mt-4 flex gap-2 self-end">
//         <Button
//           type="button"
//           variant="secondary"
//           className="py-2"
//           onClick={onCancel}
//         >
//           Cancel
//         </Button>
//         <Button type="submit" className="inline-flex gap-1 py-2">
//           <PlusIcon className="w-5" />
//           invite user
//         </Button>
//       </div>
//     </form>
//   );
// };

interface CreateNewTeamDialogProps {
  organizationId: User["organizationId"];
}

export function CreateNewTeamDialog({
  organizationId,
}: CreateNewTeamDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="ml-2 inline-flex gap-1 whitespace-nowrap">
          <PlusIcon className="w-5" /> Create Team
        </Button>
      </DialogTrigger>
      {isOpen && (
        <DialogContent className="mt-10 bg-white sm:max-w-sm">
          <DialogHeader className="space-y-0">
            <DialogTitle>
              <h2 className="h5 inline">Create a new Team</h2>
            </DialogTitle>
            <DialogDescription className="body-sm inline text-gray-600">
              <p>
                Teams are a great way to organize your projects and invite other
                users
              </p>
            </DialogDescription>
          </DialogHeader>
          {/* <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <label htmlFor='name' className='text-right'>
              Name
            </label>
            <Input id='name' value='Pedro Duarte' className='col-span-3' />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <label htmlFor='username' className='text-right'>
              Username
            </label>
            <Input id='username' value='@peduarte' className='col-span-3' />
          </div>
        </div> */}
          <CreateTeamForm
            organizationId={organizationId}
            onCancel={() => setIsOpen(false)}
          />
        </DialogContent>
      )}
    </Dialog>
  );
}

type UserManagementPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

const UserManagementPage: NextPage<UserManagementPageProps> = ({
  organizationId,
}) => {
  const { data: allOrganizationTeams } =
    api.team.admin.getAllTeamsByOrganization.useQuery(
      {
        organizationId,
      },
      {
        enabled: !!organizationId,
      }
    );

  return (
    <Layout pageTitle="Team Management">
      {/* <UserManagementTable /> */}
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-end">
          <CreateNewTeamDialog organizationId={organizationId} />
        </div>
        <div>
          {allOrganizationTeams && (
            <DataTable
              columns={organizationTeamsColumns}
              data={allOrganizationTeams}
            />
          )}
        </div>
        {/* <CustomTableLayout className="overflow-x-auto">
          <CustomTableHead className="grid-cols-4">
            <CustomTableHeadItem>Team Name</CustomTableHeadItem>
            <CustomTableHeadItem>Projects</CustomTableHeadItem>
            <CustomTableHeadItem>Members</CustomTableHeadItem>
            <CustomTableHeadItem>Actions</CustomTableHeadItem>
          </CustomTableHead>

          <CustomTableBody className="w-full overflow-x-auto">
            {allOrganizationTeams?.map((team) => (
              <CustomTableRow key={team.id} className="grid-cols-4">
                <CustomTableRowItem>{team.name}</CustomTableRowItem>
                <CustomTableRowItem className="flex gap-3 truncate pr-8">
                  {team.projects.map((project) => (
                    <>
                      <p key={project.id} className="whitespace-nowrap">
                        {project.name}
                      </p>
                      <span className="-ml-3">,</span>
                    </>
                  ))}
                </CustomTableRowItem>
                <CustomTableRowItem className="w-fit">
                  {team.users.length}
                </CustomTableRowItem>
                <CustomTableRowItem className="flex items-center gap-3">
                  <IconLink
                    href={`/team/${team.id}`}
                    variant="secondary"
                    className="h-full px-3 py-2"
                    size="sm"
                  >
                    View
                  </IconLink>
                  <AddUserDialog team={team} />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline-destructive"
                    className="h-9"
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={() => onDeleteClick(team.id)}
                  >
                    Delete
                  </Button>
                </CustomTableRowItem>
              </CustomTableRow>
            ))}
          </CustomTableBody>
        </CustomTableLayout> */}
      </div>
    </Layout>
  );
};

{
  /* <div className="flex gap-3">
          <IconLink
            href={`/team/${original.id}`}
            variant="outline"
            className="h-full py-3"
          >
            View
          </IconLink>
          <AddUserDialog team={original as TTeam} />
          <Button
            type="button"
            size="sm"
            variant="outline"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={onDeleteClick}
          >
            Delete
          </Button>
        </div> */
}

export default UserManagementPage;

export const getServerSideProps: GetServerSideProps<{
  userSession: Session | null;
  organizationId: Organization["id"];
}> = async ({ req, res }) => {
  const userSession = await getServerAuthSession({ req, res });

  if (!userSession) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      userSession: JSON.parse(JSON.stringify(userSession)),
      organizationId: userSession.user.organizationId,
    },
  };
};
