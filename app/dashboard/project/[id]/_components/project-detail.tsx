"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { ProjectEditDialog } from "@/app/dashboard/project/_components/project-edit-dialog"
import { ProjectDeleteDialog } from "@/app/dashboard/project/_components/project-delete-dialog"
import { Project } from "../../types"

interface ProjectDetailProps {
  project: Project
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const getStatusBadgeVariant = (status: Project["status"]) => {
    switch (status) {
      case "ACTIVE":
        return "default"
      case "ARCHIVED":
        return "secondary"
      case "COMPLETED":
        return "outline"
      default:
        return "default"
    }
  }

  const getStatusLabel = (status: Project["status"]) => {
    switch (status) {
      case "ACTIVE":
        return "進行中"
      case "ARCHIVED":
        return "アーカイブ"
      case "COMPLETED":
        return "完了"
      default:
        return status
    }
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
          <Badge variant={getStatusBadgeVariant(project.status)}>
            {getStatusLabel(project.status)}
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
          <p className="text-gray-600">{project.description || "説明なし"}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">作成日時</h2>
          <p className="text-gray-600">
            {new Date(project.createdAt).toLocaleString()}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">更新日時</h2>
          <p className="text-gray-600">
            {new Date(project.updatedAt).toLocaleString()}
          </p>
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
