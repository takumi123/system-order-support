"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ProjectEditDialog } from "@/app/dashboard/project/_components/project-edit-dialog"
import { ProjectDeleteDialog } from "@/app/dashboard/project/_components/project-delete-dialog"

interface Project {
  id: number
  name: string
  status: string
  startDate: string
  endDate: string
  members: string[]
  description: string
}

interface ProjectDetailProps {
  project: Project
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const router = useRouter()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "進行中":
        return "default"
      case "計画中":
        return "secondary"
      case "完了":
        return "outline"
      default:
        return "default"
    }
  }

  return (
    <div className="p-6">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.push("/dashboard/project")}
      >
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        プロジェクト一覧に戻る
      </Button>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
          <Badge variant={getStatusBadgeVariant(project.status)}>
            {project.status}
          </Badge>
        </div>
        <div className="space-x-2">
          <Button onClick={() => setIsEditOpen(true)}>編集</Button>
          <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
            削除
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">プロジェクト概要</h2>
          <p className="text-gray-600">{project.description}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">期間</h2>
          <p className="text-gray-600">
            {project.startDate} 〜 {project.endDate}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">メンバー</h2>
          <p className="text-gray-600">{project.members.join("、")}</p>
        </div>
      </div>

      <ProjectEditDialog
        project={project}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
      
      <ProjectDeleteDialog
        project={project}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </div>
  )
}
