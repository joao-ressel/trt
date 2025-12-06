import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { buildChartConfig } from "../../services/chart-data";
import { Card, CardDescription, CardTitle } from "../ui/card";
import { ChartContainer, ChartTooltip } from "../ui/chart";
import { FilterTransactionType } from "@/types/global";
import { CustomTooltipContent } from "./custom/legend-custom";
import { DbCategory } from "@/types/categories";

export function ChartTimelineCategories({
  data,
  categories,
  typeSelected,
}: {
  data: any[];
  categories: DbCategory[];
  typeSelected: FilterTransactionType;
}) {
  const chartConfig = buildChartConfig(categories);

  const typeLabel =
    typeSelected === "expense" ? "Expenses" : typeSelected === "income" ? "Income" : "All";

  return (
    <Card className="flex-1 text-center p-3 bg-card rounded-md border border-border shadow-md justify-center ">
      <CardTitle>Timeline {typeLabel}</CardTitle>
      <CardDescription />
      <ChartContainer config={chartConfig} className=" max-h-80 p-3">
        <LineChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" />
          <YAxis />
          <ChartTooltip
            content={(props) => (
              <CustomTooltipContent
                {...props}
                labelMapper={(item: any) => item.label}
                valueMapper={(item: any) => Number(item?.amount ?? 0).toFixed(2)}
                colorMapper={(item: any) => item.color}
              />
            )}
          />
          <Line
            dataKey="total"
            stroke="var(--secondary-foreground)"
            strokeWidth={2}
            dot={(props) => {
              const { cx, cy, payload, index } = props;

              const dominantColor =
                payload.items && payload.items.length > 0
                  ? chartConfig[payload.items[0].category_id || ""]?.color ??
                    "var(--secondary-foreground)"
                  : "var(--secondary-foreground)";

              return (
                <circle
                  key={`dot-${payload.date}-${index}`}
                  cx={cx}
                  cy={cy}
                  r={3}
                  fill={dominantColor}
                  stroke="#00000022"
                  strokeWidth={1}
                />
              );
            }}
            activeDot={{
              r: 3,
            }}
          />
        </LineChart>
      </ChartContainer>
    </Card>
  );
}
