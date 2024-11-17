"use server";

import { prisma } from "@/lib/prisma";

// カテゴリ関連の操作
export async function getCategories(projectId: string) {
  return await prisma.requirementCategory.findMany({
    where: { projectId },
    include: {
      subCategories: {
        include: {
          tags: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function createCategory(projectId: string, name: string) {
  return await prisma.requirementCategory.create({
    data: {
      name,
      projectId,
    },
  });
}

export async function updateCategory(id: string, name: string) {
  return await prisma.requirementCategory.update({
    where: { id },
    data: { name },
  });
}

export async function deleteCategory(id: string) {
  return await prisma.requirementCategory.delete({
    where: { id },
  });
}

// サブカテゴリ関連の操作
export async function createSubCategory(categoryId: string, name: string) {
  return await prisma.requirementSubCategory.create({
    data: {
      name,
      categoryId,
    },
    include: {
      tags: true,
    },
  });
}

export async function updateSubCategory(
  id: string,
  data: { name?: string; content?: string }
) {
  return await prisma.requirementSubCategory.update({
    where: { id },
    data,
    include: {
      tags: true,
    },
  });
}

export async function deleteSubCategory(id: string) {
  return await prisma.requirementSubCategory.delete({
    where: { id },
  });
}

// タグ関連の操作
export async function createTag(subCategoryId: string, name: string) {
  return await prisma.requirementTag.create({
    data: {
      name,
      subCategoryId,
    },
  });
}

export async function deleteTag(id: string) {
  return await prisma.requirementTag.delete({
    where: { id },
  });
}

// ドキュメント関連の操作
export async function getDocuments(projectId: string) {
  return await prisma.requirementDocument.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createDocument(
  projectId: string,
  data: {
    name: string;
    url: string;
    blobUrl: string;
    analysis?: string;
  }
) {
  return await prisma.requirementDocument.create({
    data: {
      ...data,
      projectId,
    },
  });
}

export async function updateDocumentAnalysis(id: string, analysis: string) {
  return await prisma.requirementDocument.update({
    where: { id },
    data: { analysis },
  });
}

export async function deleteDocument(id: string) {
  return await prisma.requirementDocument.delete({
    where: { id },
  });
}
