import { AppLayout } from "@/components/layout/app-layout";
import { getServerAuthSession } from "@/server/auth";
import type { GetServerSideProps } from "next";
import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Users,
  FolderOpen,
  Plus,
} from "lucide-react";

const stats = [
  {
    title: "Active Issues",
    value: "24",
    change: "+12%",
    trend: "up",
    icon: AlertCircle,
  },
  {
    title: "Completed This Week",
    value: "18",
    change: "+8%",
    trend: "up",
    icon: CheckCircle2,
  },
  {
    title: "Active Projects",
    value: "6",
    change: "0%",
    trend: "neutral",
    icon: FolderOpen,
  },
  {
    title: "Team Members",
    value: "12",
    change: "+2",
    trend: "up",
    icon: Users,
  },
];

const recentIssues = [
  {
    id: "ISS-001",
    title: "Fix authentication bug in login flow",
    status: "In Progress",
    priority: "High",
    assignee: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    project: "Web App",
    updatedAt: "2 hours ago",
  },
  {
    id: "ISS-002",
    title: "Implement dark mode toggle",
    status: "Todo",
    priority: "Medium",
    assignee: {
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    project: "Design System",
    updatedAt: "4 hours ago",
  },
  {
    id: "ISS-003",
    title: "Optimize database queries for dashboard",
    status: "In Review",
    priority: "High",
    assignee: {
      name: "Mike Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    project: "Backend",
    updatedAt: "1 day ago",
  },
];

const projects = [
  {
    name: "Web Application",
    progress: 75,
    issues: { total: 24, completed: 18 },
    team: 5,
    dueDate: "Dec 15, 2024",
  },
  {
    name: "Mobile App",
    progress: 45,
    issues: { total: 16, completed: 7 },
    team: 3,
    dueDate: "Jan 30, 2025",
  },
  {
    name: "Design System",
    progress: 90,
    issues: { total: 12, completed: 11 },
    team: 2,
    dueDate: "Dec 1, 2024",
  },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "destructive";
    case "Medium":
      return "default";
    case "Low":
      return "secondary";
    default:
      return "default";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "In Progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "Todo":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    case "In Review":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Done":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here&apos;s what&apos;s happening with your
              projects.
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Issue
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="flex items-center text-xs text-muted-foreground">
                  {stat.trend === "up" && (
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  )}
                  <span
                    className={
                      stat.trend === "up"
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }
                  >
                    {stat.change}
                  </span>
                  {" from last week"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Issues */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Issues</CardTitle>
                  <CardDescription>
                    Latest updates on your team&apos;s work
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="flex items-center space-x-4 rounded-lg border p-3"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        {issue.id}
                      </span>
                      <Badge
                        variant={getPriorityColor(issue.priority)}
                        className="text-xs"
                      >
                        {issue.priority}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{issue.title}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{issue.project}</span>
                      <span>•</span>
                      <span>{issue.updatedAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={getStatusColor(issue.status)}
                      variant="secondary"
                    >
                      {issue.status}
                    </Badge>
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={issue.assignee.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback className="text-xs">
                        {issue.assignee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Project Progress */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Project Progress</CardTitle>
                  <CardDescription>
                    Track your team&apos;s project milestones
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {projects.map((project) => (
                <div key={project.name} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{project.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {project.issues.completed}/{project.issues.total} issues
                        completed
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{project.progress}%</p>
                      <p className="text-xs text-muted-foreground">
                        Due {project.dueDate}
                      </p>
                    </div>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Users className="mr-1 h-3 w-3" />
                      {project.team} members
                    </span>
                    <span className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {project.dueDate}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const userSession = await getServerAuthSession({ req, res });

  if (!userSession) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  const companyId = userSession.user.company.id;

  return {
    props: {
      companyId,
    },
  };
};
