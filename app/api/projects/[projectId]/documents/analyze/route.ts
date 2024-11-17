import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import { analyzeBatchDocuments } from "../../../../../../lib/gemini";
import { extractTextFromFile } from "../../../../../../lib/documentUtils";

type RequirementDocument = {
  id: string;
  name: string;
  url: string;
  analysis?: string | null;
};

type DocumentWithText = {
  id: string;
  text: string;
};

export async function POST(req: NextRequest) {
  try {
    const { documentId, documentIds } = await req.json();

    // 単一のドキュメントIDまたは配列を処理
    const targetDocumentIds = documentIds || (documentId ? [documentId] : []);

    if (targetDocumentIds.length === 0) {
      return NextResponse.json(
        { error: "ドキュメントIDが必要です" },
        { status: 400 }
      );
    }

    // ドキュメントの情報を取得
    const documents = await prisma.requirementDocument.findMany({
      where: {
        id: {
          in: targetDocumentIds
        }
      },
    });

    if (documents.length === 0) {
      return NextResponse.json(
        { error: "指定されたドキュメントが見つかりません" },
        { status: 404 }
      );
    }

    // 各ドキュメントのテキストを抽出
    const documentTexts = await Promise.all(
      documents.map(async (doc: RequirementDocument) => {
        try {
          const response = await fetch(doc.url);
          const buffer = Buffer.from(await response.arrayBuffer());
          const { text } = await extractTextFromFile(buffer, doc.name);
          
          return {
            id: doc.id,
            text
          };
        } catch (error) {
          console.error(`テキスト抽出エラー (${doc.id}):`, error);
          return {
            id: doc.id,
            text: ''
          };
        }
      })
    );

    // 有効なテキストを持つドキュメントのみを分析
    const validDocuments = documentTexts.filter((doc: DocumentWithText) => doc.text.length > 0);
    
    if (validDocuments.length === 0) {
      return NextResponse.json(
        { error: "テキスト抽出可能なドキュメントがありません" },
        { status: 400 }
      );
    }

    // Vertex AIを使用してドキュメントを分析
    const analysisResults = await analyzeBatchDocuments(validDocuments);

    // 分析結果を保存
    await Promise.all(
      analysisResults.map(async (result) => {
        if (!result.error) {
          await prisma.requirementDocument.update({
            where: { id: result.documentId },
            data: { analysis: result.analysis },
          });
        }
      })
    );

    return NextResponse.json({
      success: true,
      results: analysisResults
    });
  } catch (error) {
    console.error("ドキュメント分析エラー:", error);
    return NextResponse.json(
      { error: "ドキュメントの分析に失敗しました" },
      { status: 500 }
    );
  }
}
