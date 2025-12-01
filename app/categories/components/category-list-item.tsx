"use client";

import { LucideIcon } from "lucide-react";
import { getContrast } from "polished";

import { DbCategory, ICON_OPTIONS } from "@/types/categories";
import { EditCategory } from "./modals/edit-category";
import { DeleteCategory } from "./modals/delete-category";

interface CategoryListItemProps {
  category: DbCategory;
}

const IconMap: { [key: string]: LucideIcon } = ICON_OPTIONS.reduce((acc, icon) => {
  acc[icon.name] = icon.Component;
  return acc;
}, {} as any);

export default function CategoryListItem({ category }: CategoryListItemProps) {
  const IconComponent = IconMap[category?.icon || "Home"];

  return (
    <div
      className={`flex flex-col justify-between items-center gap-3  bg-card rounded-md border border-border shadow-sm 
      }`}
    >
      <div
        className="max-h-10 w-full rounded-t-md flex items-center justify-center p-2 shadow-inner"
        style={{ backgroundColor: category?.color || "#fff" }}
      >
        {category.icon ? (
          <IconComponent
            className="h-6 w-6 text-black"
            style={{
              color: getContrast(category?.color || "#000", "#fff") < 3.5 ? "#000" : "#fff",
            }}
          />
        ) : (
          ""
        )}
      </div>

      <div className="flex flex-col justify-center">
        <span className="font-semibold text-lg text-center">{category.name}</span>
        <span
          className={`font-semibold  ${
            category.type === "expense" ? "text-red-600" : "text-green-600"
          } text-sm`}
        ></span>
      </div>
      <div className="flex gap-2">
        <EditCategory category={category} />
        <DeleteCategory category={category} />
      </div>
    </div>
  );
}
