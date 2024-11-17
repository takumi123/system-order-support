"use server";

import { prisma } from "@/lib/prisma";

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
