import React, { FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/utils/cn";
import { api } from "@/utils/api";
import { NextRouter, useRouter } from "next/router";
import Link from "next/link";
import { Project } from "@prisma/client";

interface ProjectsTabsProps {
  logTypes: string[];
  setSelectedLogType: (tab: string) => void;
}

export default function ProjectsTabs() {
  const { query }: NextRouter = useRouter();
  const teamId = query?.teamId as string;

  const { data: projects } = api.project.getAllProjectsByTeamId.useQuery(
    {
      teamId,
    },
    {
      enabled: !!teamId,
    }
  );

  return (
    <Tabs className="h-12 w-full rounded-none p-0">
      <TabsList className="flex h-full justify-start rounded-none bg-white p-0 dark:bg-gray-800/50">
        {projects?.map((project: Project) => {
          const active = query.projectId === project.id;

          return (
            <TabsTrigger
              key={project.name}
              // onClick={() => {
              //   setSelectedLogType(logType);
              // }}
              value={project.name}
              asChild
            >
              <Link
                href={`/teams/${teamId}/projects/${project.id}`}
                className={cn(
                  "lg:body-sm h-full rounded-none border-t-4 border-transparent px-4 leading-5 sm:px-5",
                  "whitespace-nowrap hover:bg-gray-200 focus:bg-gray-200 focus:outline-none dark:hover:bg-gray-800/80 dark:focus:bg-gray-800",
                  {
                    "dark:border-primary-400 border-black bg-white font-medium dark:bg-gray-800":
                      active,
                    "bg-slate-100 font-medium text-gray-500 dark:bg-gray-800/50":
                      !active,
                  }
                )}
              >
                {project.name}
              </Link>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
