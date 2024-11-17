import { getProject } from "../_actions/project"
import { ProjectDetail } from "./project-detail"
import { notFound } from "next/navigation"

type PageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params
  const { project } = await getProject(resolvedParams.id)
  
  return {
    title: project ? `${project.name} | プロジェクト詳細` : "プロジェクト詳細",
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const resolvedParams = await params
  const { project, error } = await getProject(resolvedParams.id)

  if (error) {
    throw new Error(error)
  }

  if (!project) {
    notFound()
  }

  return <ProjectDetail project={project} />
}
