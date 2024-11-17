"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { Breadcrumb } from "@/app/dashboard/project/[id]/_components/breadcrumb";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
}

interface ProjectFunction {
  id: string;
  category: string;
  name: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// 優先度に応じたバッジの色を定義
const priorityColors: { [key: string]: string } = {
  HIGH: "bg-red-100 text-red-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  LOW: "bg-green-100 text-green-800",
};

// ステータスに応じたバッジの色を定義
const statusColors: { [key: string]: string } = {
  NOT_STARTED: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  ON_HOLD: "bg-yellow-100 text-yellow-800",
};

// 優先度の日本語表示
const priorityLabels: { [key: string]: string } = {
  HIGH: "高",
  MEDIUM: "中",
  LOW: "低",
};

// ステータスの日本語表示
const statusLabels: { [key: string]: string } = {
  NOT_STARTED: "未着手",
  IN_PROGRESS: "進行中",
  COMPLETED: "完了",
  ON_HOLD: "保留",
};

export default function FunctionsPage({ params }: PageProps) {
  const [functions, setFunctions] = useState<ProjectFunction[]>([]);
  const [loading, setLoading] = useState(true);
  const projectId = use(params).id;

  useEffect(() => {
    const fetchFunctions = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/functions`);
        if (!response.ok) {
          throw new Error("Failed to fetch functions");
        }
        const data = await response.json();
        setFunctions(data);
      } catch (error) {
        console.error("Error fetching functions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFunctions();
  }, [projectId]);

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
          { label: "機能一覧", href: `/dashboard/project/${projectId}/requirements/functions` },
        ]}
      />
      <div className="mt-6">
        <h1 className="text-2xl font-bold">機能一覧</h1>
        <div className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">カテゴリ</TableHead>
                  <TableHead className="w-[200px]">機能名</TableHead>
                  <TableHead className="min-w-[300px]">概要</TableHead>
                  <TableHead className="w-[100px]">優先度</TableHead>
                  <TableHead className="w-[100px]">ステータス</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {functions.map((func) => (
                  <TableRow key={func.id}>
                    <TableCell className="font-medium">{func.category}</TableCell>
                    <TableCell>{func.name}</TableCell>
                    <TableCell>{func.description}</TableCell>
                    <TableCell>
                      <Badge
                        className={priorityColors[func.priority]}
                      >
                        {priorityLabels[func.priority]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={statusColors[func.status]}
                      >
                        {statusLabels[func.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
