import { DbCategory } from "./categories";
import { FilterPeriod, DbTransaction } from "./transactions";

export type Option = {
  value: string;
  label: string;
};
export type ChartConfig = Record<
  string,
  {
    label: string;
    color: string;
  }
>;

export type FilterTransactionType = "income" | "expense" | "all";

export interface PropsFilters {
  categories: DbCategory[];
  transactions: DbTransaction[];
  typeSelected: FilterTransactionType;
  selectedPeriod: FilterPeriod;
}
