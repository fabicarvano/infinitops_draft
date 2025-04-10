import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
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
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">{title}</p>
            <h3 className="text-2xl font-semibold mt-1">{value}</h3>
          </div>
          <div className={cn("p-3 rounded-full", iconBgColor)}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
        </div>
        {(trend || description) && (
          <div className="mt-3 flex items-center text-xs">
            {trend && (
              <span
                className={cn(
                  "flex items-center",
                  trend.positive ? "text-emerald-500" : "text-red-500"
                )}
              >
                <i
                  className={`fas fa-arrow-${
                    trend.positive ? "up" : "down"
                  } mr-1`}
                ></i>
                {trend.value}
              </span>
            )}
            {description && (
              <span className="text-slate-400 ml-2">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
