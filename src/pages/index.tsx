import { type GetStaticProps } from "next";
// import Seo from "@/components/Seo";
import Hero from "@/components/@pages/landing-page/hero";
// import Stats from "@/components/@pages/landing-page/stats";
// import Testimonials from "@/components/@pages/landing-page/testimonials";
import CallToAction from "@/components/@pages/landing-page/call-to-action";
// import Blog from "@/components/@pages/landing-page/blog";
import Features from "@/components/@pages/landing-page/features";
import Header from "@/components/@pages/landing-page/header";
import Seo from "@/components/Seo";
import Footer from "@/components/@pages/landing-page/footer";



// eslint-disable-next-line @typescript-eslint/no-unused-vars
function AppExplanation() {
  return (
    <section className="bg-gray-100 px-8 py-16">
      <div className="container mx-auto">
        <h2 className="mb-8 text-4xl font-bold">How Momentum Works</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-2xl font-bold">Create Tasks</h3>
            <p className="mb-4 text-lg">
              Easily create tasks and assign them to team members. Specify due
              dates, priorities, and add detailed descriptions.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-2xl font-bold">Collaborate and Discuss</h3>
            <p className="mb-4 text-lg">
              Seamlessly collaborate with your team members. Leave comments,
              attach files, and have meaningful discussions on tasks and
              projects.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-2xl font-bold">Track Progress</h3>
            <p className="mb-4 text-lg">
              Monitor the progress of your tasks and projects in real-time. Get
              a clear overview of pending tasks, upcoming deadlines, and
              completed work.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-2xl font-bold">
              Plan and Organize Projects
            </h3>
            <p className="mb-4 text-lg">
              Effortlessly plan and organize your projects. Set project
              milestones, assign tasks, and visualize project progress with
              ease.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// function Footer() {
//   return (
//     <footer className="px-8 py-4 text-gray-500">
//       <p className="text-center text-sm">
//         Copyright © {new Date().getFullYear()} Momentum. All rights reserved.
//       </p>
//       {/* Copyright © {new Date().getFullYear()} invix. All rights reserved. */}
//     </footer>
//   );
// }

export default function LandingPage() {
  return (
    <>
      <Seo title="Momentum" />
      <Header />
      <main className="mb-40 space-y-40">
        <Hero />
        {/* <Features /> */}
        {/* <Stats /> */}
        {/* <Testimonials /> */}
        {/* <CallToAction /> */}
        {/* <Footer /> */}
      </main>
      <footer className="border-t px-8 py-4">
        <p className="text-center text-sm text-foreground-light md:text-base">
          Copyright © {new Date().getFullYear()} Momentum. All rights reserved.
        </p>
      </footer>
    </>
  );
}

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {},
  };
};
