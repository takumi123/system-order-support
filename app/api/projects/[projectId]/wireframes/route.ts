import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/lib/prisma";

// ワイヤーフレーム一覧の取得
export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("認証が必要です", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const projectId = await params.projectId;

    // プロジェクトの存在確認
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return new NextResponse("プロジェクトが見つかりません", { status: 404 });
    }

    const wireframes = await prisma.wireframe.findMany({
      where: {
        category: {
          projectId: projectId,
          ...(categoryId && { id: categoryId }),
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(wireframes);
  } catch (error) {
    console.error("[WIREFRAMES_GET]", error);
    return new NextResponse("サーバーエラーが発生しました", { status: 500 });
  }
}

// ワイヤーフレームの作成
export async function POST(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("認証が必要です", { status: 401 });
    }

    const body = await request.json();
    const { name, svgData, categoryId } = body;
    const projectId = await params.projectId;

    // 入力値のバリデーション
    if (!name?.trim()) {
      return new NextResponse("名前は必須です", { status: 400 });
    }

    if (!svgData?.trim()) {
      return new NextResponse("SVGデータは必須です", { status: 400 });
    }

    if (!categoryId?.trim()) {
      return new NextResponse("カテゴリIDは必須です", { status: 400 });
    }

    // SVGデータの基本的な検証
    if (!svgData.match(/<svg[^>]*>[\s\S]*<\/svg>/i)) {
      return new NextResponse("無効なSVGデータです", { status: 400 });
    }

    // カテゴリが正しいプロジェクトに属しているか確認
    const category = await prisma.wireframeCategory.findFirst({
      where: {
        id: categoryId,
        projectId: projectId,
      },
    });

    if (!category) {
      return new NextResponse("カテゴリが見つかりません", { status: 404 });
    }

    try {
      // トランザクションを使用してデータの整合性を保証
      const wireframe = await prisma.$transaction(async (tx: typeof prisma) => {
        // 同じカテゴリ内での名前の重複チェック
        const existingWireframe = await tx.wireframe.findFirst({
          where: {
            name,
            categoryId,
          },
        });

        if (existingWireframe) {
          throw new Error("同じカテゴリ内に同名のワイヤーフレームが存在します");
        }

        const result = await tx.wireframe.create({
          data: {
            name,
            svgData,
            categoryId,
          },
          include: {
            category: true,
          },
        });

        if (!result) {
          throw new Error("ワイヤーフレームの作成に失敗しました");
        }

        return result;
      });

      return NextResponse.json(wireframe);
    } catch (txError) {
      if (txError instanceof Error) {
        return new NextResponse(txError.message, { status: 400 });
      }
      throw txError;
    }
  } catch (error) {
    console.error("[WIREFRAMES_POST]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "サーバーエラーが発生しました",
      { status: 500 }
    );
  }
}

// ワイヤーフレームの編集
export async function PATCH(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("認証が必要です", { status: 401 });
    }

    const body = await request.json();
    const { id, svgData } = body;
    const projectId = await params.projectId;

    if (!id?.trim()) {
      return new NextResponse("ワイヤーフレームIDは必須です", { status: 400 });
    }

    if (!svgData?.trim()) {
      return new NextResponse("SVGデータは必須です", { status: 400 });
    }

    // SVGデータの基本的な検証
    if (!svgData.match(/<svg[^>]*>[\s\S]*<\/svg>/i)) {
      return new NextResponse("無効なSVGデータです", { status: 400 });
    }

    // ワイヤーフレームが正しいプロジェクトに属しているか確認
    const existingWireframe = await prisma.wireframe.findFirst({
      where: {
        id,
        category: {
          projectId,
        },
      },
    });

    if (!existingWireframe) {
      return new NextResponse("ワイヤーフレームが見つかりません", { status: 404 });
    }

    // ワイヤーフレームの更新
    const updatedWireframe = await prisma.wireframe.update({
      where: {
        id,
      },
      data: {
        svgData,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(updatedWireframe);
  } catch (error) {
    console.error("[WIREFRAMES_PATCH]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "サーバーエラーが発生しました",
      { status: 500 }
    );
  }
}
