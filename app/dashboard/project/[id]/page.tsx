import { notFound } from "next/navigation"
import { getProject } from "../_actions/project"
import { Suspense } from "react"

interface PageProps {
  params: {
    id: string
  }
}

async function ProjectDetail({ id }: { id: string }) {
  const { project, error } = await getProject(id)

  if (error || !project) {
    notFound()
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <p className="text-gray-500 mt-2">{project.description}</p>
      </div>

      <div className="grid gap-4">
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-2">ステータス</h2>
          <p>{project.status === "ACTIVE" ? "進行中" : 
              project.status === "ARCHIVED" ? "アーカイブ" : 
              project.status === "COMPLETED" ? "完了" : 
              project.status}</p>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-2">作成日時</h2>
          <p>{new Date(project.createdAt).toLocaleString()}</p>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-2">更新日時</h2>
          <p>{new Date(project.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}

export default async function ProjectDetailPage({
  params,
}: PageProps) {
  return (
    <Suspense fallback={<div className="p-6">読み込み中...</div>}>
      <ProjectDetail id={params.id} />
    </Suspense>
  )
}
