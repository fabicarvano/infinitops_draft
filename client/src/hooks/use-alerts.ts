import { useQuery } from "@tanstack/react-query";

type AlertSeverity = "critical" | "medium" | "low";

export interface Alert {
  id: number;
  status: AlertSeverity;
  client: string;
  asset: string;
  message: string;
  time: string;
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
    },
    {
      id: 2,
      status: "medium",
      client: "Empresa ABC",
      asset: "RTR-EDGE-03",
      message: "Tráfego acima do normal",
      time: "27m atrás",
    },
    {
      id: 3,
      status: "critical",
      client: "Tech Solutions",
      asset: "SRV-WEB02",
      message: "Serviço Apache indisponível",
      time: "43m atrás",
    },
    {
      id: 4,
      status: "medium",
      client: "Empresa XYZ",
      asset: "NAS-BACKUP",
      message: "Falha no backup noturno",
      time: "1h 12m atrás",
    },
    {
      id: 5,
      status: "low",
      client: "Empresa DEF",
      asset: "RTR-CORE-01",
      message: "Latência elevada",
      time: "1h 38m atrás",
    },
  ];
};

export const useAlerts = () => {
  // In a real app, this would be a proper API call
  const query = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
    queryFn: async () => {
      try {
        // In development, use mock data to simulate API response
        if (process.env.NODE_ENV === "development") {
          return getMockAlerts();
        }

        // In production, this would make a real API call
        const response = await fetch("/api/alerts");
        if (!response.ok) throw new Error("Failed to fetch alerts");
        return await response.json();
      } catch (error) {
        console.error("Error fetching alerts:", error);
        return [];
      }
    },
  });

  return query;
};
