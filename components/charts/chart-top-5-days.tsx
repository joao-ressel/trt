"use client";

import { BarChart, Bar, XAxis, CartesianGrid, LabelList, Cell } from "recharts";

import { Card, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

import { PropsFilters } from "@/types/global";

import { buildChartConfig, chartDataTop5Days } from "../../services/chart-data";
import { CustomTooltipContent } from "./custom/legend-custom";

export function ChartTop5Days({
  transactions,
  categories,
  selectedPeriod,
  typeSelected,
}: PropsFilters) {
  const chartConfig = buildChartConfig(categories);

  const { data: rawData } = chartDataTop5Days({
    transactions,
    selectedPeriod,
    categories,
    typeSelected,
  });

  const data = rawData.map((item) => ({
    date: item.date,
    total: item.amount,
    color: item.color,
    items: [
      {
        label: item.categoryName,
        amount: item.amount,
        color: item.color,
      },
    ],
  }));

  const typeLabel =
    typeSelected === "expense" ? "Expenses" : typeSelected === "income" ? "Income" : "All";

  return (
    <Card className="flex-1 text-center p-3 bg-card rounded-md border border-border shadow-md">
      <CardTitle>{typeLabel} - Top 5 Days</CardTitle>

      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={data} margin={{ top: 20 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />

          <ChartTooltip
            cursor={false}
            content={(props) => (
              <CustomTooltipContent
                {...props}
                labelMapper={(item: any) => item.label}
                valueMapper={(item: any) => Number(item?.amount ?? 0).toFixed(2)}
                colorMapper={(item) => item.color}
              />
            )}
          />

          <Bar dataKey="total" radius={6}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}

            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
              formatter={(value: number) => {
                const numericValue = typeof value === "number" ? value : parseFloat(value);

                return numericValue.toLocaleString("pt-BR", {
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
    </Card>
  );
}
