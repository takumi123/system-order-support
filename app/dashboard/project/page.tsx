import { Button } from "@/components/ui/button"
import { PlusIcon } from "@radix-ui/react-icons"
import { ProjectTable } from "@/app/dashboard/project/project-table"
import Link from "next/link"

export default function ProjectPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">プロジェクト一覧</h1>
        <Link href="/dashboard/project/new">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            新規プロジェクト
          </Button>
        </Link>
      </div>
      <ProjectTable />
    </div>
  )
}
