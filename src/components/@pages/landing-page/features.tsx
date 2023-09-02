import React from "react";
import Container from "./container";

const features = [
  {
    title: "Create Projects",
    description:
      "Easily create projects and assign them to team members. Specify due dates, priorities, and add detailed descriptions.",
  },
  {
    title: "Collaborate and Discuss",
    description:
      "Seamlessly collaborate with your team members. Leave comments, attach files, and have meaningful discussions on tasks and projects.",
  },
  {
    title: "Track Progress",
    description:
      "Monitor the progress of your tasks and projects in real-time. Get a clear overview of pending tasks, upcoming deadlines, and completed work.",
  },
  {
    title: "Create Tasks",
    description:
      "Easily create tasks and assign them to team members. Specify due dates, priorities, and add detailed descriptions.",
  },
];

export default function Features() {
  return (
    <div id="features" className="pt-10">
      <Container>
        <div className="mx-auto text-center md:w-2/3">
          <h2 className="h1 my-8 bg-gradient-to-br from-gray-800 to-brand-700 bg-clip-text font-bold text-gray-800 text-transparent dark:from-brand-700 dark:via-brand-600 dark:to-brand-400 dark:text-white lg:font-bold">
            Empowering Team Collaboration and Project Management
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Introducing our Next.js-powered application, designed to reshape how
            you approach team collaboration, project management, and task
            coordination. Much like industry leader Linear, our platform is
            built to seamlessly integrate team management, project oversight,
            and task tracking all in one place.
          </p>
        </div>
        <div className="mt-16 grid gap-8 divide-gray-100 text-gray-600 dark:divide-gray-700 dark:border-gray-700 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          {features.map(({ title, description }) => (
            <div
              key={title}
              className="group relative rounded-lg border bg-white shadow-2xl shadow-gray-600/10 transition hover:z-[1] hover:shadow-brand-600/20 dark:bg-gray-800/10 dark:shadow-gray-900/10"
            >
              <div className="relative space-y-8 p-8 py-12">
                <div className="space-y-2">
                  <h5 className="text-xl font-semibold text-gray-700 transition group-hover:text-brand-600 dark:text-white">
                    {title}
                  </h5>
                  <p className="text-gray-600 dark:text-gray-300">
                    {description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
