/* eslint-disable @next/next/no-img-element */
import React from "react";
import Container from "./container";

// const testimonials = [
//   {
//     name: "Daniella Doe",
//     role: "Mobile dev",
//     avatarSrc: "/images/avatars/avatar.webp",
//     content:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum...",
//   },
//   {
//     name: "Jane doe",
//     role: "Marketing",
//     avatarSrc: "/images/avatars/avatar-1.webp",
//     content:
//       "Lorem ipsum dolor laboriosam deleniti aperiam ab veniam sint non...",
//   },
//   {
//     name: "Yanick Doe",
//     role: "Developer",
//     avatarSrc: "/images/avatars/avatar-2.webp",
//     content:
//       "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Architecto...",
//   },
//   {
//     name: "Jane Doe",
//     role: "Mobile dev",
//     avatarSrc: "/images/avatars/avatar-3.webp",
//     content:
//       "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Architecto...",
//   },
//   {
//     name: "Andy Doe",
//     role: "Manager",
//     avatarSrc: "/images/avatars/avatar-4.webp",
//     content:
//       "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Architecto...",
//   },
//   {
//     name: "Yanndy Doe",
//     role: "Mobile dev",
//     avatarSrc: "/images/avatars/avatar-2.webp",
//     content:
//       "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Architecto...",
//   },
// ];

export default function Testimonials() {
  return (
    <div className="text-muted-foreground dark:text-gray-300" id="testimonials">
      <Container>
        <div className="mb-20 space-y-4 px-6 md:px-0">
          <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white md:text-4xl">
            We have some fans.
          </h2>
        </div>
        <div className="gap-8 space-y-8 md:columns-2 lg:columns-3">
          {/* {testimonials.map(({ name, content, role, avatarSrc }) => (
            <div
              key={name + role}
              className="aspect-auto rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none"
            >
              <div className="flex gap-4">
                <img
                  className="h-12 w-12 rounded-full"
                  src={avatarSrc}
                  alt="user avatar"
                  width="400"
                  height="400"
                  loading="lazy"
                />
                <div>
                  <h6 className="text-lg font-medium text-gray-700 dark:text-white">
                    {name}
                  </h6>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {role}
                  </p>
                </div>
              </div>
              <p className="mt-8">{content}</p>
            </div>
          ))} */}
          <div className="aspect-auto rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none">
            <div className="flex gap-4">
              <img
                className="h-12 w-12 rounded-full"
                src="./images/avatars/avatar.webp"
                alt="user avatar"
                width="400"
                height="400"
                loading="lazy"
              />
              <div>
                <h6 className="text-lg font-medium text-gray-700 dark:text-white">
                  Daniella Doe
                </h6>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Mobile dev
                </p>
              </div>
            </div>
            <p className="mt-8">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
              aliquid quo eum quae quos illo earum ipsa doloribus nostrum minus
              libero aspernatur laborum cum, a suscipit, ratione ea totam ullam!
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Architecto laboriosam deleniti aperiam ab veniam sint non cumque
              quis tempore cupiditate. Sint libero voluptas veniam at
              reprehenderit, veritatis harum et rerum.
            </p>
          </div>
          <div className="aspect-auto rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none">
            <div className="flex gap-4">
              <img
                className="h-12 w-12 rounded-full"
                src="./images/avatars/avatar-1.webp"
                alt="user avatar"
                width="200"
                height="200"
                loading="lazy"
              />
              <div>
                <h6 className="text-lg font-medium text-gray-700 dark:text-white">
                  Jane doe
                </h6>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Marketing
                </p>
              </div>
            </div>
            <p className="mt-8">
              {" "}
              Lorem ipsum dolor laboriosam deleniti aperiam ab veniam sint non
              cumque quis tempore cupiditate. Sint libero voluptas veniam at
              reprehenderit, veritatis harum et rerum.
            </p>
          </div>
          <div className="aspect-auto rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none">
            <div className="flex gap-4">
              <img
                className="h-12 w-12 rounded-full"
                src="./images/avatars/avatar-2.webp"
                alt="user avatar"
                width="200"
                height="200"
                loading="lazy"
              />
              <div>
                <h6 className="text-lg font-medium text-gray-700 dark:text-white">
                  Yanick Doe
                </h6>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Developer
                </p>
              </div>
            </div>
            <p className="mt-8">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Architecto laboriosam deleniti aperiam ab veniam sint non cumque
              quis tempore cupiditate. Sint libero voluptas veniam at
              reprehenderit, veritatis harum et rerum.
            </p>
          </div>
          <div className="aspect-auto rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none">
            <div className="flex gap-4">
              <img
                className="h-12 w-12 rounded-full"
                src="./images/avatars/avatar-3.webp"
                alt="user avatar"
                width="200"
                height="200"
                loading="lazy"
              />
              <div>
                <h6 className="text-lg font-medium text-gray-700 dark:text-white">
                  Jane Doe
                </h6>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Mobile dev
                </p>
              </div>
            </div>
            <p className="mt-8">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Architecto laboriosam deleniti aperiam ab veniam sint non cumque
              quis tempore cupiditate. Sint libero voluptas veniam at
              reprehenderit, veritatis harum et rerum.
            </p>
          </div>
          <div className="aspect-auto rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none">
            <div className="flex gap-4">
              <img
                className="h-12 w-12 rounded-full"
                src="./images/avatars/avatar-4.webp"
                alt="user avatar"
                width="200"
                height="200"
                loading="lazy"
              />
              <div>
                <h6 className="text-lg font-medium text-gray-700 dark:text-white">
                  Andy Doe
                </h6>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Manager
                </p>
              </div>
            </div>
            <p className="mt-8">
              {" "}
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Architecto laboriosam deleniti aperiam ab veniam sint non cumque
              quis tempore cupiditate. Sint libero voluptas veniam at
              reprehenderit, veritatis harum et rerum.
            </p>
          </div>
          <div className="aspect-auto rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none">
            <div className="flex gap-4">
              <img
                className="h-12 w-12 rounded-full"
                src="./images/avatars/avatar-2.webp"
                alt="user avatar"
                width="400"
                height="400"
                loading="lazy"
              />
              <div>
                <h6 className="text-lg font-medium text-gray-700 dark:text-white">
                  Yanndy Doe
                </h6>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Mobile dev
                </p>
              </div>
            </div>
            <p className="mt-8">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Architecto laboriosam deleniti aperiam ab veniam sint non cumque
              quis tempore cupiditate. Sint libero voluptas veniam at
              reprehenderit, veritatis harum et rerum.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
