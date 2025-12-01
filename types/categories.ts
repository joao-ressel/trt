import { type Database } from "./supabase.types";

import {
  Utensils,
  HomeIcon,
  Car,
  Heart,
  Briefcase,
  ReceiptText,
  ShoppingCart,
  Plane,
  Zap,
  BookOpen,
  Settings,
  Palette,
  Dog,
  Gamepad,
  Hospital,
  Gift,
  HandCoins,
  Pill,
  Monitor,
  Pizza,
} from "lucide-react";

export const ICON_OPTIONS = [
  { name: "Utensils", Component: Utensils },
  { name: "Home", Component: HomeIcon },
  { name: "Car", Component: Car },
  { name: "Heart", Component: Heart },
  { name: "Briefcase", Component: Briefcase },
  { name: "ReceiptText", Component: ReceiptText },
  { name: "ShoppingCart", Component: ShoppingCart },
  { name: "Plane", Component: Plane },
  { name: "Zap", Component: Zap },
  { name: "BookOpen", Component: BookOpen },
  { name: "Settings", Component: Settings },
  { name: "Palette", Component: Palette },
  { name: "Dog", Component: Dog },
  { name: "Gamepad", Component: Gamepad },
  { name: "Hospital", Component: Hospital },
  { name: "Gift", Component: Gift },
  { name: "HandCoins", Component: HandCoins },
  { name: "Pill", Component: Pill },
  { name: "Monitor", Component: Monitor },
  { name: "Pizza", Component: Pizza },
];

export type CategoryType = "income" | "expense";

export type DbCategory = Database["public"]["Tables"]["categories"]["Row"];
export type InsertCategory = Database["public"]["Tables"]["categories"]["Insert"];
