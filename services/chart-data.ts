import { startOfWeek, startOfMonth, startOfYear, isAfter, isEqual, format } from "date-fns";

import { FilterPeriod, DbTransaction } from "../types/transactions";
import { DbCategory } from "@/types/categories";
import { DbAccount } from "@/types/accounts";

type ChartConfig = Record<string, { label: string; color: string | undefined | null }>;

export function buildChartConfig(categories: DbCategory[]) {
  return Object.fromEntries(
    categories.map((cat) => [
      String(cat.id),
      {
        label: cat.name,
        color: cat.color || "#fff",
      },
    ])
  ) satisfies ChartConfig;
}

// ====================================================================
// Filters
// ====================================================================

function filterByPeriod(transactions: DbTransaction[], period: FilterPeriod) {
  const now = new Date();

  const startDateMap: Record<FilterPeriod, Date> = {
    week: startOfWeek(now, { weekStartsOn: 1 }),
    month: startOfMonth(now),
    year: startOfYear(now),
  };
  const startDate = startDateMap[period];

  return transactions.filter((tx) => {
    const txDate = tx.transaction_date;

    const isInPeriod = isAfter(String(txDate), startDate) || isEqual(String(txDate), startDate);
    const isNotTransfer = tx.type !== "transfer";

    return isInPeriod && isNotTransfer;
  });
}

export function applyAllFilters(
  transactions: DbTransaction[],
  period: FilterPeriod,
  typeSelected: "expense" | "income" | "all"
) {
  let filtered = filterByPeriod(transactions, period);

  if (typeSelected !== "all") {
    filtered = filtered.filter((tx) => tx.type === typeSelected);
  }

  return filtered;
}

export function getAccountsTotalBalance(accounts: DbAccount[]) {
  return accounts.reduce((acc, account) => acc + Number(account.current_balance), 0);
}

export function getTotals(filtered: DbTransaction[]) {
  return filtered.reduce(
    (acc, tx) => {
      if (tx.type === "income") {
        acc.totalIncome += tx.amount;
      } else if (tx.type === "expense") {
        acc.totalExpense += tx.amount;
      }
      return acc;
    },
    { totalIncome: 0, totalExpense: 0 }
  );
}

// ====================================================================
// UTILS
// ====================================================================

function groupByCategory(transactions: DbTransaction[]) {
  const groups = transactions.reduce((acc, tx) => {
    const category = tx.category_id ?? "Unknown";
    const date = new Date(String(tx.transaction_date));

    if (!acc[category]) {
      acc[category] = { amount: 0, dates: [] };
    }

    acc[category].amount += tx.amount;
    acc[category].dates.push(date);

    return acc;
  }, {} as Record<string, { amount: number; dates: Date[] }>);

  return Object.entries(groups).map(([category, data]) => ({
    category,
    amount: data.amount,
    date: data.dates.reduce((latest, current) =>
      current.getTime() > latest.getTime() ? current : latest
    ),
  }));
}

const dateFormatter = (value: Date, period: FilterPeriod) => {
  const formatMap: Record<FilterPeriod, string> = {
    week: "dd/MM",
    month: "dd",
    year: "MMM",
  };

  return format(value, formatMap[period] ?? "dd/MM/yyyy");
};

function sortByAmount(data: { date: Date; category: string; amount: number }[]) {
  return data.sort((a, b) => b.amount - a.amount);
}

// ====================================================================
// chartData
// ====================================================================

function buildChartData(
  transactions: DbTransaction[],
  period: FilterPeriod,
  typeSelected: "expense" | "income" | "all"
) {
  const filtered = applyAllFilters(transactions, period, typeSelected);

  const grouped = groupByCategory(filtered);
  const sorted = sortByAmount(grouped);

  return sorted.map((item) => ({
    category: item.category,
    amount: item.amount,
    date: dateFormatter(item.date, period),
    rawDate: item.date,
  }));
}

