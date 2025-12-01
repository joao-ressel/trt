import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { buildChartConfig, chartLineData } from "../../services/chart-data";
import { Card, CardDescription, CardTitle } from "../ui/card";
import { ChartContainer, ChartTooltip } from "../ui/chart";
import { PropsFilters } from "@/types/global";
import { CustomTooltipContent } from "./custom/legend-custom";

export function ChatTimelineCategories({
  transactions,
  categories,
  selectedPeriod,
  typeSelected,
}: PropsFilters) {
  const data = chartLineData({
    transactions,
    categories,
    selectedPeriod,
    typeSelected,
  });

  const chartConfig = buildChartConfig(categories);

  let indexCounter = 0; // Inicializa um contador
  const scatterData = data.flatMap((entry) =>
    entry.items.map((item) => {
      const uniqueId = indexCounter++; // Atribui e incrementa
      return {
        x: entry.date,
        y: entry.total,
        color: chartConfig[item.category_id || ""]?.color ?? "#ccc",
        amount: item.amount,
        label: item.label,
        category_id: item.category_id,
        __uniqueId: uniqueId, // <-- Adiciona o identificador único
      };
    })
  );

  const typeLabel =
    typeSelected === "expense" ? "Expenses" : typeSelected === "income" ? "Income" : "All";

  return (
    <Card className="flex-1 text-center  p-3  bg-card rounded-md border border-border shadow-md justify-center ">
      <CardTitle>Timeline {typeLabel}</CardTitle>
      <CardDescription />

      <ChartContainer config={chartConfig} className=" max-h-80 p-3">
        <LineChart accessibilityLayer data={scatterData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="x" />
          <YAxis />

          <ChartTooltip
            content={(props) => (
              <CustomTooltipContent
                {...props}
                labelMapper={(item: any) => item.label}
                valueMapper={(item) => item.amount.toFixed(2)}
                colorMapper={(item) => item.color}
              />
            )}
          />
          <Line
            dataKey="y"
            data={scatterData}
            stroke="var(--secondary-foreground)"
            strokeWidth={2}
            dot={(props) => {
              const { cx, cy, payload } = props;
              const uniqueKey = `dot-${payload.__uniqueId}`;
              return (
                <circle
                  key={uniqueKey}
                  cx={cx}
                  cy={cy}
                  r={3}
                  fill={payload.color}
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
