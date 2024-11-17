"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CategoryDialog } from "./category-dialog";
import { WireframeDialog } from "./wireframe-dialog";
import { ChatInterface } from "./chat-interface";

interface WireframeCategory {
  id: string;
  name: string;
  type: string;
  wireframes: Wireframe[];
}

interface Wireframe {
  id: string;
  name: string;
  svgData: string;
}

export function WireframeViewer({ projectId }: { projectId: string }) {
  const [categories, setCategories] = useState<WireframeCategory[]>([]);
  const [selectedWireframe, setSelectedWireframe] = useState<Wireframe | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"viewer" | "chat">("viewer");

  const fetchCategories = async () => {
    try {
      setError(null);
      const response = await fetch(`/api/projects/${projectId}/wireframes/categories`);
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "カテゴリの取得に失敗しました");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError(error instanceof Error ? error.message : "エラーが発生しました");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [projectId]);

  const screenCategories = categories.filter(cat => cat.type === "SCREEN");
  const commonCategories = categories.filter(cat => cat.type === "COMMON");

  const renderSVG = (svgData: string) => {
    try {
      // SVGのサイズを親要素に合わせて調整
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgData, "image/svg+xml");
      const svgElement = svgDoc.documentElement;
      
      svgElement.setAttribute("width", "100%");
      svgElement.setAttribute("height", "100%");
      svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");
      
      return svgElement.outerHTML;
    } catch (error) {
      console.error("Error parsing SVG:", error);
      return svgData; // フォールバック：元のSVGデータを返す
    }
  };

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <CategoryDialog projectId={projectId} onSuccess={fetchCategories} />
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "viewer" | "chat")}>
          <TabsList>
            <TabsTrigger value="viewer">ビューワー</TabsTrigger>
            <TabsTrigger value="chat">チャット生成</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {activeTab === "viewer" ? (
        <div className="flex-1 flex min-h-0">
          <div className="w-1/3 border-r overflow-y-auto">
            <Tabs defaultValue="screens" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="screens" className="flex-1">画面一覧</TabsTrigger>
                <TabsTrigger value="common" className="flex-1">共通部品</TabsTrigger>
              </TabsList>
              
              <TabsContent value="screens">
                <Accordion type="single" collapsible className="w-full">
                  {screenCategories.map((category) => (
                    <AccordionItem key={category.id} value={category.id}>
                      <AccordionTrigger onClick={() => setSelectedCategoryId(category.id)}>
                        {category.name}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 p-2">
                          {selectedCategoryId === category.id && (
                            <WireframeDialog
                              projectId={projectId}
                              categoryId={category.id}
                              onSuccess={fetchCategories}
                            />
                          )}
                          {category.wireframes.map((wireframe) => (
                            <button
                              key={wireframe.id}
                              className={`w-full text-left px-4 py-2 rounded hover:bg-gray-100 ${
                                selectedWireframe?.id === wireframe.id ? "bg-gray-100" : ""
                              }`}
                              onClick={() => setSelectedWireframe(wireframe)}
                            >
                              {wireframe.name}
                            </button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
              
              <TabsContent value="common">
                <Accordion type="single" collapsible className="w-full">
                  {commonCategories.map((category) => (
                    <AccordionItem key={category.id} value={category.id}>
                      <AccordionTrigger onClick={() => setSelectedCategoryId(category.id)}>
                        {category.name}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 p-2">
                          {selectedCategoryId === category.id && (
                            <WireframeDialog
                              projectId={projectId}
                              categoryId={category.id}
                              onSuccess={fetchCategories}
                            />
                          )}
                          {category.wireframes.map((wireframe) => (
                            <button
                              key={wireframe.id}
                              className={`w-full text-left px-4 py-2 rounded hover:bg-gray-100 ${
                                selectedWireframe?.id === wireframe.id ? "bg-gray-100" : ""
                              }`}
                              onClick={() => setSelectedWireframe(wireframe)}
                            >
                              {wireframe.name}
                            </button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex-1 p-4 overflow-auto bg-gray-50">
            {selectedWireframe ? (
              <div 
                className="w-full h-full flex items-center justify-center bg-white rounded-lg shadow-sm"
                dangerouslySetInnerHTML={{ 
                  __html: renderSVG(selectedWireframe.svgData)
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                ワイヤーフレームを選択してください
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <ChatInterface 
            projectId={projectId}
            selectedWireframe={selectedWireframe}
            onWireframeGenerated={fetchCategories}
          />
        </div>
      )}
    </div>
  );
}
