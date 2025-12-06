"use server";

import { createClient } from "@/services/supabase/server";
import { InsertCategory } from "@/types/categories";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: InsertCategory) {
  const supabase = await createClient();

  const { error } = await supabase.from("categories").insert({
    name: formData.name,
    type: formData.type,
    color: formData.color,
    icon: formData.icon,
    user_id: (await supabase.auth.getUser()).data.user?.id || "default-user-id",
  });

  if (error) {
    console.error("Error inserting category:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/");

  return { success: true, message: "Category created successfully!" };
}

export async function updateCategory(categoryId: number, formData: Partial<InsertCategory>) {
  const supabase = await createClient();

  const updatedFields: { [key: string]: any } = {};

  if (formData.name !== undefined) updatedFields.name = formData.name;
  if (formData.type !== undefined) updatedFields.type = formData.type;
  if (formData.color !== undefined) updatedFields.color = formData.color;
  if (formData.icon !== undefined) updatedFields.icon = formData.icon;

  const { error } = await supabase.from("categories").update(updatedFields).eq("id", categoryId);

  if (error) {
    console.error("Error updating the category:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/");

  return { success: true, message: "Category updated successfully!" };
}

export async function deleteCategory(categoryId: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", categoryId);

  if (error) {
    console.error("Error deleting category:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/");

  return { success: true, message: "Category successfully deleted!" };
}
