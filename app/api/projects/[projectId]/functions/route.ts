import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: 機能一覧の取得
export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const functions = await prisma.projectFunction.findMany({
      where: {
        projectId: params.projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(functions);
  } catch (error) {
    console.error("[FUNCTIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST: 新規機能の作成
export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const body = await req.json();
    const { category, name, description, priority, status } = body;

    if (!category || !name || !description || !priority || !status) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const function_ = await prisma.projectFunction.create({
      data: {
        category,
        name,
        description,
        priority,
        status,
        projectId: params.projectId,
      },
    });

    return NextResponse.json(function_);
  } catch (error) {
    console.error("[FUNCTIONS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
