"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wand2 } from "lucide-react";

interface RequirementsGeneratorProps {
  projectId: string;
}

export default function RequirementsGenerator({ projectId }: RequirementsGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [rawResponse, setRawResponse] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState({
    context: "",
    persona: "",
    product: "",
    count: 5,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerateRequirements = async () => {
    if (!formData.context || !formData.persona || !formData.product) {
      alert("すべての項目を入力してください");
      return;
    }

    try {
      setIsGenerating(true);
      setError("");
      setRawResponse("");

      const response = await fetch(`/api/projects/${projectId}/requirements/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || "要件の生成に失敗しました");
      }

      setRawResponse(data.raw_response);
    } catch (error) {
      console.error("要件の生成に失敗しました:", error);
      setError(error instanceof Error ? error.message : "要件の生成に失敗しました");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">要件生成</h3>
          <p className="text-muted-foreground">
            AIを使用して、プロジェクトの要件を自動生成します
          </p>
        </div>

        <div className="w-full max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              コンテキスト
            </label>
            <input
              type="text"
              name="context"
              value={formData.context}
              onChange={handleInputChange}
              placeholder="例: オンラインショッピングサイト"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ペルソナ
            </label>
            <textarea
              name="persona"
              value={formData.persona}
              onChange={handleInputChange}
              placeholder="例: 30代の主婦で、スマートフォンでよく買い物をする"
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              プロダクト
            </label>
            <input
              type="text"
              name="product"
              value={formData.product}
              onChange={handleInputChange}
              placeholder="例: ECサイト"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              生成する要件数
            </label>
            <input
              type="number"
              name="count"
              value={formData.count}
              onChange={handleInputChange}
              min={1}
              max={10}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <Button
            variant="default"
            onClick={handleGenerateRequirements}
            disabled={isGenerating}
            className="w-full"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            {isGenerating ? "生成中..." : "要件を生成"}
          </Button>
        </div>

        {error && (
          <div className="w-full mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
            <h4 className="font-semibold mb-2">エラー：</h4>
            <p>{error}</p>
          </div>
        )}

        {rawResponse && (
          <div className="w-full mt-4">
            <h4 className="font-semibold mb-2">OpenAIレスポンス：</h4>
            <pre className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
              {rawResponse}
            </pre>
          </div>
        )}
      </div>
    </Card>
  );
}
