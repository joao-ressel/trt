interface RechartsTooltipProps {
  active?: boolean;

  payload?: any[];
}

type DataMapper<T> = (item: T) => string | number;

interface RechartsTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string | number;
}

interface CustomTooltipProps<T> extends RechartsTooltipProps {
  labelMapper: DataMapper<T>;
  valueMapper: DataMapper<T>;
  colorMapper: DataMapper<T>;
}
interface RechartsTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string | number;
}
export const CustomTooltipContent = <T extends unknown>({
  active,
  payload,
  labelMapper,
  valueMapper,
  colorMapper,
}: CustomTooltipProps<T>) => {
  if (!active || !payload || !payload.length) return null;

  const day = payload[0].payload as any;

  if (!day?.items) return null;

  return (
    <div className="p-2 rounded-md shadow-lg bg-background border">
      {day.items.map((item: T, index: number) => {
        const categoryName = String(labelMapper(item));
        const amount = String(valueMapper(item));
        const color = String(colorMapper(item));

        return (
          <div key={index} className="flex items-center text-xs mb-1 last:mb-0">
            <span
              style={{
                backgroundColor: color,
                width: "8px",
                height: "8px",
                borderRadius: "2px",
                marginRight: "6px",
              }}
            />

            <span className="text-muted-foreground">
              {categoryName}:{" "}
              <span className="ml-1 font-semibold text-foreground">R$ {amount}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
};
