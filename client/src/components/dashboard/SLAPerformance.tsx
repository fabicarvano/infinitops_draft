import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

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
        <div className="bg-slate-900 p-2 rounded-md border border-slate-800 text-xs">
          <p className="font-medium">{`${label}: ${payload[0].value}%`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="border-b border-slate-700 px-4 py-3">
        <CardTitle className="text-base font-semibold">Performance de SLA</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-slate-400">Carregando dados de SLA...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {metrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className={`text-2xl font-semibold ${metric.color}`}>{metric.value}</div>
                  <div className="text-xs text-slate-400 mt-1">{metric.name}</div>
                </div>
              ))}
            </div>

            <div className="rounded-lg p-4 h-48 bg-slate-900">
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    axisLine={{ stroke: "#2d3748" }}
                  />
                  <YAxis 
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    axisLine={{ stroke: "#2d3748" }}
                    domain={[0, 100]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
