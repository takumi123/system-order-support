import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: 特定のアクターのユースケース一覧を取得
export async function GET(
  req: Request,
  { params }: { params: { projectId: string; actorId: string } }
) {
  try {
    const usecases = await prisma.projectUsecase.findMany({
      where: {
        projectId: params.projectId,
        actorId: params.actorId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(usecases);
  } catch (error) {
    console.error("[USECASES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST: 新規ユースケースの作成
export async function POST(
  req: Request,
  { params }: { params: { projectId: string; actorId: string } }
) {
  try {
    const body = await req.json();
    const { name, description, precondition, postcondition, mainFlow, alternativeFlow } = body;

    if (!name || !description || !mainFlow) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const usecase = await prisma.projectUsecase.create({
      data: {
        name,
        description,
        precondition,
        postcondition,
        mainFlow,
        alternativeFlow,
        projectId: params.projectId,
        actorId: params.actorId,
      },
    });

    return NextResponse.json(usecase);
  } catch (error) {
    console.error("[USECASE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// PUT: ユースケースの更新
export async function PUT(
  req: Request,
  { params }: { params: { projectId: string; actorId: string } }
) {
  try {
    const body = await req.json();
    const { id, name, description, precondition, postcondition, mainFlow, alternativeFlow } = body;

    if (!id || !name || !description || !mainFlow) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const usecase = await prisma.projectUsecase.update({
      where: {
        id,
        projectId: params.projectId,
        actorId: params.actorId,
      },
      data: {
        name,
        description,
        precondition,
        postcondition,
        mainFlow,
        alternativeFlow,
      },
    });

    return NextResponse.json(usecase);
  } catch (error) {
    console.error("[USECASE_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE: ユースケースの削除
export async function DELETE(
  req: Request,
  { params }: { params: { projectId: string; actorId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const usecaseId = searchParams.get("usecaseId");

    if (!usecaseId) {
      return new NextResponse("Usecase ID is required", { status: 400 });
    }

    await prisma.projectUsecase.delete({
      where: {
        id: usecaseId,
        projectId: params.projectId,
        actorId: params.actorId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[USECASE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
