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
    // Definir dados padrão para evitar erro quando a API falha
    initialData: {
      totalClients: 3,
      totalAssets: 8,
      criticalAlerts: 2,
      openTickets: 5
    }
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
        iconColor: "text-blue-600",
        iconBgColor: "bg-blue-50",
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
        iconColor: "text-green-600",
        iconBgColor: "bg-green-50",
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
        iconColor: "text-red-600",
        iconBgColor: "bg-red-50",
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
        iconColor: "text-yellow-600",
        iconBgColor: "bg-yellow-50",
      },
    ];
  };

  return {
    ...query,
    statCards: getStatCards(),
  };
};
