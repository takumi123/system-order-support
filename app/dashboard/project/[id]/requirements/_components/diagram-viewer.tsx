"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const WireframeSample = () => (
  <svg width="800" height="600" viewBox="0 0 800 600" className="border">
    {/* ヘッダー */}
    <rect x="0" y="0" width="800" height="60" fill="#f0f0f0" />
    <rect x="20" y="15" width="100" height="30" fill="#d0d0d0" />
    <rect x="680" y="15" width="100" height="30" fill="#d0d0d0" />
    
    {/* サイドバー */}
    <rect x="0" y="60" width="200" height="540" fill="#f5f5f5" />
    <rect x="20" y="80" width="160" height="40" fill="#e0e0e0" />
    <rect x="20" y="130" width="160" height="40" fill="#e0e0e0" />
    <rect x="20" y="180" width="160" height="40" fill="#e0e0e0" />
    
    {/* メインコンテンツ */}
    <rect x="220" y="80" width="560" height="200" fill="#e8e8e8" />
    <rect x="220" y="300" width="270" height="280" fill="#e8e8e8" />
    <rect x="510" y="300" width="270" height="280" fill="#e8e8e8" />
  </svg>
);

const FlowchartSample = () => (
  <svg width="800" height="600" viewBox="0 0 800 600" className="border">
    {/* スタート */}
    <rect x="350" y="50" width="100" height="50" rx="25" fill="#4CAF50" />
    <text x="400" y="80" textAnchor="middle" fill="white">開始</text>
    
    {/* 処理1 */}
    <rect x="350" y="150" width="100" height="50" fill="#2196F3" />
    <text x="400" y="180" textAnchor="middle" fill="white">要件収集</text>
    <line x1="400" y1="100" x2="400" y2="150" stroke="black" markerEnd="url(#arrowhead)" />
    
    {/* 処理2 */}
    <rect x="350" y="250" width="100" height="50" fill="#2196F3" />
    <text x="400" y="280" textAnchor="middle" fill="white">分析</text>
    <line x1="400" y1="200" x2="400" y2="250" stroke="black" markerEnd="url(#arrowhead)" />
    
    {/* 判断 */}
    <path d="M400 350 L450 400 L400 450 L350 400 Z" fill="#FFC107" />
    <text x="400" y="405" textAnchor="middle">承認?</text>
    <line x1="400" y1="300" x2="400" y2="350" stroke="black" markerEnd="url(#arrowhead)" />
    
    {/* 終了 */}
    <rect x="350" y="500" width="100" height="50" rx="25" fill="#f44336" />
    <text x="400" y="530" textAnchor="middle" fill="white">完了</text>
    <line x1="400" y1="450" x2="400" y2="500" stroke="black" markerEnd="url(#arrowhead)" />
    
    {/* 矢印の定義 */}
    <defs>
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="7"
        refX="9"
        refY="3.5"
        orient="auto"
      >
        <polygon points="0 0, 10 3.5, 0 7" fill="black" />
      </marker>
    </defs>
  </svg>
);

export const DiagramViewer = () => {
  const [activeTab, setActiveTab] = useState("wireframe");

  return (
    <div className="w-full p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="wireframe">ワイヤーフレーム</TabsTrigger>
          <TabsTrigger value="flowchart">フローチャート</TabsTrigger>
        </TabsList>
        <TabsContent value="wireframe" className="mt-4">
          <div className="border rounded-lg p-4 bg-white">
            <WireframeSample />
          </div>
        </TabsContent>
        <TabsContent value="flowchart" className="mt-4">
          <div className="border rounded-lg p-4 bg-white">
            <FlowchartSample />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
