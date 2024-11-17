"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { Breadcrumb } from "@/app/dashboard/project/[id]/_components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
}

interface Usecase {
  id: string;
  name: string;
  description: string;
  precondition: string | null;
  postcondition: string | null;
  mainFlow: string;
  alternativeFlow: string | null;
}

interface Actor {
  id: string;
  name: string;
  description: string;
  usecases: Usecase[];
}

export default function UsecasesPage({ params }: PageProps) {
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);
  const projectId = use(params).id;

  useEffect(() => {
    const fetchUsecases = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/usecases`);
        if (!response.ok) {
          throw new Error("Failed to fetch usecases");
        }
        const data = await response.json();
        setActors(data);
      } catch (error) {
        console.error("Error fetching usecases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsecases();
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
          { label: "ユースケース", href: `/dashboard/project/${projectId}/requirements/usecases` },
        ]}
      />
      <div className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">ユースケース一覧</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新規アクター
          </Button>
        </div>

        <div className="space-y-6">
          {actors.map((actor) => (
            <div key={actor.id} className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">{actor.name}</h2>
                    <p className="text-sm text-gray-600 mt-1">{actor.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      ユースケース追加
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {actor.usecases.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {actor.usecases.map((usecase) => (
                      <AccordionItem key={usecase.id} value={usecase.id}>
                        <AccordionTrigger className="hover:bg-gray-50 px-4 py-2 rounded-lg">
                          <div className="flex items-center">
                            <span className="font-medium">{usecase.name}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-2">
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-sm font-medium text-gray-600">概要</h3>
                              <p className="mt-1">{usecase.description}</p>
                            </div>
                            {usecase.precondition && (
                              <div>
                                <h3 className="text-sm font-medium text-gray-600">事前条件</h3>
                                <p className="mt-1">{usecase.precondition}</p>
                              </div>
                            )}
                            {usecase.postcondition && (
                              <div>
                                <h3 className="text-sm font-medium text-gray-600">事後条件</h3>
                                <p className="mt-1">{usecase.postcondition}</p>
                              </div>
                            )}
                            <div>
                              <h3 className="text-sm font-medium text-gray-600">基本フロー</h3>
                              <p className="mt-1 whitespace-pre-line">{usecase.mainFlow}</p>
                            </div>
                            {usecase.alternativeFlow && (
                              <div>
                                <h3 className="text-sm font-medium text-gray-600">代替フロー</h3>
                                <p className="mt-1 whitespace-pre-line">{usecase.alternativeFlow}</p>
                              </div>
                            )}
                            <div className="flex justify-end space-x-2 pt-4">
                              <Button variant="ghost" size="sm">
                                <Edit2 className="h-4 w-4 mr-2" />
                                編集
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 mr-2" />
                                削除
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    ユースケースが登録されていません
                  </p>
                )}
              </div>
            </div>
          ))}
          {actors.length === 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-500 text-center">
                アクターが登録されていません
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
