"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";

interface WireframeDialogProps {
  projectId: string;
  categoryId: string;
  onSuccess: () => void;
}

export function WireframeDialog({ projectId, categoryId, onSuccess }: WireframeDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatedSvg, setGeneratedSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateSvg = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}/wireframes/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message: prompt,
          categoryId 
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "SVGの生成に失敗しました");
      }

      const data = await response.json();
      setGeneratedSvg(data.svgData);
    } catch (error) {
      console.error("Error generating SVG:", error);
      setError(error instanceof Error ? error.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!generatedSvg) return;

    try {
      setError(null);
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}/wireframes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          svgData: generatedSvg,
          categoryId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "ワイヤーフレームの作成に失敗しました");
      }

      setOpen(false);
      setName("");
      setPrompt("");
      setGeneratedSvg(null);
      setError(null);
      onSuccess();
    } catch (error) {
      console.error("Error creating wireframe:", error);
      setError(error instanceof Error ? error.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const renderSvgPreview = (svgData: string) => {
    try {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgData, "image/svg+xml");
      const svgElement = svgDoc.documentElement;
      
      svgElement.setAttribute("width", "100%");
      svgElement.setAttribute("height", "100%");
      svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");
      
      return svgElement.outerHTML;
    } catch (error) {
      console.error("Error parsing SVG:", error);
      return svgData;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          新規ワイヤーフレーム
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新規ワイヤーフレームの作成</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">名前</label>
            <Input
              placeholder="ワイヤーフレーム名を入力"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">指示内容</label>
            <Textarea
              placeholder="例: ログインフォームを含むランディングページ。ヘッダー、メインビジュアル、特徴セクション、お問い合わせフォームを配置。"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              required
              rows={4}
            />
          </div>
          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          {!generatedSvg && (
            <div className="flex justify-end">
              <Button 
                type="button" 
                onClick={generateSvg} 
                disabled={loading || !prompt}
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                SVG生成
              </Button>
            </div>
          )}
          {generatedSvg && (
            <>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div 
                  className="w-full aspect-[4/3] bg-white"
                  dangerouslySetInnerHTML={{ 
                    __html: renderSvgPreview(generatedSvg) 
                  }} 
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setGeneratedSvg(null)} 
                  disabled={loading}
                >
                  再生成
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading || !name}
                >
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  保存
                </Button>
              </div>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
