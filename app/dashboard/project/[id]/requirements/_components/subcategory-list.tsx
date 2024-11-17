"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useState } from "react";

type Tag = {
  id: string;
  name: string;
};

type SubCategory = {
  id: string;
  name: string;
  tags: Tag[];
  content: string | null;
};

interface SubCategoryListProps {
  subCategories: SubCategory[];
  onAddSubCategory: () => void;
  onUpdateSubCategory: (
    subCategoryId: string,
    updates: { name?: string; content?: string }
  ) => void;
  onAddTag: (subCategoryId: string, name: string) => void;
  onRemoveTag: (tagId: string, subCategoryId: string) => void;
}

export function SubCategoryList({
  subCategories,
  onAddSubCategory,
  onUpdateSubCategory,
  onAddTag,
  onRemoveTag,
}: SubCategoryListProps) {
  const [newTag, setNewTag] = useState<string>("");

  const handleAddTag = (subCategoryId: string) => {
    if (!newTag.trim()) return;
    onAddTag(subCategoryId, newTag.trim());
    setNewTag("");
  };

  return (
    <div className="space-y-4">
      {subCategories.map((subCategory) => (
        <div key={subCategory.id} className="border rounded-md p-4 space-y-4">
          <Input
            value={subCategory.name}
            onChange={(e) =>
              onUpdateSubCategory(subCategory.id, { name: e.target.value })
            }
            className="font-medium"
            placeholder="サブカテゴリ名"
          />
          
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {subCategory.tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md"
                >
                  <span className="text-sm">{tag.name}</span>
                  <button
                    onClick={() => onRemoveTag(tag.id, subCategory.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="新規タグ"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddTag(subCategory.id);
                  }
                }}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddTag(subCategory.id)}
              >
                タグを追加
              </Button>
            </div>
          </div>

          <textarea
            value={subCategory.content || ""}
            onChange={(e) =>
              onUpdateSubCategory(subCategory.id, { content: e.target.value })
            }
            className="w-full min-h-[100px] p-2 border rounded-md"
            placeholder="内容を入力..."
          />
        </div>
      ))}

      <Button onClick={onAddSubCategory} variant="outline" className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        サブカテゴリを追加
      </Button>
    </div>
  );
}
