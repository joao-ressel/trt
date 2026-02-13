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
import {
  applyAllFilters,
  getAccountsTotalBalance,
  getTotals,
  chartData,
  chartDataTop5Days,
  chartLineData,
} from "../../services/chart-data";
import { ChartTimelineCategories } from "./chart-timeline-categories";
import { ChartTop5Days } from "./chart-top-5-days";
import { currencyFormatter } from "@/lib/utils";
import { type CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { EyeClosedIcon, EyeIcon } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
export const description = "An interactive area chart";

interface ChartsViewProps {
  transactions: DbTransaction[];
  categories: DbCategory[];
  accounts: DbAccount[];
}

export function ChartsView({ transactions, categories, accounts }: ChartsViewProps) {
  const [selectedPeriod, setSelectedPeriod] = React.useState<FilterPeriod>("month");
  const [selectedType, setSelectedType] = React.useState<FilterTransactionType>("all");
  const chartDataByCategory = chartData({
    transactions,
    selectedPeriod,
    typeSelected: selectedType,
  });

  const top5DaysData = chartDataTop5Days({
    transactions,
    categories,
    selectedPeriod,
    typeSelected: selectedType,
  });

  const timelineData = chartLineData({
    transactions,
    categories,
    selectedPeriod,
    typeSelected: selectedType,
  });

  const filteredTransactions = applyAllFilters(transactions, selectedPeriod, selectedType);
  const totalAccounts = currencyFormatter.format(getAccountsTotalBalance(accounts));
  const totalExpense = currencyFormatter.format(getTotals(filteredTransactions).totalExpense);
  const totalIncome = currencyFormatter.format(getTotals(filteredTransactions).totalIncome);
  const [showExpense, setShowExpense] = useState(false);
  const [showTotal, setShowTotal] = useState(false);
  const [showIncome, setShowIncome] = useState(false);
  const [hideChartValues, setHideChartValues] = useState(true);

  const [mounted, setMounted] = useState(false);

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="flex flex-col gap-4 m-0 w-full z-1">
      <div className="w-full flex gap-6 items-center justify-center">
        <div className="w-full flex flex-row justify-between md:gap-4 gap-2 text-center">
          {(selectedType === "expense" || selectedType === "all") && (
            <Card className="relative text-center self-center border border-border gap-1 h-fit p-2 w-full">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowExpense((prev) => !prev);
                }}
                className="absolute top-2 right-2 text-muted-foreground hover:text-primary z-100"
              >
                {showExpense ? <EyeClosedIcon size={18} /> : <EyeIcon size={18} />}
              </Button>

              <span
                className={`text-lg font-bold text-red-500 transition-all ${
                  showExpense ? "" : "blur-sm select-none"
                }`}
              >
                {totalExpense}
              </span>

              <p className="text-sm text-secondary-foreground">Expense</p>
            </Card>
          )}

          <Card className="relative text-center self-center border border-border gap-1 h-fit p-2 w-full">
            <Button
              variant="ghost"
              onClick={() => setShowTotal((prev) => !prev)}
              className="absolute top-2 right-2 text-muted-foreground hover:text-primary z-100"
            >
              {showTotal ? <EyeClosedIcon size={18} /> : <EyeIcon size={18} />}
            </Button>

            <span
              className={`text-lg font-bold text-blue-500 transition-all ${
                showTotal ? "" : "blur-sm select-none"
              }`}
            >
              {totalAccounts}
            </span>

            <p className="text-sm text-secondary-foreground">Total</p>
          </Card>

          {(selectedType === "income" || selectedType === "all") && (
            <Card className="relative text-center self-center border border-border gap-1 h-fit p-2 w-full">
              <Button
                variant="ghost"
                onClick={() => setShowIncome((prev) => !prev)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-primary z-100"
              >
                {showIncome ? <EyeClosedIcon size={18} /> : <EyeIcon size={18} />}
              </Button>

              <span
                className={`text-lg font-bold text-green-500 transition-all ${
                  showIncome ? "" : "blur-sm select-none"
                }`}
              >
                {totalIncome}
              </span>

              <p className="text-sm text-secondary-foreground">Income</p>
            </Card>
          )}
        </div>
      </div>

      <Card className="@container/card p-0 m-0 border-border w-full">
        <CardHeader className="w-full flex justify-center md:gap-4 gap-2 p-3 m-0 flex-col md:flex-row">
          <CardAction className="self-center  w-full flex md:w-auto">
            <ToggleGroup
              type="single"
              value={selectedType}
              onValueChange={(value: FilterTransactionType) => {
                setSelectedType(value);
              }}
              variant="outline"
              className="w-full *:data-[slot=toggle-group-item]:flex-1! md:*:data-[slot=toggle-group-item]:px-4!  md:w-auto"
            >
              <ToggleGroupItem value="expense">Expense</ToggleGroupItem>
              <ToggleGroupItem value="all">All</ToggleGroupItem>
              <ToggleGroupItem value="income">Income</ToggleGroupItem>
            </ToggleGroup>
            <Select
              value={selectedType}
              onValueChange={(value: FilterTransactionType) => {
                setSelectedType(value);
              }}
            >
              <SelectTrigger
                className="hidden **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate  @[767px]/card:hidden"
                size="sm"
                aria-label="Select a value"
              >
                <SelectValue placeholder="all" />
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

          <CardAction className="self-center  w-full flex md:w-auto">
            <ToggleGroup
              type="single"
              value={selectedPeriod}
              onValueChange={(value: FilterPeriod) => {
                setSelectedPeriod(value);
              }}
              variant="outline"
              className="w-full *:data-[slot=toggle-group-item]:flex-1! md:*:data-[slot=toggle-group-item]:px-4!  md:w-auto"
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
                className="hidden **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                size="sm"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl z-50">
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
          <CardAction className="self-center  w-full flex md:w-auto">
            <Button
              variant="ghost"
              onClick={() => setHideChartValues((prev) => !prev)}
              className="text-muted-foreground hover:text-primary"
            >
              {hideChartValues ? <EyeIcon size={18} /> : <EyeClosedIcon size={18} />}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className=" gap-4 p-3 w-full hidden md:flex">
          {mounted && (
            <ChartTransactionsByCategory
              data={chartDataByCategory.data}
              categories={categories}
              typeSelected={selectedType}
              selectedPeriod={selectedPeriod}
              hideChartValues={hideChartValues}
            />
          )}
          {mounted && (
            <ChartTop5Days
              categories={categories}
              transactions={transactions}
              selectedPeriod={selectedPeriod}
              typeSelected={selectedType}
              hideChartValues={hideChartValues}
            />
          )}
          {mounted && (
            <ChartTimelineCategories
              typeSelected={selectedType}
              data={timelineData}
              categories={categories}
              hideChartValues={hideChartValues}
            />
          )}
        </CardContent>

        <Carousel setApi={setApi} className="flex md:hidden gap-4 p-3 w-full ">
          <CarouselContent>
            <CarouselItem>
              {mounted && (
                <ChartTransactionsByCategory
                  data={chartDataByCategory.data}
                  categories={categories}
                  typeSelected={selectedType}
                  selectedPeriod={selectedPeriod}
                  hideChartValues={hideChartValues}
                />
              )}
            </CarouselItem>
            <CarouselItem>
              {mounted && (
                <ChartTop5Days
                  categories={categories}
                  transactions={transactions}
                  selectedPeriod={selectedPeriod}
                  typeSelected={selectedType}
                  hideChartValues={hideChartValues}
                />
              )}
            </CarouselItem>
            <CarouselItem>
              {mounted && (
                <ChartTimelineCategories
                  typeSelected={selectedType}
                  data={timelineData}
                  categories={categories}
                  hideChartValues={hideChartValues}
                />
              )}
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious variant="default" className="left-5 rounded-md bottom-0" />
          <CarouselNext variant="default" className="rounded-md right-5 bottom-0" />
        </Carousel>
        <div className="text-muted-foreground py-2 text-center text-sm md:hidden">
          Chart {current} of {count}
        </div>
      </Card>
    </div>
  );
}
