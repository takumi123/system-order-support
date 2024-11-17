import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/lib/prisma";

// カテゴリ一覧の取得
export async function GET(
  request: Request,
  context: { params: { projectId: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { params } = context;
    const projectId = await params.projectId;

    const categories = await prisma.wireframeCategory.findMany({
      where: {
        projectId: projectId,
      },
      include: {
        wireframes: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // 0件の場合は空配列を返す
    return NextResponse.json(categories || []);
  } catch (error) {
    console.error("[WIREFRAME_CATEGORIES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// カテゴリの作成
export async function POST(
  request: Request,
  context: { params: { projectId: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { params } = context;
    const projectId = await params.projectId;

    const body = await request.json();
    const { name, type } = body;

    if (!name || !type) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const category = await prisma.wireframeCategory.create({
      data: {
        name,
        type,
        projectId: projectId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[WIREFRAME_CATEGORIES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
