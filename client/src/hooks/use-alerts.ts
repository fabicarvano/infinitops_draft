import { useQuery } from "@tanstack/react-query";

type AlertSeverity = "critical" | "medium" | "low";

export interface Alert {
  id: number;
  status: AlertSeverity;
  client: string;
  asset: string;
  assetId: number;
  message: string;
  time: string;
  createdAt: string;
  ticketId?: number;
  ticketCreatedAt?: string;
  sla?: string;
  isAutoTicket?: boolean;
}

// This is a temporary function to provide sample data
// In a real application, this would fetch from the API
const getMockAlerts = (): Alert[] => {
  return [
    {
      id: 1,
      status: "critical",
      client: "Empresa XYZ",
      asset: "SRV-DB01",
      assetId: 1,
      message: "Disco crítico (98%)",
      time: "12m atrás",
      createdAt: "2025-04-14T01:20:00.000Z",
      ticketId: 1001,
      ticketCreatedAt: "2025-04-14T01:23:15.000Z",
      sla: "2h",
      isAutoTicket: false
    },
    {
      id: 2,
      status: "medium",
      client: "Empresa ABC",
      asset: "RTR-EDGE-03",
      assetId: 2,
      message: "Tráfego acima do normal",
      time: "27m atrás",
      createdAt: "2025-04-14T01:10:00.000Z",
      ticketId: 1002,
      ticketCreatedAt: "2025-04-14T01:14:00.000Z",
      sla: "4h",
      isAutoTicket: true
    },
    {
      id: 3,
      status: "critical",
      client: "Tech Solutions",
      asset: "SRV-WEB02",
      assetId: 3,
      message: "Serviço Apache indisponível",
      time: "43m atrás",
      createdAt: "2025-04-14T00:53:00.000Z",
      // Sem ticketId, para mostrar a opção de criar chamado
    },
    {
      id: 4,
      status: "medium",
      client: "Empresa XYZ",
      asset: "NAS-BACKUP",
      assetId: 4,
      message: "Falha no backup noturno",
      time: "1h 12m atrás",
      createdAt: "2025-04-14T00:24:00.000Z",
      ticketId: 1004,
      ticketCreatedAt: "2025-04-14T00:35:00.000Z",
      sla: "8h"
    },
    {
      id: 5,
      status: "low",
      client: "Empresa DEF",
      asset: "RTR-CORE-01",
      assetId: 5,
      message: "Latência elevada",
      time: "1h 38m atrás",
      createdAt: "2025-04-13T23:58:00.000Z",
      // Sem ticketId, para mostrar a opção de criar chamado
    },
  ];
};

export const useAlerts = () => {
  // In a real app, this would be a proper API call
  const query = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
    initialData: getMockAlerts(),
  });

  return query;
};
