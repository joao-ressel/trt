// Interface simplificada das props do tick do Recharts
interface CustomTickProps {
  x: number;
  y: number;
  payload: {
    value: string; // O valor do dataKey (neste caso, "label")
    index: number;
  };
}
const MAX_TICK_WIDTH = 80; // Aumentado para dar mais espaço

export const CustomYAxisTick = ({ x, y, payload }: CustomTickProps) => {
  const text = payload.value;
  const height = 40;

  return (
    <g transform={`translate(${x},${y})`} className="ml-6">
      <foreignObject
        // Use -MAX_TICK_WIDTH para garantir que o alinhamento à direita funcione
        x={-MAX_TICK_WIDTH}
        y={-height / 2}
        width={MAX_TICK_WIDTH}
        height={height}
      >
        {/* ... Div com estilos de quebra de linha ... */}
        <div className="break-all wrap-break-word w-full text-right">{text}</div>
      </foreignObject>
    </g>
  );
};
