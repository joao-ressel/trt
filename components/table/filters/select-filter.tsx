import React from "react";
import { useReactTable } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormattedTransaction } from "@/types/transaction-schema";

export function FilterSelect({
  columnId,
  title,
  table,
}: {
  columnId: "category_name" | "type" | "account_name";
  title: string;
  table: ReturnType<typeof useReactTable<FormattedTransaction>>;
}) {
  const column = table.getColumn(columnId);
  const facetValues = column?.getFacetedUniqueValues();

  const sortedUniqueValues = React.useMemo(
    () =>
      Array.from(facetValues?.keys() ?? [])
        .map((value) => String(value).trim())
        .filter((value) => value && value !== "")
        .sort(),
    [facetValues]
  );

  const filterValue = column?.getFilterValue() as string[] | undefined;
  const selectedValue = filterValue?.[0] || "";

  return (
    <Select
      value={selectedValue || undefined}
      onValueChange={(value) => {
        column?.setFilterValue(value === "__all__" ? undefined : [value]);
      }}
    >
      <SelectTrigger className="w-36">
        <SelectValue placeholder={title} />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="__all__">Select {title}</SelectItem>

        {sortedUniqueValues.slice(0, 50).map((value) => (
          <SelectItem key={value} value={value}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
