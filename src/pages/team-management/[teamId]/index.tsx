import { Layout } from "@/components/layout";
import { prisma } from "@/server/db";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import cn from "@/utils/cn";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronRightIcon, PlusIcon } from "@heroicons/react/20/solid";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectStatus } from "@/utils/enums";
import Link from "next/link";
import { useRouter } from "next/router";
import type { Project } from "@prisma/client";
import Badge, { getProjectStatusBadgeColor } from "@/components/ui/badge";

const projectFormSchema = z.object({
  name: z.string().min(1, "Please enter a team name").nonempty(),
  status: z.nativeEnum(ProjectStatus),
});

type TProjectForm = z.infer<typeof projectFormSchema>;

export function CreateProjectForm({
  onSuccess,
  onCancel,
  teamId,
}: {
  onSuccess: () => void;
  onCancel: () => void;
  teamId: string;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TProjectForm>({
    resolver: zodResolver(projectFormSchema),
  });

  const createProjectMutation = api.project.createProject.useMutation({
    onSuccess: () => {
      // Handle the new team. For example, you could redirect to the team's page
      onSuccess();
      reset();
      toast.success("New project created!");
    },
    onError: () => {
      toast.error("Failed to create new project");
    },
  });

  async function onCreateProject(data: TProjectForm): Promise<void> {
    await createProjectMutation.mutateAsync({
      name: data.name,
      teamId: teamId,
      status: data.status,
    });
    // Handle the new team. For example, you could redirect to the team's page
    // console.log(newTeam);
  }

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onCreateProject)}
      className="flex flex-col gap-2"
    >
      <div>
        <Label htmlFor="name">Project Name:</Label>
        <Input
          id="name"
          type="text"
          {...register("name")}
          placeholder="team name"
          inputMode="text"
          className={cn({
            "border-red-500": errors.name,
          })}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      {/* Status Select */}
      <div>
        <Label htmlFor="status">Project Status: </Label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select {...field} onValueChange={(value) => field.onChange(value)}>
              <SelectTrigger className="w-full text-gray-800">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup>
                  {Object.values(ProjectStatus).map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="capitalize"
                    >
                      <Badge
                        color={getProjectStatusBadgeColor(status)}
                        className="capitalize"
                      >
                        {status.replace("_", " ").toLocaleLowerCase()}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.status && (
          <p className="text-red-500">{errors.status.message}</p>
        )}
      </div>

      <div className="flex flex-col-reverse md:flex-row md:gap-2">
        <Button
          type="button"
          variant="outline"
          className="mt-2"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" className="mt-2 flex-1">
          Create Project
        </Button>
      </div>
    </form>
  );
}

const CreateNewProjectDialog = ({
  onSuccess,
  teamId,
}: {
  onSuccess: () => void;
  teamId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="ml-2 inline-flex gap-1 whitespace-nowrap">
          <PlusIcon className="w-5" /> Create Project
        </Button>
      </DialogTrigger>
      {isOpen && (
        <DialogContent className="mt-10 bg-white sm:max-w-sm">
          <DialogHeader className="space-y-0">
            <DialogTitle>
              <h2 className="h5 inline">Create a new Project</h2>
            </DialogTitle>
            <DialogDescription className="body-sm inline text-gray-600">
              <p>
                Projects are where you manage your team&apos;s work. Each
                project has its own board and issues.
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
          <CreateProjectForm
            teamId={teamId}
            onSuccess={() => {
              onSuccess();
              setIsOpen(false);
            }}
            onCancel={() => setIsOpen(false)}
          />
        </DialogContent>
      )}
    </Dialog>
  );
};

type TeamPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const TeamPage = ({ projects, teamId }: TeamPageProps) => {
  console.log(projects);
  const { asPath } = useRouter();
  const { refetch } = api.project.allProjects.useQuery();

  return (
    <Layout pageTitle="Team Projects">
      <div className="flex w-full items-center justify-between">
        <h1 className="h2">Team Projects</h1>
        <CreateNewProjectDialog
          onSuccess={refetch as () => void}
          teamId={teamId}
        />
      </div>
      <div>
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`${asPath}/projects/${project.id}`}
              className="flex h-36 flex-col justify-between rounded-lg border-2 border-gray-200 px-6 py-4 hover:border-primary-100 hover:bg-primary-70"
            >
              <div>
                <span>Project ID: {project.id}</span>
              </div>
              <div className="flex w-full justify-between">
                <h3 className="h5">{project.name}</h3>
                <ChevronRightIcon className="w-7" />
              </div>
              <div>
                <Badge
                  color={getProjectStatusBadgeColor(
                    project.status as ProjectStatus
                  )}
                >
                  {project.status.replace("_", " ").toLowerCase()}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default TeamPage;

export const getServerSideProps: GetServerSideProps<{
  projects: Project[];
  teamId: string;
}> = async ({ params }) => {
  const teamId = params?.teamId as string;
  const projects = await prisma.project.findMany({
    where: {
      teamId,
    },
  });

  console.log("projects: ", projects);

  return {
    props: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      projects: JSON.parse(JSON.stringify(projects)),
      teamId,
    },
  };
};
