"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface Wireframe {
  id: string;
  name: string;
  svgData: string;
}

export function ChatInterface({
  projectId,
  selectedWireframe,
  onWireframeGenerated,
}: {
  projectId: string;
  selectedWireframe: Wireframe | null;
  onWireframeGenerated: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);
      // ユーザーメッセージを追加
      const userMessage: ChatMessage = { role: "user", content: input };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      // 編集モードか生成モードかを判断
      const endpoint = selectedWireframe
        ? `/api/projects/${projectId}/wireframes`
        : `/api/projects/${projectId}/wireframes/generate`;

      const method = selectedWireframe ? "PATCH" : "POST";
      
      // 編集モードと生成モードで異なるリクエストボディを構築
      const body = selectedWireframe
        ? {
            id: selectedWireframe.id,
            message: input,
            svgData: selectedWireframe.svgData // 既存のSVGデータを送信
          }
        : { message: input };

      // APIにリクエストを送信
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || (selectedWireframe ? "編集に失敗しました" : "生成に失敗しました"));
      }

      // アシスタントの応答を追加
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: selectedWireframe 
          ? "ワイヤーフレームを更新しました。"
          : "ワイヤーフレームを生成しました。",
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // 親コンポーネントに通知
      onWireframeGenerated();
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: error instanceof Error ? error.message : "エラーが発生しました。もう一度お試しください。",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.role === "user"
                ? "bg-blue-100 ml-auto"
                : "bg-gray-100 mr-auto"
            } max-w-[80%]`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              selectedWireframe
                ? "ワイヤーフレームの編集内容を入力してください..."
                : "画面の説明を入力してください..."
            }
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="self-end"
          >
            {isLoading ? "処理中..." : selectedWireframe ? "更新" : "生成"}
          </Button>
        </div>
      </div>
    </div>
  );
}
