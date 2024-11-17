import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { type RFP, type RFPSection } from ".prisma/client";

type RFPWithSections = RFP & {
  sections: RFPSection[];
};

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const rfps = await prisma.rFP.findMany({
      where: {
        projectId: params.projectId,
      },
      include: {
        sections: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    }) as RFPWithSections[];

    return NextResponse.json({ rfps });
  } catch (error) {
    console.error("Error fetching RFPs:", error);
    return NextResponse.json(
      { error: "Failed to fetch RFPs" },
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
    const { title, content, sections } = body;

    const rfp = await prisma.rFP.create({
      data: {
        title,
        content,
        status: "DRAFT",
        projectId: params.projectId,
        sections: {
          create: sections.map((section: { title: string; content: string }, index: number) => ({
            title: section.title,
            content: section.content,
            order: index,
          })),
        },
      },
      include: {
        sections: true,
      },
    });

    return NextResponse.json(rfp);
  } catch (error) {
    console.error("Error creating RFP:", error);
    return NextResponse.json(
      { error: "Failed to create RFP" },
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
    const { id, title, content, status, sections } = body;

    // 既存のセクションを削除
    await prisma.rFPSection.deleteMany({
      where: {
        rfpId: id,
      },
    });

    // RFPとセクションを更新
    const rfp = await prisma.rFP.update({
      where: {
        id,
      },
      data: {
        title,
        content,
        status,
        sections: {
          create: sections.map((section: { title: string; content: string }, index: number) => ({
            title: section.title,
            content: section.content,
            order: index,
          })),
        },
      },
      include: {
        sections: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return NextResponse.json(rfp);
  } catch (error) {
    console.error("Error updating RFP:", error);
    return NextResponse.json(
      { error: "Failed to update RFP" },
      { status: 500 }
    );
  }
}
