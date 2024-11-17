"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Trash2, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getDocuments } from "../_actions/requirements";
import RequirementsGenerator from "./requirements-generator";

type Document = {
  id: string;
  name: string;
  url: string;
  blobUrl: string;
  analysis: string | null;
  createdAt: string;
  projectId: string;
};

// APIから返されるドキュメントの型
interface APIDocument {
  id: string;
  name: string;
  url: string;
  blobUrl: string;
  analysis: string | null;
  createdAt: Date;
  projectId: string;
}

interface AnalysisResult {
  documentId: string;
  analysis: string;
  error?: string;
}

interface RequirementsContentProps {
  projectId: string;
}

export default function RequirementsContent({ projectId }: RequirementsContentProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const documentsData = await getDocuments(projectId);
      // Date型をstring型に変換
      const formattedDocuments = documentsData.map((doc: APIDocument) => ({
        ...doc,
        createdAt: doc.createdAt.toISOString()
      }));
      setDocuments(formattedDocuments);
    } catch (error) {
      console.error("データの読み込みに失敗しました:", error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/projects/${projectId}/documents`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("アップロードに失敗しました");
      }

      const newDocument = await response.json();
      setDocuments([
        {
          ...newDocument,
          createdAt: new Date(newDocument.createdAt).toISOString()
        },
        ...documents
      ]);
    } catch (error) {
      console.error("ドキュメントのアップロードに失敗しました:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm("本当にこのドキュメントを削除しますか？")) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(
        `/api/projects/${projectId}/documents?documentId=${documentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("削除に失敗しました");
      }

      setDocuments(documents.filter((doc) => doc.id !== documentId));
      setSelectedDocuments(prev => {
        const next = new Set(prev);
        next.delete(documentId);
        return next;
      });
    } catch (error) {
      console.error("ドキュメントの削除に失敗しました:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAnalyzeDocuments = async () => {
    if (selectedDocuments.size === 0) {
      alert("分析するドキュメントを選択してください");
      return;
    }

    try {
      setIsAnalyzing(true);
      const response = await fetch(`/api/projects/${projectId}/documents/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentIds: Array.from(selectedDocuments) }),
      });

      if (!response.ok) {
        throw new Error("分析に失敗しました");
      }

      const { results } = await response.json();
      
      // 分析結果を反映
      setDocuments(documents.map(doc => {
        const result = results.find((r: AnalysisResult) => r.documentId === doc.id);
        if (result && !result.error) {
          return { ...doc, analysis: result.analysis };
        }
        return doc;
      }));

      // 分析が完了したらチェックを外す
      setSelectedDocuments(new Set());
    } catch (error) {
      console.error("ドキュメントの分析に失敗しました:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleDocumentSelection = (documentId: string) => {
    setSelectedDocuments(prev => {
      const next = new Set(prev);
      if (next.has(documentId)) {
        next.delete(documentId);
      } else {
        next.add(documentId);
      }
      return next;
    });
  };

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  const acceptedFileTypes = [
    // テキストファイル
    ".txt", ".doc", ".docx", ".pdf", ".rtf", ".md",
    // 音声ファイル
    ".mp3", ".wav", ".m4a", ".aac",
    // 動画ファイル
    ".mp4", ".mov", ".avi", ".wmv",
    // 画像ファイル
    ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"
  ].join(",");

  return (
    <div className="space-y-4">
      <RequirementsGenerator projectId={projectId} />
      
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">ドキュメント分析</h3>
            <p className="text-muted-foreground">
              ドキュメントをアップロードして、AI分析を実行します
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              対応ファイル形式：
              <br />
              テキスト（.txt, .doc, .docx, .pdf, .rtf, .md）
              <br />
              音声（.mp3, .wav, .m4a, .aac）
              <br />
              動画（.mp4, .mov, .avi, .wmv）
              <br />
              画像（.jpg, .jpeg, .png, .gif, .bmp, .webp）
            </p>
          </div>
          
          <div className="flex items-center justify-center w-full space-x-4">
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept={acceptedFileTypes}
            />
            <Button 
              variant="outline" 
              disabled={isUploading}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "アップロード中..." : "ドキュメントをアップロード"}
            </Button>
            {selectedDocuments.size > 0 && (
              <Button
                variant="default"
                onClick={handleAnalyzeDocuments}
                disabled={isAnalyzing}
              >
                <Search className="mr-2 h-4 w-4" />
                {isAnalyzing ? "分析中..." : `選択したドキュメントを分析 (${selectedDocuments.size})`}
              </Button>
            )}
          </div>

          <div className="w-full mt-8">
            {documents.map((doc) => (
              <div key={doc.id} className="border-b py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDocuments.has(doc.id)}
                        onChange={() => toggleDocumentSelection(doc.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="font-medium">{doc.name}</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      ダウンロード
                    </a>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDocument(doc.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                {doc.analysis && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm">
                      {doc.analysis}
                    </pre>
                  </div>
                )}
                <div className="mt-2 text-xs text-gray-400">
                  {new Date(doc.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
