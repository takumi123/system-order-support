"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { Breadcrumb } from "@/app/dashboard/project/[id]/_components/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Plus, Edit2, Trash2 } from "lucide-react";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
}

interface ProjectSchedule {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  phase: string;
  status: string;
}

// フェーズの日本語表示
const phaseLabels: { [key: string]: string } = {
  REQUIREMENTS: "要件定義",
  DESIGN: "設計",
  DEVELOPMENT: "開発",
  TESTING: "テスト",
};

// ステータスの日本語表示
const statusLabels: { [key: string]: string } = {
  NOT_STARTED: "未着手",
  IN_PROGRESS: "進行中",
  COMPLETED: "完了",
  ON_HOLD: "保留",
};

// ステータスに応じたバッジの色を定義
const statusColors: { [key: string]: string } = {
  NOT_STARTED: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  ON_HOLD: "bg-yellow-100 text-yellow-800",
};

export default function SchedulePage({ params }: PageProps) {
  const [schedules, setSchedules] = useState<ProjectSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const projectId = use(params).id;

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/schedules`);
        if (!response.ok) {
          throw new Error("Failed to fetch schedules");
        }
        const data = await response.json();
        setSchedules(data);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [projectId]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "yyyy/MM/dd", { locale: ja });
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
          { label: "スケジュール", href: `/dashboard/project/${projectId}/planning/schedule` },
        ]}
      />
      <div className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">プロジェクトスケジュール</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新規スケジュール
          </Button>
        </div>

        <div className="space-y-6">
          {Object.entries(phaseLabels).map(([phase, phaseLabel]) => {
            const phaseSchedules = schedules.filter(schedule => schedule.phase === phase);
            
            return (
              <div key={phase} className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">{phaseLabel}</h2>
                <div className="space-y-4">
                  {phaseSchedules.map((schedule) => (
                    <div key={schedule.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{schedule.name}</h3>
                          <p className="text-sm text-gray-600">
                            {formatDate(schedule.startDate)} - {formatDate(schedule.endDate)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={statusColors[schedule.status]}>
                            {statusLabels[schedule.status]}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {phaseSchedules.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      スケジュールが登録されていません
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
