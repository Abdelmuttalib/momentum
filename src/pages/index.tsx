import { type GetStaticProps } from "next";
import Header from "@/components/views/landing-page/header";
import { Seo } from "@/components/seo";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle2,
  Users,
  Zap,
  BarChart3,
  Github,
  Play,
} from "lucide-react";
import Link from "next/link";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/utils/cn";
import Container from "@/components/views/landing-page/container";
import { GradientBackground } from "@/components/gradient";
import BoardExample from "@/components/views/landing-page/board-example";
import { siteConfig } from "@/config/site-config";

const features = [
  {
    icon: Zap,
    title: "Fast & Intuitive",
    description: "Clean interface with real-time updates and instant search.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Organize teams, assign tasks, and track progress together.",
  },
  {
    icon: BarChart3,
    title: "Project Analytics",
    description: "Visualize team performance and project insights.",
  },
];

interface LandingPageSectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
}

function LandingPageSection({
  id,
  className,
  children,
}: LandingPageSectionProps) {
  return (
    <section id={id} className={cn("py-20 lg:py-24", className)}>
      {children}
    </section>
  );
}

export default function LandingPage() {
  return (
    <>
      <Seo title="Momentum" />
      <Header />
      <main className="mb-40 space-y-40">
        {/* Hero */}
        <div className="relative flex max-h-[80svh] min-h-[80svh] overflow-x-hidden overflow-y-hidden pb-24 pt-24">
          <Container className="relative isolate">
            <GradientBackground />
            <div className="relative grid grid-cols-1 gap-y-6 lg:grid-cols-2">
              <div className="relative lg:pr-32">
                <div className="mx-auto space-y-8">
                  <Typography as="h1" variant="5xl/semibold">
                    The open source issue tracking tool
                  </Typography>

                  <Typography
                    as="p"
                    variant="lg/normal"
                    className="text-foreground-light mx-auto w-full max-w-4xl"
                  >
                    A clean, fast issue tracker inspired by Linear. Manage
                    teams, projects, and tasks with an intuitive interface built
                    for modern development workflows.
                  </Typography>

                  <div className="flex flex-col flex-wrap gap-x-4 gap-y-2 sm:flex-row sm:gap-y-4">
                    <Button asChild>
                      <Link href={siteConfig.pages.main.links.signIn.href}>
                        Get Started
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="h-[45rem] overflow-hidden lg:absolute lg:-right-36">
                <BoardExample />
              </div>
            </div>
          </Container>
        </div>
        <LandingPageSection>
          <Container>
            <div className="flex flex-col gap-14">
              <div className="flex flex-col gap-4">
                <Typography as="h2" variant="4xl/semibold">
                  Built for Modern Teams
                </Typography>

                <Typography
                  variant="lg/normal"
                  className="max-w-2xl text-muted-foreground"
                >
                  Essential features for effective project management and team
                  collaboration.
                </Typography>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {features.map((feature, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg border bg-background">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="-mt-4">
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </Container>
        </LandingPageSection>

        {/* Screenshot Section */}
        {/* <LandingPageSection>
          <Container>
            <div className="flex h-full w-full flex-col gap-14">
              <div className="text-center">
                <h2 className="mb-4 text-3xl font-bold">
                  Clean, Intuitive Interface
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                  Designed with simplicity and productivity in mind.
                </p>
              </div>

              <div className="relative mx-auto w-full max-w-5xl">
                <div className="overflow-hidden rounded-xl border bg-background shadow-xl">
                  <div className="flex items-center space-x-2 border-b bg-muted/50 px-4 py-3">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <div className="ml-4 text-sm text-muted-foreground">
                      {siteConfig.appName} Dashboard
                    </div>
                  </div>
                  <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-background to-muted/50">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                        <BarChart3 className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-muted-foreground">Dashboard Preview</p>
                      <Link href="/">
                        <Button variant="outline" className="mt-4">
                          <Play className="mr-2 h-4 w-4" />
                          View Live Demo
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </LandingPageSection> */}

        {/* Tech Stack */}
        <LandingPageSection className="bg-muted/30 py-16">
          <Container>
            <div className="flex h-full w-full flex-col gap-8">
              <div className="space-y-4 text-center">
                <h2 className="text-3xl font-bold">Built with Modern Tech</h2>
                <p className="text-lg text-muted-foreground">
                  Next.js, TypeScript, Tailwind CSS, and shadcn/ui components.
                </p>
              </div>

              <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-4">
                {[
                  "Next.js",
                  "TypeScript",
                  "Tailwind CSS",
                  "shadcn/ui",
                  "React",
                  "Prisma",
                  "PostgreSQL",
                  "Vercel",
                ].map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="px-3 py-1 text-sm"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </Container>
        </LandingPageSection>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <Container className="py-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="flex items-center space-x-2 md:mb-0">
              <Typography as="span" variant="base/semibold">
                Momentum
              </Typography>
              <Typography variant="sm/normal" className="text-muted-foreground">
                Copyright © {new Date().getFullYear()}. All rights reserved.
              </Typography>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href={siteConfig.githubUrl} target="_blank">
                  <Github className="mr-2 h-4 w-4" />
                  Source Code
                </Link>
              </Button>
              {/* <Link href="/">
                <Button size="sm">Try Demo</Button>
              </Link> */}
            </div>
          </div>
        </Container>
      </footer>
    </>
  );
}

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {},
  };
};
