import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: スケジュール一覧の取得
export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const schedules = await prisma.projectSchedule.findMany({
      where: {
        projectId: params.projectId,
      },
      orderBy: {
        startDate: "asc",
      },
    });

    return NextResponse.json(schedules);
  } catch (error) {
    console.error("[SCHEDULES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST: 新規スケジュールの作成
export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const body = await req.json();
    const { name, startDate, endDate, phase, status } = body;

    if (!name || !startDate || !endDate || !phase || !status) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const schedule = await prisma.projectSchedule.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        phase,
        status,
        projectId: params.projectId,
      },
    });

    return NextResponse.json(schedule);
  } catch (error) {
    console.error("[SCHEDULES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// PUT: スケジュールの更新
export async function PUT(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const body = await req.json();
    const { id, name, startDate, endDate, phase, status } = body;

    if (!id || !name || !startDate || !endDate || !phase || !status) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const schedule = await prisma.projectSchedule.update({
      where: {
        id,
        projectId: params.projectId,
      },
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        phase,
        status,
      },
    });

    return NextResponse.json(schedule);
  } catch (error) {
    console.error("[SCHEDULES_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE: スケジュールの削除
export async function DELETE(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const scheduleId = searchParams.get("scheduleId");

    if (!scheduleId) {
      return new NextResponse("Schedule ID is required", { status: 400 });
    }

    await prisma.projectSchedule.delete({
      where: {
        id: scheduleId,
        projectId: params.projectId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[SCHEDULES_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
