import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  description?: string;
  iconColor: string;
  iconBgColor: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  iconColor,
  iconBgColor,
}: StatCardProps) {
  return (
    <div className="card bg-white">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="caption text-slate-500 font-medium">{title}</p>
            <h3 className="title text-2xl font-semibold mt-1 text-slate-800">{value}</h3>
          </div>
          <div className={cn("p-3 rounded-xl shadow-sm", iconBgColor)}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
        </div>
        {(trend || description) && (
          <div className="mt-4 flex items-center text-xs">
            {trend && (
              <div
                className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-1",
                  trend.positive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                )}
              >
                {trend.positive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span className="font-medium">{trend.value}</span>
              </div>
            )}
            {description && (
              <span className="caption ml-2">{description}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
