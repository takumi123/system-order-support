"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { 
  DotsHorizontalIcon, 
  Pencil1Icon, 
  TrashIcon 
} from "@radix-ui/react-icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { getProjects, deleteProject } from "./_actions/project"
import { toast } from "sonner"

type Project = {
  id: string
  name: string
  description: string | null
  status: string
  createdAt: Date
  updatedAt: Date
}

const getStatusBadgeVariant = (status: string) => {
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

const getStatusLabel = (status: string) => {
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

export function ProjectTable() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      const result = await getProjects()
      if (result.projects) {
        setProjects(result.projects)
      } else if (result.error) {
        toast.error(result.error)
      }
      setLoading(false)
    }
    fetchProjects()
  }, [])

  const handleDelete = async (projectId: string) => {
    if (confirm("このプロジェクトを削除してもよろしいですか？")) {
      const result = await deleteProject(projectId)
      if (result.success) {
        toast.success("プロジェクトを削除しました")
        setProjects(projects.filter(p => p.id !== projectId))
      } else if (result.error) {
        toast.error(result.error)
      }
    }
  }

  if (loading) {
    return <div>読み込み中...</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>プロジェクト名</TableHead>
          <TableHead>ステータス</TableHead>
          <TableHead>作成日</TableHead>
          <TableHead>更新日</TableHead>
          <TableHead className="w-[100px]">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell className="font-medium">
              <Button
                variant="link"
                className="p-0 h-auto font-medium"
                onClick={() => router.push(`/dashboard/project/${project.id}`)}
              >
                {project.name}
              </Button>
            </TableCell>
            <TableCell>
              <Badge variant={getStatusBadgeVariant(project.status)}>
                {getStatusLabel(project.status)}
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(project.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              {new Date(project.updatedAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <DotsHorizontalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => router.push(`/dashboard/project/${project.id}`)}
                  >
                    <Pencil1Icon className="mr-2 h-4 w-4" />
                    編集
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600"
                    onClick={() => handleDelete(project.id)}
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    削除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
