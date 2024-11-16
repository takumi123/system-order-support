import { notFound } from "next/navigation"
import { getProject } from "../_actions/project"
import { Suspense } from "react"
import { ProjectDetail } from "./_components/project-detail"

interface PageProps {
  params: {
    id: string
  }
}

async function ProjectDetailWrapper({ id }: { id: string }) {
  const { project, error } = await getProject(id)

  if (error || !project) {
    notFound()
  }

  return <ProjectDetail project={project} />
}

export default function ProjectDetailPage({
  params,
}: PageProps) {
  return (
    <Suspense fallback={<div className="p-6">読み込み中...</div>}>
      <ProjectDetailWrapper id={params.id} />
    </Suspense>
  )
}
