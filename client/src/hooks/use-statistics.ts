import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Server,
  AlertTriangle,
  TicketPlus
} from "lucide-react";

export interface Stats {
  totalClients: number;
  totalAssets: number;
  criticalAlerts: number;
  openTickets: number;
}

export const useStatistics = () => {
  const query = useQuery<Stats>({
    queryKey: ["/api/statistics"],
  });

  const getStatCards = () => {
    if (!query.data) {
      return [];
    }

    return [
      {
        title: "Clientes Ativos",
        value: query.data.totalClients,
        icon: Building2,
        trend: {
          value: "5.7%",
          positive: true,
        },
        description: "vs. último mês",
        iconColor: "text-primary-400",
        iconBgColor: "bg-primary-900/50",
      },
      {
        title: "Ativos Monitorados",
        value: query.data.totalAssets,
        icon: Server,
        trend: {
          value: "12.2%",
          positive: true,
        },
        description: "vs. último mês",
        iconColor: "text-emerald-500",
        iconBgColor: "bg-emerald-500/20",
      },
      {
        title: "Alertas Críticos",
        value: query.data.criticalAlerts,
        icon: AlertTriangle,
        trend: {
          value: "2",
          positive: false,
        },
        description: "vs. ontem",
        iconColor: "text-red-500",
        iconBgColor: "bg-red-500/20",
      },
      {
        title: "Chamados Abertos",
        value: query.data.openTickets,
        icon: TicketPlus,
        trend: {
          value: "5",
          positive: false,
        },
        description: "próximo do SLA",
        iconColor: "text-amber-500",
        iconBgColor: "bg-amber-500/20",
      },
    ];
  };

  return {
    ...query,
    statCards: getStatCards(),
  };
};
