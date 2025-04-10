import { useQuery } from "@tanstack/react-query";

type AlertSeverity = "critical" | "medium" | "low";

export interface Alert {
  id: number;
  status: AlertSeverity;
  client: string;
  asset: string;
  message: string;
  time: string;
  ticketId?: number;
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
      message: "Disco crítico (98%)",
      time: "12m atrás",
      ticketId: 1001
    },
    {
      id: 2,
      status: "medium",
      client: "Empresa ABC",
      asset: "RTR-EDGE-03",
      message: "Tráfego acima do normal",
      time: "27m atrás",
      ticketId: 1002
    },
    {
      id: 3,
      status: "critical",
      client: "Tech Solutions",
      asset: "SRV-WEB02",
      message: "Serviço Apache indisponível",
      time: "43m atrás",
      // Sem ticketId, para mostrar a opção de criar chamado
    },
    {
      id: 4,
      status: "medium",
      client: "Empresa XYZ",
      asset: "NAS-BACKUP",
      message: "Falha no backup noturno",
      time: "1h 12m atrás",
      ticketId: 1004
    },
    {
      id: 5,
      status: "low",
      client: "Empresa DEF",
      asset: "RTR-CORE-01",
      message: "Latência elevada",
      time: "1h 38m atrás",
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
