"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { Breadcrumb } from "@/app/dashboard/project/[id]/_components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, ExternalLink } from "lucide-react";

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

export default function ScreensPage({ params }: PageProps) {
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
          { label: "画面一覧", href: `/dashboard/project/${projectId}/requirements/screens` },
        ]}
      />
      <div className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">画面一覧</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新規カテゴリ
          </Button>
        </div>

        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">{category.name}</h2>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {category.wireframes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.wireframes.map((wireframe) => (
                      <div key={wireframe.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{wireframe.name}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/dashboard/project/${projectId}/wireframes?screen=${wireframe.id}`, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
                          <div
                            className="absolute inset-0"
                            dangerouslySetInnerHTML={{ __html: wireframe.svgData }}
                          />
                        </div>
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
