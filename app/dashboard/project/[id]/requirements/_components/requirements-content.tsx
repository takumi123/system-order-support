"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Upload, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { SubCategoryList } from "./subcategory-list";
import {
  getCategories,
  createCategory,
  updateCategory,
  createSubCategory,
  updateSubCategory,
  createTag,
  deleteTag,
} from "../_actions/requirements";

type Category = {
  id: string;
  name: string;
  subCategories: SubCategory[];
};

type SubCategory = {
  id: string;
  name: string;
  tags: Tag[];
  content: string | null;
};

type Tag = {
  id: string;
  name: string;
};

type Document = {
  id: string;
  name: string;
  url: string;
  blobUrl: string;
  analysis: string | null;
  createdAt: string;
};

interface RequirementsContentProps {
  projectId: string;
}

export default function RequirementsContent({ projectId }: RequirementsContentProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [categoriesData, documentsResponse] = await Promise.all([
        getCategories(projectId),
        fetch(`/api/projects/${projectId}/documents`),
      ]);

      if (!documentsResponse.ok) {
        throw new Error('ドキュメントの取得に失敗しました');
      }

      const documentsData = await documentsResponse.json();
      
      setCategories(categoriesData);
      setDocuments(documentsData);
    } catch (error) {
      console.error("データの読み込みに失敗しました:", error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddCategory = async () => {
    try {
      const newCategory = await createCategory(projectId, "新規カテゴリ");
      setCategories([...categories, { ...newCategory, subCategories: [] }]);
      setEditingCategoryId(newCategory.id);
    } catch (error) {
      console.error("カテゴリの作成に失敗しました:", error);
    }
  };

  const handleUpdateCategory = async (id: string, name: string) => {
    try {
      await updateCategory(id, name);
      setCategories(
        categories.map((cat) =>
          cat.id === id ? { ...cat, name } : cat
        )
      );
    } catch (error) {
      console.error("カテゴリの更新に失敗しました:", error);
    }
  };

  const handleAddSubCategory = async (categoryId: string) => {
    try {
      const newSubCategory = await createSubCategory(categoryId, "新規サブカテゴリ");
      setCategories(
        categories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                subCategories: [...cat.subCategories, { ...newSubCategory, tags: [] }],
              }
            : cat
        )
      );
    } catch (error) {
      console.error("サブカテゴリの作成に失敗しました:", error);
    }
  };

  const handleUpdateSubCategory = async (
    categoryId: string,
    subCategoryId: string,
    updates: { name?: string; content?: string }
  ) => {
    try {
      const updatedSubCategory = await updateSubCategory(subCategoryId, updates);
      setCategories(
        categories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                subCategories: cat.subCategories.map((sub) =>
                  sub.id === subCategoryId
                    ? { ...sub, ...updatedSubCategory }
                    : sub
                ),
              }
            : cat
        )
      );
    } catch (error) {
      console.error("サブカテゴリの更新に失敗しました:", error);
    }
  };

  const handleAddTag = async (subCategoryId: string, name: string) => {
    try {
      const newTag = await createTag(subCategoryId, name);
      setCategories(
        categories.map((cat) => ({
          ...cat,
          subCategories: cat.subCategories.map((sub) =>
            sub.id === subCategoryId
              ? { ...sub, tags: [...sub.tags, newTag] }
              : sub
          ),
        }))
      );
    } catch (error) {
      console.error("タグの作成に失敗しました:", error);
    }
  };

  const handleRemoveTag = async (tagId: string, subCategoryId: string) => {
    try {
      await deleteTag(tagId);
      setCategories(
        categories.map((cat) => ({
          ...cat,
          subCategories: cat.subCategories.map((sub) =>
            sub.id === subCategoryId
              ? { ...sub, tags: sub.tags.filter((tag) => tag.id !== tagId) }
              : sub
          ),
        }))
      );
    } catch (error) {
      console.error("タグの削除に失敗しました:", error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/projects/${projectId}/documents`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("アップロードに失敗しました");
      }

      const newDocument = await response.json();
      setDocuments([newDocument, ...documents]);
    } catch (error) {
      console.error("ドキュメントのアップロードに失敗しました:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm("本当にこのドキュメントを削除しますか？")) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(
        `/api/projects/${projectId}/documents?documentId=${documentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("削除に失敗しました");
      }

      setDocuments(documents.filter((doc) => doc.id !== documentId));
    } catch (error) {
      console.error("ドキュメントの削除に失敗しました:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">カテゴリ管理</TabsTrigger>
          <TabsTrigger value="documents">ドキュメント分析</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={handleAddCategory}>
              <Plus className="mr-2 h-4 w-4" />
              カテゴリを追加
            </Button>
          </div>
          
          <div className="grid gap-4">
            {categories.map((category) => (
              <Card key={category.id} className="p-4">
                <div className="space-y-4">
                  {editingCategoryId === category.id ? (
                    <Input
                      value={category.name}
                      onChange={(e) =>
                        handleUpdateCategory(category.id, e.target.value)
                      }
                      onBlur={() => setEditingCategoryId(null)}
                      autoFocus
                    />
                  ) : (
                    <h3
                      className="text-lg font-semibold mb-2 cursor-pointer hover:text-blue-600"
                      onClick={() => setEditingCategoryId(category.id)}
                    >
                      {category.name}
                    </h3>
                  )}
                  
                  <SubCategoryList
                    subCategories={category.subCategories}
                    onAddSubCategory={() => handleAddSubCategory(category.id)}
                    onUpdateSubCategory={(subCategoryId, updates) =>
                      handleUpdateSubCategory(category.id, subCategoryId, updates)
                    }
                    onAddTag={handleAddTag}
                    onRemoveTag={handleRemoveTag}
                  />
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">ドキュメント分析</h3>
                <p className="text-muted-foreground">
                  ドキュメントをアップロードして、AI分析を実行します
                </p>
              </div>
              
              <div className="flex items-center justify-center w-full">
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx"
                />
                <Button 
                  variant="outline" 
                  disabled={isUploading}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {isUploading ? "アップロード中..." : "ドキュメントをアップロード"}
                </Button>
              </div>

              <div className="w-full mt-8">
                {documents.map((doc) => (
                  <div key={doc.id} className="border-b py-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{doc.name}</h4>
                      <div className="flex items-center space-x-2">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          ダウンロード
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDocument(doc.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    {doc.analysis && (
                      <div className="mt-2 text-sm text-gray-600">
                        {doc.analysis}
                      </div>
                    )}
                    <div className="mt-1 text-xs text-gray-400">
                      {new Date(doc.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
