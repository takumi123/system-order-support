"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { use } from "react";

interface UATStep {
  id: string;
  order: number;
  action: string;
  expected: string;
  actual?: string;
  status: string;
}

interface UATScenario {
  id: string;
  title: string;
  description: string;
  status: string;
  steps: UATStep[];
}

type PageProps = {
  params: Promise<{
    id: string;
  }>;
}

export default function UATPage({ params }: PageProps) {
  const [scenarios, setScenarios] = useState<UATScenario[]>([]);
  const [loading, setLoading] = useState(true);
  const projectId = use(params).id;

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/uat`);
        const data = await response.json();
        setScenarios(data.scenarios || []);
      } catch (error) {
        console.error("Error fetching UAT scenarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScenarios();
  }, [projectId]);

  const getStatusText = (status: string) => {
    switch (status) {
      case "NOT_STARTED":
        return "未開始";
      case "IN_PROGRESS":
        return "実行中";
      case "PASSED":
        return "合格";
      case "FAILED":
        return "不合格";
      case "NOT_TESTED":
        return "未テスト";
      case "BLOCKED":
        return "ブロック";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NOT_STARTED":
      case "NOT_TESTED":
        return "bg-gray-100 text-gray-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "PASSED":
        return "bg-green-100 text-green-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "BLOCKED":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ユーザー受け入れテスト（UAT）</h1>
        <Button>新規シナリオ作成</Button>
      </div>

      {loading ? (
        <div className="text-center py-4">読み込み中...</div>
      ) : scenarios.length === 0 ? (
        <Card className="p-6 text-center">
          <p>UATシナリオがありません</p>
          <p className="text-gray-500 mt-2">新規シナリオ作成ボタンからシナリオを作成してください</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {scenarios.map((scenario) => (
            <Card key={scenario.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{scenario.title}</h2>
                  <span className={`inline-block px-2 py-1 rounded-full text-sm mt-2 ${getStatusColor(scenario.status)}`}>
                    {getStatusText(scenario.status)}
                  </span>
                </div>
                <div className="space-x-2">
                  <Button variant="outline">編集</Button>
                  {scenario.status === "NOT_STARTED" && <Button>テスト開始</Button>}
                </div>
              </div>

              <p className="text-gray-600 mb-4">{scenario.description}</p>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">テストステップ</h3>
                <div className="space-y-4">
                  {scenario.steps.map((step) => (
                    <div key={step.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">ステップ {step.order + 1}</span>
                        <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(step.status)}`}>
                          {getStatusText(step.status)}
                        </span>
                      </div>
                      <div className="grid gap-2">
                        <div>
                          <div className="font-medium">操作</div>
                          <p className="text-gray-600">{step.action}</p>
                        </div>
                        <div>
                          <div className="font-medium">期待結果</div>
                          <p className="text-gray-600">{step.expected}</p>
                        </div>
                        {step.actual && (
                          <div>
                            <div className="font-medium">実際の結果</div>
                            <p className="text-gray-600">{step.actual}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
