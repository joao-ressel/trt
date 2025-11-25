"use client";
import { ArrowDownIcon, ArrowsLeftRightIcon, ArrowUpIcon } from "@phosphor-icons/react";
interface IconProps {
  size: number;
}
export function ArrowDown({ size }: IconProps) {
  return <ArrowDownIcon size={size} />;
}
export function ArrowsLeftRight({ size }: IconProps) {
  return <ArrowsLeftRightIcon size={size} />;
}
export function ArrowUp({ size }: IconProps) {
  return <ArrowUpIcon size={size} />;
}