type ChartsDataProps = {
  transactions: DbTransaction[];
  selectedPeriod: FilterPeriod;
  typeSelected: "expense" | "income" | "all";
};

export const chartData = ({ transactions = [], selectedPeriod, typeSelected }: ChartsDataProps) => {
  const chartItems = buildChartData(transactions, selectedPeriod, typeSelected);
  return {
    data: chartItems,
    typeSelected,
  };
};

// ====================================================================
//  chartTop5Days
// ====================================================================

export function chartTop5Days(
  transactions: DbTransaction[],
  period: FilterPeriod,
  chartConfig: ChartConfig,
  typeSelected: "expense" | "income" | "all"
) {
  const filtered = applyAllFilters(transactions, period, typeSelected);

  type DayEntry = {
    date: Date;
    total: number;
    byCategory: Record<string, number>;
  };

  const daysMap = filtered.reduce((acc, tx) => {
    const date = new Date(String(tx.transaction_date));
    const key = format(date, "yyyy-MM-dd");

    if (!acc[key]) {
      acc[key] = { date, total: 0, byCategory: {} };
    }

    acc[key].total += tx.amount;
    const cat = tx.category_id ?? "Unknown";
    acc[key].byCategory[cat] = (acc[key].byCategory[cat] || 0) + tx.amount;

    return acc;
  }, {} as Record<string, DayEntry>);

  const result = Object.values(daysMap)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
    .map((entry) => {
      const dominant = Object.entries(entry.byCategory).reduce(
        (max, current) => (current[1] > max[1] ? current : max),
        ["Unknown", -1]
      );
      const dominantCategory = dominant[0];
      const color = chartConfig[dominantCategory]?.color ?? "#CCCCCC";
      const categoryName = chartConfig[dominantCategory]?.label ?? "Without name";

      return {
        date: format(entry.date, "dd/MM"),
        rawDate: entry.date,
        amount: entry.total,
        dominantCategory,
        categoryName,
        color,
      };
    });

  return result;
}

export function chartDataTop5Days({
  transactions,
  selectedPeriod,
  categories,
  typeSelected,
}: {
  transactions: DbTransaction[];
  selectedPeriod: FilterPeriod;
  categories: DbCategory[];
  typeSelected: "expense" | "income" | "all";
}) {
  const chartConfig = buildChartConfig(categories) as ChartConfig;

  const data = chartTop5Days(transactions, selectedPeriod, chartConfig, typeSelected);

  return {
    typeSelected,
    data,
  };
}

// ====================================================================
//  chartLineData
// ====================================================================

export function chartLineData({
  transactions,
  categories,
  selectedPeriod,
  typeSelected,
}: {
  transactions: DbTransaction[];
  categories: DbCategory[];
  selectedPeriod: FilterPeriod;
  typeSelected: "expense" | "income" | "all";
}) {
  const filtered = applyAllFilters(transactions, selectedPeriod, typeSelected);

  const categoryMap = Object.fromEntries(categories.map((cat) => [cat.id, cat]));
  const grouped = filtered.reduce((acc, t) => {
    const dateKey = format(new Date(String(t.transaction_date)), "yyyy-MM-dd");

    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(t);
    return acc;
  }, {} as Record<string, DbTransaction[]>);

  return Object.entries(grouped).map(([dateKey, items]) => {
    const dateObj = new Date(dateKey);
    const formattedDate = dateFormatter(dateObj, selectedPeriod);
    const total = items.reduce((sum, t) => sum + t.amount, 0);

    return {
      date: formattedDate,
      rawDate: dateObj,
      total,

      items: items.map((t) => ({
        amount: t.amount,
        category_id: t.category_id,
        color: categoryMap[t.category_id || ""]?.color ?? "#ccc",
        label: categoryMap[t.category_id || ""]?.name ?? "Unknown",
      })),
    };
  });
}
