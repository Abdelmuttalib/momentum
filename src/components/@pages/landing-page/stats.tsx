import Container from "./container";

export default function Stats() {
  return (
    <div id="solution" className="pt-6">
      <Container>
        <div className="flex-row-reverse justify-between space-y-6 text-gray-600 md:flex md:gap-6 md:space-y-0 lg:items-center lg:gap-12">
          <div className="lg:w-1/2">
            <img
              src="/images/team-office-long.png"
              alt="image"
              loading="lazy"
              width=""
              height=""
              className="w-full rounded-lg"
            />
          </div>
          <div className="md:7/12 lg:w-1/2">
            <h2 className="h1 bg-gradient-to-br from-gray-800 to-brand-700 bg-clip-text font-bold text-transparent dark:from-brand-700 dark:via-brand-600 dark:to-brand-400 dark:text-white lg:font-bold">
              Elevating Your Team&apos;s Potential
            </h2>
            <p className="my-8 text-gray-600 dark:text-gray-300">
              Step into a new era of team management with our innovative
              Next.js-powered app. <br /> <br /> Designed to empower your
              workflow, Momentum seamlessly blends intuitive design with
              powerful features, revolutionizing the way you collaborate and
              manage tasks.
            </p>
            {/* <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-800">
              <div className="mt-8 flex gap-4 md:items-center">
                <div className="flex h-12 w-12 gap-4 rounded-full bg-indigo-100 dark:bg-indigo-900/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="m-auto h-6 w-6 text-indigo-500 dark:text-indigo-400"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div className="w-5/6">
                  <h4 className="text-lg font-semibold text-gray-700 dark:text-indigo-300">
                    Chat Anytime
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    Asperiores nemo possimus nesciunt quam mollitia.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 pt-4 md:items-center">
                <div className="flex h-12 w-12 gap-4 rounded-full bg-teal-100 dark:bg-teal-900/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="m-auto h-6 w-6 text-teal-600 dark:text-teal-400"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div className="w-5/6">
                  <h4 className="text-lg font-semibold text-gray-700 dark:text-teal-300">
                    Real Time Location
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    Asperiores nemo possimus nesciunt quam mollitia.
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </Container>
    </div>
  );
}
