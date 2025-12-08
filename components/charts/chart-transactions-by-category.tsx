"use client";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

import { buildChartConfig } from "../../services/chart-data";
import { FilterTransactionType } from "@/types/global";
import { Card, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CustomTooltipContent } from "./custom/tooltip-custom";
import { CustomYAxisTick } from "./custom/tick-cumtom";
import { DbCategory } from "@/types/categories";
import { FilterPeriod } from "@/types/transactions";

interface ChartCategoryProps {
  data: {
    category: string;
    amount: number;
    date: string;
    rawDate: Date;
  }[];
  categories: DbCategory[];
  selectedPeriod: FilterPeriod;
  typeSelected: FilterTransactionType;
}

export function ChartTransactionsByCategory({
  data,
  categories,
  typeSelected,
}: ChartCategoryProps) {
  const [timeRange, setTimeRange] = React.useState("30d");

  const chartConfig = buildChartConfig(categories);

  const filteredData = data.filter((item) => {
    const itemDate = item.rawDate;
    const today = new Date();

    let daysToSubtract = 365;
    if (timeRange === "30d") daysToSubtract = 30;
    if (timeRange === "7d") daysToSubtract = 7;

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysToSubtract);

    return itemDate >= startDate;
  });

  const dataWithColor = filteredData.map((item) => {
    const cfg = chartConfig[item.category];
    return {
      ...item,
      label: cfg?.label ?? "Without name",
      color: cfg?.color ?? "#cccccc",
    };
  });

  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = React.useState(0);

  const totalItems = dataWithColor.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const pagedData = dataWithColor.slice(
    currentPage * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage((p) => p + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 0) setCurrentPage((p) => p - 1);
  };

  const typeLabel =
    typeSelected === "expense" ? "Expenses" : typeSelected === "income" ? "Income" : "All";

  return (
    <Card className="flex-1 text-center p-3 bg-card rounded-md border border-border">
      <CardTitle>{typeLabel} by category</CardTitle>

      <div className="flex flex-col">
        <ChartContainer config={chartConfig} className="flex-1 w-full">
          <BarChart
            accessibilityLayer
            data={pagedData}
            layout="vertical"
            margin={{ top: 20, right: 80, bottom: 5, left: 60 }}
          >
            <ChartTooltip
              cursor={false}
              content={(props) => (
                <CustomTooltipContent
                  {...props}
                  labelMapper={(item: any) => item?.label ?? ""}
                  valueMapper={(item: any) => Number(item?.amount ?? 0).toFixed(2)}
                  colorMapper={(item: any) => item?.color ?? "#ccc"}
                />
              )}
            />

            <CartesianGrid vertical={false} />

            <YAxis
              dataKey="label"
              type="category"
              tickMargin={5}
              axisLine={false}
              tick={CustomYAxisTick}
            />

            <XAxis dataKey="amount" type="number" hide />

            <Bar dataKey="amount" radius={4} layout="vertical">
              {pagedData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}

              <LabelList
                dataKey="amount"
                position="right"
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => {
                  const v = typeof value === "number" ? value : Number(value);
                  return v.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  });
                }}
              />
            </Bar>
          </BarChart>
        </ChartContainer>

        {/* Paginação */}
        <div className="flex-1 flex justify-center gap-4 p-2 items-center">
          <Button onClick={goToPrevPage} variant="ghost" disabled={currentPage === 0}>
            <ArrowLeft />
          </Button>

          <span className="text-sm text-muted-foreground">
            {currentPage + 1} of {totalPages}
          </span>

          <Button onClick={goToNextPage} variant="ghost" disabled={currentPage === totalPages - 1}>
            <ArrowRight />
          </Button>
        </div>
      </div>
    </Card>
  );
}
