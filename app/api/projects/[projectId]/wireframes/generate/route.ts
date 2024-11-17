import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI();

export async function POST(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { message, categoryId } = body;
    const projectId = await params.projectId;

    if (!message) {
      return NextResponse.json(
        { error: "メッセージを入力してください" },
        { status: 400 }
      );
    }

    // カテゴリIDが指定されていない場合は、SCREENタイプのデフォルトカテゴリを作成または取得
    let targetCategoryId = categoryId;
    if (!targetCategoryId) {
      const defaultCategory = await prisma.wireframeCategory.findFirst({
        where: {
          projectId: projectId,
          type: "SCREEN",
          name: "生成された画面",
        },
      });

      if (defaultCategory) {
        targetCategoryId = defaultCategory.id;
      } else {
        const newCategory = await prisma.wireframeCategory.create({
          data: {
            name: "生成された画面",
            type: "SCREEN",
            projectId: projectId,
          },
        });
        targetCategoryId = newCategory.id;
      }
    }

    const systemPrompt = `あなたはワイヤーフレームのSVGを生成するエキスパートです。
以下の条件でSVGを生成してください：

技術仕様:
- viewBox="0 0 800 600"を使用
- stroke="#666666" fill="none"をベースとした統一的なスタイル
- stroke-width="2"で一貫性のある線の太さ
- font-family="Arial, sans-serif"でフォントの統一

デザイン要素:
- モダンでクリーンなワイヤーフレームスタイル
- 適切な余白とスペーシング（margin, padding）
- 視覚的階層を意識したレイアウト
- グリッドシステムを活用した整列

UIコンポーネント:
- ボタン: <rect>と<text>の組み合わせ、角丸処理
- 入力フィールド: placeholder表示
- アイコン: シンプルなパスで表現
- テキスト: 見出しと本文で異なるサイズを使用

アクセシビリティ:
- aria-label属性の適切な使用
- role属性の追加
- フォーカス可能な要素の明確な表示
- 十分なコントラスト比の確保

コード品質:
- 整理された要素のグループ化（<g>タグの活用）
- 要素の目的を説明するコメント
- 再利用可能なコンポーネントの定義
- 命名規則の一貫性

以下の要件に基づいてワイヤーフレームを生成してください：`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.5,
      max_tokens: 4000,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const svgData = completion.choices[0].message.content;

    if (!svgData) {
      return NextResponse.json(
        { error: "SVGの生成に失敗しました" },
        { status: 500 }
      );
    }

    // SVGタグの内容のみを抽出（複数行対応）
    const svgMatch = svgData.match(/<svg[^>]*>[\s\S]*<\/svg>/i);
    if (!svgMatch) {
      return NextResponse.json(
        { error: "生成されたSVGが無効です" },
        { status: 500 }
      );
    }

    // 生成されたSVGをデータベースに保存
    const wireframe = await prisma.wireframe.create({
      data: {
        name: `生成された画面 ${new Date().toLocaleString("ja-JP")}`,
        svgData: svgMatch[0],
        categoryId: targetCategoryId,
      },
    });

    return NextResponse.json({ 
      svgData: svgMatch[0],
      wireframe
    });
  } catch (error) {
    console.error("[WIREFRAME_GENERATE]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
