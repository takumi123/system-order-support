"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { Breadcrumb } from "@/app/dashboard/project/[id]/_components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Plus, Edit2 } from "lucide-react";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
}

interface ProjectBudget {
  id: string;
  phase: string;
  amount: number;
  used: number;
  projectId: string;
}

interface BudgetSummary {
  total: number;
  used: number;
  remaining: number;
}

// フェーズの日本語表示
const phaseLabels: { [key: string]: string } = {
  REQUIREMENTS: "要件定義",
  DESIGN: "設計",
  DEVELOPMENT: "開発",
  TESTING: "テスト",
};

export default function BudgetPage({ params }: PageProps) {
  const [budgets, setBudgets] = useState<ProjectBudget[]>([]);
  const [summary, setSummary] = useState<BudgetSummary>({
    total: 0,
    used: 0,
    remaining: 0,
  });
  const [loading, setLoading] = useState(true);
  const projectId = use(params).id;

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/budgets`);
        if (!response.ok) {
          throw new Error("Failed to fetch budgets");
        }
        const data = await response.json();
        setBudgets(data.budgets);
        setSummary(data.summary);
      } catch (error) {
        console.error("Error fetching budgets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, [projectId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    }).format(amount);
  };

  const calculateProgress = (used: number, total: number) => {
    return total > 0 ? (used / total) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="h-full p-6">
        <div className="flex items-center justify-center h-full">
          <p>読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6">
      <Breadcrumb
        items={[
          { label: "プロジェクト", href: "/dashboard/project" },
          { label: "プロジェクト詳細", href: `/dashboard/project/${projectId}` },
          { label: "予算", href: `/dashboard/project/${projectId}/planning/budget` },
        ]}
      />
      <div className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">プロジェクト予算</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新規予算
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm text-gray-600">総予算</h3>
            <p className="text-2xl font-bold">{formatCurrency(summary.total)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm text-gray-600">使用済み</h3>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(summary.used)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm text-gray-600">残予算</h3>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.remaining)}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">フェーズ別予算配分</h2>
            <div className="space-y-6">
              {budgets.map((budget) => (
                <div key={budget.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{phaseLabels[budget.phase]}</h3>
                      <p className="text-sm text-gray-600">予算: {formatCurrency(budget.amount)}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${calculateProgress(budget.used, budget.amount)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      使用済み: {formatCurrency(budget.used)} ({Math.round(calculateProgress(budget.used, budget.amount))}%)
                    </p>
                  </div>
                </div>
              ))}
              {budgets.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  予算が登録されていません
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
