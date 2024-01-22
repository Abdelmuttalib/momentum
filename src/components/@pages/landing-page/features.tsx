import React from "react";
import Container from "./container";
import { UsersIcon } from "lucide-react";

const features = [
  {
    title: "Create Projects",
    description:
      "Easily create projects and assign them to team members. Specify due dates, priorities, and add detailed descriptions.",
    icon: <UsersIcon className="h-6 w-6 text-brand-600" />,
  },
  {
    title: "Collaborate and Discuss",
    description:
      "Seamlessly collaborate with your team members. Leave comments, attach files, and have meaningful discussions on tasks and projects.",
    icon: <UsersIcon className="h-6 w-6 text-brand-600" />,
  },
  // {
  //   title: "Track Progress",
  //   description:
  //     "Monitor the progress of your tasks and projects in real-time. Get a clear overview of pending tasks, upcoming deadlines, and completed work.",
  //   icon: <UsersIcon className="h-6 w-6 text-brand-600" />,
  // },
  {
    title: "Create Tasks",
    description:
      "Easily create tasks and assign them to team members. Specify due dates, priorities, and add detailed descriptions.",
    icon: <UsersIcon className="h-6 w-6 text-brand-600" />,
  },
];

export default function Features() {
  return (
    <div id="features" className="pt-10">
      <Container>
        <div className="mx-auto text-center md:w-2/3">
          <h2 className="h2 primary-text-gradient my-8 font-bold  lg:font-bold">
            Empowering Team Collaboration and Project Management
          </h2>
          <p className="text-gray-600 dark:text-gray-300 md:text-lg">
            Introducing Momentum, a Next.js-powered application, designed to
            reshape how you approach team collaboration, project management, and
            task coordination. The platform is built to seamlessly integrate
            team management, and project oversight all in one place.
          </p>
        </div>
        <div className="mt-16 grid gap-8 divide-gray-100 text-gray-600 dark:divide-gray-700 dark:border-gray-700 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, description, icon }, indx) => (
            <>
              <div
                key={title}
                className="group relative w-full rounded-lg border shadow-2xl shadow-gray-600/10 transition hover:z-[1] hover:shadow-brand-600/20 dark:bg-gray-800/10 dark:shadow-gray-900/10"
              >
                <div className="relative space-y-8 p-5 py-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-x-2">
                      <span className="inline-block rounded-lg bg-gray-100 p-2">
                        {icon}
                      </span>
                      <h5 className="font-semibold text-gray-700 transition dark:text-white md:text-lg">
                        {title}
                      </h5>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {description}
                    </p>
                  </div>
                </div>
                {/* {indx !== features.length - 1 && (
                  <div className="h-full w-2 bg-gray-300"></div>
                )} */}
              </div>
            </>
          ))}
        </div>
      </Container>
    </div>
  );
}
