"use client";

import * as React from "react";

import { DbTransaction, FilterPeriod } from "@/types/transactions";
import { FilterTransactionType } from "@/types/global";
import { DbCategory } from "@/types/categories";
import { DbAccount } from "@/types/accounts";

import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChartTransactionsByCategory } from "./chart-transactions-by-category";
import { applyAllFilters, getAccountsTotalBalance, getTotals } from "../../services/chart-data";
import { ChatTimelineCategories } from "./chart-timeline-categories";
import { ChartTop5Days } from "./chart-top-5-days";
import { currencyFormatter } from "@/lib/utils";

export const description = "An interactive area chart";

interface ChartsViewProps {
  transactions: DbTransaction[];
  categories: DbCategory[];
  accounts: DbAccount[];
}

export function ChartsView({ transactions, categories, accounts }: ChartsViewProps) {
  const [selectedPeriod, setSelectedPeriod] = React.useState<FilterPeriod>("month");
  const [selectedType, setSelectedType] = React.useState<FilterTransactionType>("all");

  const filteredTransactions = applyAllFilters(transactions, selectedPeriod, selectedType);

  const totalAccounts = currencyFormatter.format(getAccountsTotalBalance(accounts));
  const totalExpense = currencyFormatter.format(getTotals(filteredTransactions).totalExpense);
  const totalIncome = currencyFormatter.format(getTotals(filteredTransactions).totalIncome);

  return (
    <div className="flex flex-col gap-4 m-0">
      <div className="w-full h-full flex gap-6 items-center justify-center">
        <div className="w-full h-full flex flex-row justify-between gap-4 text-center">
          <Card className="text-center self-center border border-border gap-1 h-fit p-2  w-full">
            <span className="text-lg font-bold text-blue-500">{totalAccounts}</span>
            <p className="text-sm text-secondary-foreground">Total</p>
          </Card>
          {(selectedType === "expense" || selectedType === "all") && (
            <Card className="text-center self-center  border border-border gap-1 h-fit p-2  w-full">
              <span className="text-lg font-bold text-red-500">{totalExpense}</span>
              <p className="text-sm text-secondary-foreground">Expense</p>
            </Card>
          )}
          {(selectedType === "income" || selectedType === "all") && (
            <Card className="text-center self-center  border border-border gap-1 h-fit p-2  w-full">
              <span className="text-lg font-bold text-green-500">{totalIncome}</span>
              <p className="text-sm text-secondary-foreground">Income</p>
            </Card>
          )}
        </div>
      </div>

      <Card className="@container/card p-0 m-0 border-border">
        <CardHeader className="w-full flex justify-center gap-4 p-3 m-0">
          <CardAction className="self-center h-full ">
            <ToggleGroup
              type="single"
              value={selectedType}
              onValueChange={(value: FilterTransactionType) => {
                setSelectedType(value);
              }}
              variant="outline"
              className=" hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
            >
              <ToggleGroupItem value="expense">Expense</ToggleGroupItem>
              <ToggleGroupItem value="income">Income</ToggleGroupItem>
              <ToggleGroupItem value="all">All</ToggleGroupItem>
            </ToggleGroup>
            <Select
              value={selectedType}
              onValueChange={(value: FilterTransactionType) => {
                setSelectedType(value);
              }}
            >
              <SelectTrigger
                className=" flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                size="sm"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="expense" className="rounded-lg">
                  Expense
                </SelectItem>
                <SelectItem value="income" className="rounded-lg">
                  Income
                </SelectItem>
                <SelectItem value="all" className="rounded-lg">
                  All
                </SelectItem>
              </SelectContent>
            </Select>
          </CardAction>

          <CardAction className="self-center">
            <ToggleGroup
              type="single"
              value={selectedPeriod}
              onValueChange={(value: FilterPeriod) => {
                setSelectedPeriod(value);
              }}
              variant="outline"
              className=" hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
            >
              <ToggleGroupItem value="week">Week</ToggleGroupItem>
              <ToggleGroupItem value="month">Month</ToggleGroupItem>
              <ToggleGroupItem value="year">Year</ToggleGroupItem>
            </ToggleGroup>
            <Select
              value={selectedPeriod}
              onValueChange={(value: FilterPeriod) => {
                setSelectedPeriod(value);
              }}
            >
              <SelectTrigger
                className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                size="sm"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="week" className="rounded-lg">
                  Week
                </SelectItem>
                <SelectItem value="month" className="rounded-lg">
                  Month
                </SelectItem>
                <SelectItem value="year" className="rounded-lg">
                  Year
                </SelectItem>
              </SelectContent>
            </Select>
          </CardAction>
        </CardHeader>
        <CardContent className="flex gap-4 p-3 w-full">
          <ChartTransactionsByCategory
            categories={categories}
            transactions={transactions}
            typeSelected={selectedType}
            selectedPeriod={selectedPeriod}
          />
          <ChartTop5Days
            categories={categories}
            transactions={transactions}
            typeSelected={selectedType}
            selectedPeriod={selectedPeriod}
          />

          <ChatTimelineCategories
            categories={categories}
            transactions={transactions}
            typeSelected={selectedType}
            selectedPeriod={selectedPeriod}
          />
        </CardContent>
      </Card>
    </div>
  );
}
