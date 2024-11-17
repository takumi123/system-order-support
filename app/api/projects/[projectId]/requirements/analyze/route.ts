import { NextResponse } from 'next/server';
import { analyzeBatchDocuments } from '@/lib/gemini';
import { readFileContent } from '@/lib/documentUtils';

export async function POST(
  request: Request,
) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'ファイルが見つかりません' },
        { status: 400 }
      );
    }

    // ファイルの内容を読み込む
    const fileContent = await readFileContent(file);

    // Geminiで分析
    const results = await analyzeBatchDocuments([
      { id: '1', text: fileContent }
    ]);

    if (results.length === 0 || results[0].error) {
      throw new Error(results[0]?.error || 'ファイルの分析に失敗しました');
    }

    return NextResponse.json({ content: results[0].analysis });

  } catch (error) {
    console.error('Error analyzing file:', error);
    return NextResponse.json(
      { error: 'ファイルの分析に失敗しました', details: (error as Error).message },
      { status: 500 }
    );
  }
}
