import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const scenarios = await prisma.uATScenario.findMany({
      where: {
        projectId: params.projectId,
      },
      include: {
        steps: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return NextResponse.json({ scenarios });
  } catch (error) {
    console.error("Error fetching UAT scenarios:", error);
    return NextResponse.json(
      { error: "Failed to fetch UAT scenarios" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const body = await request.json();
    const { title, description, steps } = body;

    const scenario = await prisma.uATScenario.create({
      data: {
        title,
        description,
        status: "NOT_STARTED",
        projectId: params.projectId,
        steps: {
          create: steps.map((step: { action: string; expected: string }, index: number) => ({
            order: index,
            action: step.action,
            expected: step.expected,
            status: "NOT_TESTED",
          })),
        },
      },
      include: {
        steps: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return NextResponse.json(scenario);
  } catch (error) {
    console.error("Error creating UAT scenario:", error);
    return NextResponse.json(
      { error: "Failed to create UAT scenario" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const body = await request.json();
    const { id, title, description, status, steps } = body;

    // 既存のステップを削除
    await prisma.uATStep.deleteMany({
      where: {
        scenarioId: id,
      },
    });

    // シナリオとステップを更新
    const scenario = await prisma.uATScenario.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        status,
        steps: {
          create: steps.map((step: { action: string; expected: string; actual?: string; status: string }, index: number) => ({
            order: index,
            action: step.action,
            expected: step.expected,
            actual: step.actual,
            status: step.status || "NOT_TESTED",
          })),
        },
      },
      include: {
        steps: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return NextResponse.json(scenario);
  } catch (error) {
    console.error("Error updating UAT scenario:", error);
    return NextResponse.json(
      { error: "Failed to update UAT scenario" },
      { status: 500 }
    );
  }
}
