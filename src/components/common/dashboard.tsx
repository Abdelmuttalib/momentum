import { type TypographyProps } from "@/components/ui/typography";
import {
  PageDescription,
  PageHeader,
  type PageHeaderProps,
  PageSubTitle,
  PageTitle,
} from "@/components/page-components";

export function DashboardPageTitle({ ...props }: TypographyProps) {
  return <PageTitle {...props} />;
}

export function DashboardPageSubTitle({ ...props }: TypographyProps) {
  return <PageSubTitle {...props} />;
}

export function DashboardPageDescription({ ...props }: TypographyProps) {
  return <PageDescription as="p" {...props} />;
}

export function DashboardPageHeader({ ...props }: PageHeaderProps) {
  return <PageHeader {...props} />;
}
