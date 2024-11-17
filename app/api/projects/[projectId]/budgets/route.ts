import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface ProjectBudget {
  id: string;
  phase: string;
  amount: number;
  used: number;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

// GET: 予算一覧の取得
export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const budgets = await prisma.projectBudget.findMany({
      where: {
        projectId: params.projectId,
      },
      orderBy: {
        phase: "asc",
      },
    });

    // 総予算と使用済み予算を計算
    const totalBudget = budgets.reduce((sum: number, budget: ProjectBudget) => sum + budget.amount, 0);
    const totalUsed = budgets.reduce((sum: number, budget: ProjectBudget) => sum + budget.used, 0);

    return NextResponse.json({
      budgets,
      summary: {
        total: totalBudget,
        used: totalUsed,
        remaining: totalBudget - totalUsed,
      },
    });
  } catch (error) {
    console.error("[BUDGETS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST: 新規予算の作成
export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const body = await req.json();
    const { phase, amount } = body;

    if (!phase || amount === undefined) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // 同じフェーズの予算が既に存在するかチェック
    const existingBudget = await prisma.projectBudget.findFirst({
      where: {
        projectId: params.projectId,
        phase,
      },
    });

    if (existingBudget) {
      return new NextResponse("Budget for this phase already exists", { status: 400 });
    }

    const budget = await prisma.projectBudget.create({
      data: {
        phase,
        amount,
        projectId: params.projectId,
      },
    });

    return NextResponse.json(budget);
  } catch (error) {
    console.error("[BUDGETS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// PUT: 予算の更新
export async function PUT(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const body = await req.json();
    const { id, amount, used } = body;

    if (!id || (amount === undefined && used === undefined)) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const updateData: { amount?: number; used?: number } = {};
    if (amount !== undefined) updateData.amount = amount;
    if (used !== undefined) updateData.used = used;

    const budget = await prisma.projectBudget.update({
      where: {
        id,
        projectId: params.projectId,
      },
      data: updateData,
    });

    return NextResponse.json(budget);
  } catch (error) {
    console.error("[BUDGETS_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE: 予算の削除
export async function DELETE(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const budgetId = searchParams.get("budgetId");

    if (!budgetId) {
      return new NextResponse("Budget ID is required", { status: 400 });
    }

    await prisma.projectBudget.delete({
      where: {
        id: budgetId,
        projectId: params.projectId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[BUDGETS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
