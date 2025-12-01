"use client";

import * as React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  CartesianGrid,
  XAxis,
  Bar,
  LabelList,
} from "recharts";
import { Card, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { buildChartConfig, chartDataTop5Days } from "../../services/chart-data";
import { Category } from "@/types/categories";

import { FilterTransactionType, Option, PropsFilters } from "@/types/global";
import { CustomTooltipContent } from "./custom/legend-custom";

interface DataEntry {
  date: string;
  rawDate: Date;
  amount: number;
  categoryName: string; // Usando categoryName
  color: string;
}

interface LegendItem {
  category: string;
  color: string;
}

interface CustomLegendProps {
  items: LegendItem[];
}

export function ChartTop5Days({
  transactions,
  categories,
  selectedPeriod,
  typeSelected,
  selectedAccount,
  selectedCategory,
}: PropsFilters) {
  const chartConfig = buildChartConfig(categories);
  const { data } = chartDataTop5Days({
    transactions,
    selectedPeriod,
    categories,
    typeSelected: typeSelected,
    selectedAccount,
    selectedCategory,
  });
  const typeLabel =
    typeSelected === "expense" ? "Expenses" : typeSelected === "income" ? "Income" : "All";

  // Tipagem Corrigida para a função de extração de dados da legenda
  const getUniqueLegendItems = (data: DataEntry[]): LegendItem[] => {
    const uniqueItemsMap = new Map<string, LegendItem>();

    data.forEach((item) => {
      if (!uniqueItemsMap.has(item.categoryName)) {
        uniqueItemsMap.set(item.categoryName, {
          category: item.categoryName,
          color: item.color,
        });
      }
    });

    return Array.from(uniqueItemsMap.values());
  };

  // Componente de Legenda Personalizada (já estava correto)
  const CustomLegend = ({ items }: CustomLegendProps) => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "20px",
        marginTop: "15px",
        padding: "0 10px",
      }}
    >
      {items.map((item, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center", fontSize: "14px" }}>
          <span
            style={{
              backgroundColor: item.color,
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              marginRight: "6px",
            }}
          />
          <span>{item.category}</span>
        </div>
      ))}
    </div>
  );

  // NOVO: Componente de Conteúdo do Tooltip Personalizado
  // Nota: Tipar props de Recharts é complexo; 'any' é usado para simplificar

  const legendItems = getUniqueLegendItems(data);

  return (
    <Card className=" flex-1 text-center p-3 bg-card rounded-md border border-border shadow-md">
      <CardTitle>{typeLabel} - Top 5 Days </CardTitle>

      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={data} margin={{ top: 20 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
          {/* NOVO: Usando o CustomTooltipContent */}
          <ChartTooltip
            cursor={false}
            content={(props) => (
              <CustomTooltipContent
                {...props}
                labelMapper={(item: any) => item.categoryName}
                valueMapper={(item) => item.amount.toFixed(2)}
                colorMapper={(item) => item.color}
              />
            )}
          />

          <Bar dataKey="amount" fill="var(--color-desktop)" radius={6}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
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

      <CustomLegend items={legendItems} />
    </Card>
  );
}
