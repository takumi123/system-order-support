import { put, del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // URLからprojectIdを取得
    const { pathname } = req.nextUrl;
    const segments = pathname.split("/");
    const projectIdIndex = segments.findIndex((seg) => seg === "projects") + 1;

    if (projectIdIndex === 0 || projectIdIndex >= segments.length) {
      return NextResponse.json(
        { error: "プロジェクトIDが見つかりません" },
        { status: 400 }
      );
    }

    const projectId = segments[projectIdIndex];

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "ファイルが見つかりません" },
        { status: 400 }
      );
    }

    // Vercel Blobにアップロード
    const { url, downloadUrl } = await put(file.name, file, {
      access: "public",
    });

    // ドキュメントをデータベースに保存
    const document = await prisma.requirementDocument.create({
      data: {
        name: file.name,
        url: downloadUrl,
        blobUrl: url,
        projectId,
      },
    });

    // TODO: Vertex Gemini APIを使用してドキュメントを分析
    // const analysis = await analyzeDocument(url);
    // await prisma.requirementDocument.update({
    //   where: { id: document.id },
    //   data: { analysis },
    // });

    return NextResponse.json(document);
  } catch (error) {
    console.error("ドキュメントアップロードエラー:", error);
    return NextResponse.json(
      { error: "ドキュメントのアップロードに失敗しました" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // URLからprojectIdを取得
    const { pathname } = req.nextUrl;
    const segments = pathname.split("/");
    const projectIdIndex = segments.findIndex((seg) => seg === "projects") + 1;

    if (projectIdIndex === 0 || projectIdIndex >= segments.length) {
      return NextResponse.json(
        { error: "プロジェクトIDが見つかりません" },
        { status: 400 }
      );
    }

    const projectId = segments[projectIdIndex];

    const documents = await prisma.requirementDocument.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("ドキュメント取得エラー:", error);
    return NextResponse.json(
      { error: "ドキュメントの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const documentId = searchParams.get("documentId");

    if (!documentId) {
      return NextResponse.json(
        { error: "ドキュメントIDが必要です" },
        { status: 400 }
      );
    }

    // ドキュメントの情報を取得
    const document = await prisma.requirementDocument.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json(
        { error: "ドキュメントが見つかりません" },
        { status: 404 }
      );
    }

    // Vercel Blobからファイルを削除
    await del(document.blobUrl);

    // データベースからドキュメントを削除
    await prisma.requirementDocument.delete({
      where: { id: documentId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ドキュメント削除エラー:", error);
    return NextResponse.json(
      { error: "ドキュメントの削除に失敗しました" },
      { status: 500 }
    );
  }
}
