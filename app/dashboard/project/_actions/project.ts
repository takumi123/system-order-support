"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Project } from "../types"

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany()
    return { projects }
  } catch (error) {
    return { error: `プロジェクトの取得に失敗しました: ${error instanceof Error ? error.message : String(error)}` }
  }
}

export async function getProject(id: string): Promise<{ project?: Project; error?: string }> {
  try {
    const project = await prisma.project.findUnique({
      where: { id }
    }) as Project | null

    return { project: project || undefined }
  } catch (error) {
    return { error: `プロジェクトの取得に失敗しました: ${error instanceof Error ? error.message : String(error)}` }
  }
}

export async function createProject(data: {
  name: string
  description?: string | null
  status: "ACTIVE" | "ARCHIVED" | "COMPLETED"
}) {
  try {
    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        status: data.status,
      }
    })
    revalidatePath("/dashboard/project")
    return { success: true, project }
  } catch (error) {
    return { error: `プロジェクトの作成に失敗しました: ${error instanceof Error ? error.message : String(error)}` }
  }
}

export async function updateProject(
  projectId: string,
  data: {
    name: string
    description?: string | null
    status: "ACTIVE" | "ARCHIVED" | "COMPLETED"
  }
) {
  try {
    await prisma.project.update({
      where: { id: projectId },
      data
    })
    revalidatePath("/dashboard/project")
    return { success: true }
  } catch (error) {
    return { error: `プロジェクトの更新に失敗しました: ${error instanceof Error ? error.message : String(error)}` }
  }
}

export async function deleteProject(projectId: string) {
  try {
    await prisma.project.delete({
      where: { id: projectId }
    })
    revalidatePath("/dashboard/project")
    return { success: true }
  } catch (error) {
    return { error: `プロジェクトの削除に失敗しました: ${error instanceof Error ? error.message : String(error)}` }
  }
}
