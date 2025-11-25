"use client";

import CategoryActions from "../buttons-actions/categories-actions";
import { Category, ICON_OPTIONS } from "@/types/categories";
import { useRouter } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { getContrast } from "polished";

interface CategoryListItemProps {
  category: Category;
}

const IconMap: { [key: string]: LucideIcon } = ICON_OPTIONS.reduce((acc, icon) => {
  acc[icon.name] = icon.Component;
  return acc;
}, {} as any);

export default function CategoryListItem({ category }: CategoryListItemProps) {
  const IconComponent = IconMap[category.icon];
  const router = useRouter();
  const refreshList = () => router.refresh();

  return (
    <div className="flex justify-between items-center p-3 gap-3 h-25 bg-card rounded-md border border-border shadow-md">
      <div className="flex w-full h-full items-center gap-4 justify-between">
        <div className="flex w-full h-full gap-3 ">
          <div
            className="h-full w-10 rounded-md flex items-center justify-center p-2 shadow-inner"
            style={{ backgroundColor: category.color }}
          >
            {category.icon ? (
              <IconComponent
                className="h-6 w-6 text-black"
                style={{ color: getContrast(category.color, "#fff") < 3.5 ? "#000" : "#fff" }}
              />
            ) : (
              ""
            )}
          </div>

          <div className="flex flex-col justify-center">
            <span className="font-semibold text-lg">{category.name}</span>
            <span
              className={`font-semibold ${
                category.type === "expense" ? "text-red-600" : "text-green-600"
              } text-sm`}
            >
              {category.type.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <CategoryActions category={category} onActionSuccess={refreshList} />
        </div>
      </div>
    </div>
  );
}
