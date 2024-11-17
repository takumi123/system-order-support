import { VertexAI, HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai';

const vertex_ai = new VertexAI({
  project: 'system-order-support',
  location: 'asia-northeast1'
});

const model = 'gemini-1.5-pro-002';

const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 0.1,
    topP: 0.8,
  },
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    }
  ],
});

type AnalysisResult = {
  documentId: string;
  analysis: string;
  error?: string;
};

export async function analyzeBatchDocuments(documents: { id: string; text: string }[]): Promise<AnalysisResult[]> {
  const results: AnalysisResult[] = [];

  for (const doc of documents) {
    try {
      const analysis = await analyzeDocument(doc.text);
      results.push({
        documentId: doc.id,
        analysis
      });
    } catch (error) {
      console.error(`ドキュメント分析エラー (ID: ${doc.id}):`, error);
      results.push({
        documentId: doc.id,
        analysis: '',
        error: 'ドキュメントの分析に失敗しました'
      });
    }
  }

  return results;
}

export async function analyzeDocument(text: string): Promise<string> {
  try {
    // メディアファイルの場合はスキップ
    if (text.startsWith('[IMAGE FILE]') || 
        text.startsWith('[VIDEO FILE]') || 
        text.startsWith('[AUDIO FILE]')) {
      return `メディアファイルのため、テキスト分析はスキップされました。\nファイル情報: ${text}`;
    }

    const req = {
      contents: [
        {
          role: 'user',
          parts: [{
            text: `以下のドキュメントを分析し、要件をカテゴリ分けして整理してください。

分析の観点：
1. 機能要件と非機能要件の分類
2. 優先度（高・中・低）
3. 実装の複雑さ（高・中・低）
4. 依存関係のある要件
5. リスク要因

出力形式：
# 機能要件
## 優先度：高
- [要件名]
  - 説明：[要件の詳細説明]
  - 複雑さ：[高/中/低]
  - 依存要件：[関連する要件ID]
  - リスク：[想定されるリスク]

## 優先度：中
[同様の形式]

## 優先度：低
[同様の形式]

# 非機能要件
[同様の形式]

# 追加の考慮事項
- [プロジェクト全体に関わる重要な注意点]
- [技術的な制約や課題]
- [その他の懸念事項]

分析対象のドキュメント：
${text}`
          }]
        }
      ],
    };

    const streamingResp = await generativeModel.generateContentStream(req);
    let fullResponse = '';

    for await (const item of streamingResp.stream) {
      if (item.candidates && item.candidates[0].content.parts[0].text) {
        fullResponse += item.candidates[0].content.parts[0].text;
      }
    }

    return fullResponse;
  } catch (error) {
    console.error("Vertex AI error:", error);
    throw new Error("ドキュメントの分析に失敗しました");
  }
}
