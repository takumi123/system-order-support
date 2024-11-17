"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { use } from "react";

interface RFPSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface RFP {
  id: string;
  title: string;
  content: string;
  status: string;
  sections: RFPSection[];
}

type PageProps = {
  params: Promise<{
    id: string;
  }>;
}

export default function RFPPage({ params }: PageProps) {
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [loading, setLoading] = useState(true);
  const projectId = use(params).id;

  useEffect(() => {
    const fetchRFPs = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/rfps`);
        const data = await response.json();
        setRfps(data.rfps || []);
      } catch (error) {
        console.error("Error fetching RFPs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRFPs();
  }, [projectId]);

  const getStatusText = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "作成中";
      case "SENT":
        return "送信済み";
      case "RECEIVED_RESPONSE":
        return "回答受領";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "SENT":
        return "bg-blue-100 text-blue-800";
      case "RECEIVED_RESPONSE":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">提案依頼書（RFP）</h1>
        <Button>新規作成</Button>
      </div>

      {loading ? (
        <div className="text-center py-4">読み込み中...</div>
      ) : rfps.length === 0 ? (
        <Card className="p-6 text-center">
          <p>RFPがありません</p>
          <p className="text-gray-500 mt-2">新規作成ボタンからRFPを作成してください</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {rfps.map((rfp) => (
            <Card key={rfp.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{rfp.title}</h2>
                  <span className={`inline-block px-2 py-1 rounded-full text-sm mt-2 ${getStatusColor(rfp.status)}`}>
                    {getStatusText(rfp.status)}
                  </span>
                </div>
                <div className="space-x-2">
                  <Button variant="outline">編集</Button>
                  <Button variant="outline">プレビュー</Button>
                  {rfp.status === "DRAFT" && <Button>送信</Button>}
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-600 mb-4">{rfp.content}</p>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold">セクション</h3>
                {rfp.sections.map((section) => (
                  <div key={section.id} className="border-l-4 border-gray-200 pl-4">
                    <h4 className="font-semibold">{section.title}</h4>
                    <p className="text-gray-600 mt-1">{section.content}</p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
