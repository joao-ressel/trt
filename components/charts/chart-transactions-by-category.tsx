"use client";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { buildChartConfig, chartData } from "../../services/chart-data";
import { PropsFilters } from "@/types/global";
import { Card, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CustomTooltipContent } from "./custom/legend-custom";
import { CustomYAxisTick } from "./custom/tick-cumtom";
export const description = "An interactive area chart";

export function ChartTransactionsByCategory({
  transactions,
  selectedPeriod,
  categories,
  typeSelected,
}: PropsFilters) {
  const [timeRange, setTimeRange] = React.useState("30d");

  const chartConfig = buildChartConfig(categories);
  const { data } = chartData({
    transactions,
    selectedPeriod,
    typeSelected: typeSelected, // typeSelected: "expense" ou "income"
  });

  const filteredData = data.filter((item) => {
    const itemDate = item.rawDate;
    const today = new Date();
    let daysToSubtract = 365;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return itemDate >= startDate;
  });

  const dataWithColor = filteredData.map((item) => {
    const config = chartConfig[item.category];
    const color = config ? config.color : "#CCCCCC";
    const label = config ? config.label : "Without name";

    return {
      ...item,
      label: label,
      color: color,
    };
  });

  const typeLabel =
    typeSelected === "expense" ? "Expenses" : typeSelected === "income" ? "Income" : "All";

  const ITEMS_PER_PAGE = 5; // Define que 8 barras aparecerão por página
  const [currentPage, setCurrentPage] = React.useState(0); // 0 = primeira página

  // Calcule o número total de páginas
  const totalItems = dataWithColor.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Calcule os índices de início e fim para o slice
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // 2. Filtre os dados a serem exibidos (paginação)
  const pagedData = dataWithColor.slice(startIndex, endIndex);

  // 3. Funções de navegação
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Card className="flex-1 text-center  p-3  bg-card rounded-md border border-border">
      <CardTitle>{typeLabel} by category</CardTitle>
      <div className="flex flex-col">
        <ChartContainer config={chartConfig} className="flex-1 w-full">
          <BarChart
            accessibilityLayer
            data={pagedData}
            layout="vertical"
            margin={{
              top: 20,
              right: 80,
              bottom: 5,
              left: 60,
            }}
          >
            <ChartTooltip
              cursor={false}
              content={(props) => (
                <CustomTooltipContent
                  {...props}
                  labelMapper={(item: any) => item.label}
                  valueMapper={(item) => item.amount.toFixed(2)}
                  colorMapper={(item) => item.color}
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="amount" radius={4} layout="vertical">
              {pagedData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
              <LabelList
                dataKey="amount"
                position="right"
                className="fill-foreground "
                fontSize={12}
                formatter={(value: number) => {
                  // Garante que o valor é um número para toLocaleString
                  const numericValue = typeof value === "number" ? value : parseFloat(value);

                  // Formata o valor como moeda brasileira (BRL)
                  return numericValue.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 0, // Remove centavos se não quiser
                    maximumFractionDigits: 0, // Remove centavos se não quiser
                  });
                }}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
        <div className="flex justify-center gap-4 p-2 items-center">
          <Button onClick={goToPrevPage} variant="icon" disabled={currentPage === 0}>
            <ArrowLeft />
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentPage + 1} of {totalPages}
          </span>
          <Button onClick={goToNextPage} variant="icon" disabled={currentPage === totalPages - 1}>
            <ArrowRight />
          </Button>
        </div>
      </div>
    </Card>
  );
}
