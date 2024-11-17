"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { deleteProject } from "../_actions/project"
import { Project } from "../types"

interface ProjectDeleteDialogProps {
  project: Project
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectDeleteDialog({
  project,
  open,
  onOpenChange,
}: ProjectDeleteDialogProps) {
  async function onDelete() {
    const result = await deleteProject(project.id)
    if (result.success) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>プロジェクトの削除</DialogTitle>
          <DialogDescription>
            本当に「{project.name}」を削除しますか？この操作は取り消せません。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            削除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
