import Link from "next/link";

interface BreadcrumbProps {
  projectName: string;
}

export function Breadcrumb({ projectName }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Link
        href="/dashboard/project"
        className="hover:text-foreground transition-colors"
      >
        プロジェクト
      </Link>
      <span>/</span>
      <span className="text-foreground">{projectName}</span>
    </div>
  );
}
