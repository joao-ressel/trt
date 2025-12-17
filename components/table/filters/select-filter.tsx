import React from "react";
import { Table } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormattedTransaction } from "@/types/transaction-schema";

interface FilterSelectProps {
  columnId: keyof FormattedTransaction;
  title: string;
  table: Table<FormattedTransaction>;
}

export function FilterSelect({ columnId, title, table }: FilterSelectProps) {
  const column = table.getColumn(columnId);
  if (!column) return null;

  const facetValues = column.getFacetedUniqueValues();

  const sortedUniqueValues = React.useMemo(
    () =>
      Array.from(facetValues.keys())
        .map((value) => String(value).trim())
        .filter(Boolean)
        .sort(),
    [facetValues]
  );

  const filterValue = column.getFilterValue() as string[] | undefined;
  const selectedValue = filterValue?.[0];

  return (
    <Select
      value={selectedValue}
      onValueChange={(value) => {
        column.setFilterValue(value === "__all__" ? undefined : [value]);
      }}
    >
      <SelectTrigger className="w-full">
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
