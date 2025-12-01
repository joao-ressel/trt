// Define o tipo da função de mapeamento: recebe o objeto de dados original (qualquer tipo) e retorna string
interface RechartsTooltipProps {
  active?: boolean;

  payload?: any[];
}

// Define o tipo da função de mapeamento: recebe o objeto de dados original (T) e retorna string ou number
type DataMapper<T> = (item: T) => string | number;

// Props que o Recharts fornece
interface RechartsTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string | number;
}

// O componente CustomTooltipProps DEVE ser genérico (<T>)
interface CustomTooltipProps<T> extends RechartsTooltipProps {
  // As funções de mapeamento USAM o tipo T
  labelMapper: DataMapper<T>;
  valueMapper: DataMapper<T>;
  colorMapper: DataMapper<T>;
}
// Props que o Recharts fornece
interface RechartsTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string | number;
}
// O componente agora é um tipo genérico que aceita <T>
export const CustomTooltipContent = <T extends unknown>({
  active,
  payload,
  label,
  labelMapper,
  valueMapper,
  colorMapper,
}: CustomTooltipProps<T>) => {
  // Usamos CustomTooltipProps<T> aqui

  if (active && payload && payload.length) {
    // O item.payload é o objeto de dado original (T)
    const dataPoint = payload[0].payload as T;

    if (!dataPoint) return null;

    // Aplica as funções de mapeamento ao objeto de dado genérico
    const amount = String(valueMapper(dataPoint));
    const categoryName = String(labelMapper(dataPoint));
    const color = String(colorMapper(dataPoint));

    return (
      <div className="p-2 rounded-md shadow-lg bg-background border-0">
        <div style={{ display: "flex", alignItems: "center", fontSize: "14px" }}>
          <span
            style={{
              backgroundColor: color,
              width: "8px",
              height: "8px",
              borderRadius: "2px",
              marginRight: "6px",
            }}
          />
          <p className="text-xs text-muted-foreground">
            {categoryName}:<span className="ml-1 font-semibold text-foreground">R$ {amount}</span>
          </p>
        </div>
      </div>
    );
  }

  return null;
};
