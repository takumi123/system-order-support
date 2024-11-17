import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: ユースケース一覧の取得（アクター情報も含む）
export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const actors = await prisma.projectActor.findMany({
      where: {
        projectId: params.projectId,
      },
      include: {
        usecases: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(actors);
  } catch (error) {
    console.error("[USECASES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST: 新規アクターの作成
export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const body = await req.json();
    const { name, description } = body;

    if (!name || !description) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const actor = await prisma.projectActor.create({
      data: {
        name,
        description,
        projectId: params.projectId,
      },
    });

    return NextResponse.json(actor);
  } catch (error) {
    console.error("[ACTOR_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// PUT: アクターの更新
export async function PUT(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const body = await req.json();
    const { id, name, description } = body;

    if (!id || !name || !description) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const actor = await prisma.projectActor.update({
      where: {
        id,
        projectId: params.projectId,
      },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(actor);
  } catch (error) {
    console.error("[ACTOR_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE: アクターの削除
export async function DELETE(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const actorId = searchParams.get("actorId");

    if (!actorId) {
      return new NextResponse("Actor ID is required", { status: 400 });
    }

    await prisma.projectActor.delete({
      where: {
        id: actorId,
        projectId: params.projectId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ACTOR_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
