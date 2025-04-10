import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SLAMetric {
  name: string;
  value: string;
  color: string;
}

interface SLAChartData {
  name: string;
  value: number;
}

interface SLAPerformanceProps {
  metrics: SLAMetric[];
  chartData: SLAChartData[];
  loading: boolean;
}

export default function SLAPerformance({ metrics, chartData, loading }: SLAPerformanceProps) {
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="card p-2 text-xs shadow-lg">
          <p className="font-medium">{`${label}: ${payload[0].value}%`}</p>
        </div>
      );
    }

    return null;
  };

  const getBgColorByMetric = (color: string) => {
    if (color.includes("red")) return "bg-red-50";
    if (color.includes("yellow")) return "bg-yellow-50";
    if (color.includes("green")) return "bg-green-50";
    if (color.includes("blue")) return "bg-blue-50";
    return "bg-slate-50";
  };

  return (
    <div className="card">
      <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="title text-lg">Performance de SLA</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-green-700 hover:text-green-800 hover:bg-green-50 -mr-2"
        >
          Detalhes
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      <div className="p-5">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <p className="caption">Carregando dados de SLA...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {metrics.map((metric, index) => (
                <div key={index} className={`text-center rounded-xl p-3 ${getBgColorByMetric(metric.color)}`}>
                  <div className={`text-2xl font-semibold ${metric.color}`}>{metric.value}</div>
                  <div className="text-xs text-slate-600 mt-1 font-medium">{metric.name}</div>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-4 h-48 bg-slate-50 border border-slate-100">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 5,
                    left: -10,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: "#475569", fontSize: 12 }}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <YAxis 
                    tick={{ fill: "#475569", fontSize: 12 }}
                    axisLine={{ stroke: "#e2e8f0" }}
                    domain={[0, 100]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#196127" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
