import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: 画面一覧の取得
export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    // 既存のWireframeモデルを使用して画面一覧を取得
    const screens = await prisma.wireframeCategory.findMany({
      where: {
        projectId: params.projectId,
        type: "SCREEN", // 画面タイプのみを取得
      },
      include: {
        wireframes: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(screens);
  } catch (error) {
    console.error("[SCREENS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST: 新規画面カテゴリの作成
export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const category = await prisma.wireframeCategory.create({
      data: {
        name,
        type: "SCREEN",
        projectId: params.projectId,
      },
      include: {
        wireframes: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[SCREENS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// PUT: 画面カテゴリの更新
export async function PUT(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const body = await req.json();
    const { id, name } = body;

    if (!id || !name) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const category = await prisma.wireframeCategory.update({
      where: {
        id,
        projectId: params.projectId,
        type: "SCREEN",
      },
      data: {
        name,
      },
      include: {
        wireframes: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[SCREENS_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE: 画面カテゴリの削除
export async function DELETE(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    if (!categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
    }

    await prisma.wireframeCategory.delete({
      where: {
        id: categoryId,
        projectId: params.projectId,
        type: "SCREEN",
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[SCREENS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
