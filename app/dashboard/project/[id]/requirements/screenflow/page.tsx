"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { Breadcrumb } from "@/app/dashboard/project/[id]/_components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight } from "lucide-react";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
}

interface Wireframe {
  id: string;
  name: string;
  svgData: string;
}

interface ScreenCategory {
  id: string;
  name: string;
  type: string;
  wireframes: Wireframe[];
}

export default function ScreenflowPage({ params }: PageProps) {
  const [categories, setCategories] = useState<ScreenCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const projectId = use(params).id;

  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/screens`);
        if (!response.ok) {
          throw new Error("Failed to fetch screens");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching screens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScreens();
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
          { label: "画面フロー", href: `/dashboard/project/${projectId}/requirements/screenflow` },
        ]}
      />
      <div className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">画面フロー</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新規フロー
          </Button>
        </div>

        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">{category.name}</h2>
                {category.wireframes.length > 0 ? (
                  <div className="space-y-6">
                    {category.wireframes.map((wireframe, index) => (
                      <div key={wireframe.id}>
                        <div className="flex items-center">
                          <div className="flex-1 border rounded-lg p-4">
                            <h3 className="font-medium mb-2">{wireframe.name}</h3>
                            <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
                              <div
                                className="absolute inset-0"
                                dangerouslySetInnerHTML={{ __html: wireframe.svgData }}
                              />
                            </div>
                          </div>
                          {index < category.wireframes.length - 1 && (
                            <div className="flex-shrink-0 px-4">
                              <ArrowRight className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        {index < category.wireframes.length - 1 && (
                          <div className="ml-4 mt-2 text-sm text-gray-600">
                            <ul className="list-disc list-inside">
                              <li>ボタンクリック</li>
                              <li>フォーム送信</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    画面が登録されていません
                  </p>
                )}
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-500 text-center">
                カテゴリが登録されていません
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
