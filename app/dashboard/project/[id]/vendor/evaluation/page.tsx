"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { use } from "react";

interface Vendor {
  id: string;
  name: string;
  description: string;
  status: string;
  technicalScore: number;
  costScore: number;
  experienceScore: number;
  supportScore: number;
  totalScore: number;
}

type PageProps = {
  params: Promise<{
    id: string;
  }>;
}

export default function EvaluationPage({ params }: PageProps) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const projectId = use(params).id;

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/vendors`);
        const data = await response.json();
        setVendors(data.vendors || []);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [projectId]);

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">提案書評価</h1>
      </div>

      <div className="grid gap-4">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">評価スコア</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>開発会社</TableHead>
                <TableHead>技術力</TableHead>
                <TableHead>コスト</TableHead>
                <TableHead>実績</TableHead>
                <TableHead>サポート</TableHead>
                <TableHead>総合評価</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    読み込み中...
                  </TableCell>
                </TableRow>
              ) : vendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    評価データがありません
                  </TableCell>
                </TableRow>
              ) : (
                vendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell>{vendor.name}</TableCell>
                    <TableCell>{vendor.technicalScore}</TableCell>
                    <TableCell>{vendor.costScore}</TableCell>
                    <TableCell>{vendor.experienceScore}</TableCell>
                    <TableCell>{vendor.supportScore}</TableCell>
                    <TableCell className="font-semibold">{vendor.totalScore}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">評価基準</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">技術力 (30%)</h3>
              <p>提案された技術スタック、アーキテクチャ、開発手法の適切性</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">コスト (25%)</h3>
              <p>提案価格の妥当性、コスト効率</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">実績 (25%)</h3>
              <p>類似プロジェクトの実績、チーム体制</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">サポート (20%)</h3>
              <p>保守運用体制、サポート品質</p>
            </div>
          </div>
        </Card>

        {vendors.length > 0 && (
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">詳細評価コメント</h2>
            <div className="space-y-4">
              {vendors.map((vendor) => (
                <div key={vendor.id} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-semibold mb-2">{vendor.name}</h3>
                  <p className="text-gray-600">{vendor.description}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
