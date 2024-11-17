"use client";

import { use } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
}

export default function DevelopmentPage({ params }: PageProps) {
  const projectId = use(params).id;

  // 仮のデータ
  const sprints = [
    {
      id: 1,
      name: "Sprint 1",
      status: "完了",
      progress: 100,
      startDate: "2024-01-01",
      endDate: "2024-01-14",
      tasks: [
        { name: "要件定義書レビュー", status: "完了" },
        { name: "DB設計", status: "完了" },
        { name: "API設計", status: "完了" },
      ],
    },
    {
      id: 2,
      name: "Sprint 2",
      status: "進行中",
      progress: 60,
      startDate: "2024-01-15",
      endDate: "2024-01-28",
      tasks: [
        { name: "ユーザー認証機能実装", status: "完了" },
        { name: "プロジェクト管理機能実装", status: "進行中" },
        { name: "単体テスト", status: "未着手" },
      ],
    },
    {
      id: 3,
      name: "Sprint 3",
      status: "未着手",
      progress: 0,
      startDate: "2024-01-29",
      endDate: "2024-02-11",
      tasks: [
        { name: "要件定義機能実装", status: "未着手" },
        { name: "ワイヤーフレーム機能実装", status: "未着手" },
        { name: "結合テスト", status: "未着手" },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "完了":
        return "bg-green-500";
      case "進行中":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">開発プロセス管理</h1>
      </div>

      <div className="grid gap-4">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">全体進捗状況</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>総合進捗</span>
                <span>53%</span>
              </div>
              <Progress value={53} className="h-2" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">スプリント管理</h2>
          <div className="space-y-6">
            {sprints.map((sprint) => (
              <div key={sprint.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-semibold">{sprint.name}</h3>
                    <p className="text-sm text-gray-500">
                      {sprint.startDate} 〜 {sprint.endDate}
                    </p>
                  </div>
                  <Badge className={getStatusColor(sprint.status)}>
                    {sprint.status}
                  </Badge>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span>進捗</span>
                    <span>{sprint.progress}%</span>
                  </div>
                  <Progress value={sprint.progress} className="h-2" />
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>タスク</TableHead>
                      <TableHead className="w-[100px]">ステータス</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sprint.tasks.map((task) => (
                      <TableRow key={task.name}>
                        <TableCell>{task.name}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">品質メトリクス</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">テストカバレッジ</h3>
              <p className="text-2xl">85%</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">バグ件数</h3>
              <p className="text-2xl">12件</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">技術的負債</h3>
              <p className="text-2xl">8項目</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
