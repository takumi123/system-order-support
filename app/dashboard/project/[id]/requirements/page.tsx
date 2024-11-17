import { Metadata } from "next";
import RequirementsContent from "../requirements/_components/requirements-content";
import { Breadcrumb } from "../_components/breadcrumb";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "要件定義 | System Order Support",
  description: "プロジェクトの要件定義を管理します",
};

interface RequirementsPageProps {
  params: {
    id: string;
  };
}

export default async function RequirementsPage({
  params,
}: RequirementsPageProps) {
  const { id } = await Promise.resolve(params);

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Breadcrumb projectName={project.name} />
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">要件定義</h2>
      </div>
      <RequirementsContent projectId={id} />
    </div>
  );
}
