import { useQuery } from "@tanstack/react-query";

export interface SLAMetric {
  name: string;
  value: string;
  color: string;
}

export interface SLAChartData {
  name: string;
  value: number;
}

// This is a temporary function to provide sample data
// In a real application, this would fetch from the API
const getMockSLAData = () => {
  const metrics: SLAMetric[] = [
    {
      name: "Uptime Geral",
      value: "98.7%",
      color: "text-emerald-500",
    },
    {
      name: "SLA Chamados",
      value: "93.2%",
      color: "text-amber-500",
    },
    {
      name: "Tempo Médio",
      value: "24m",
      color: "text-primary-500",
    },
  ];

  const chartData: SLAChartData[] = [
    { name: "Jan", value: 99 },
    { name: "Fev", value: 98 },
    { name: "Mar", value: 97 },
    { name: "Abr", value: 99 },
    { name: "Mai", value: 98 },
    { name: "Jun", value: 96 },
    { name: "Jul", value: 97 },
    { name: "Ago", value: 99 },
    { name: "Set", value: 98 },
    { name: "Out", value: 97 },
    { name: "Nov", value: 95 },
    { name: "Dez", value: 94 },
  ];

  return { metrics, chartData };
};

export const useSLA = () => {
  // In a real app, this would be a proper API call
  const query = useQuery({
    queryKey: ["/api/sla"],
    queryFn: async () => {
      try {
        // In development, use mock data to simulate API response
        if (process.env.NODE_ENV === "development") {
          return getMockSLAData();
        }

        // In production, this would make a real API call
        const response = await fetch("/api/sla");
        if (!response.ok) throw new Error("Failed to fetch SLA data");
        return await response.json();
      } catch (error) {
        console.error("Error fetching SLA data:", error);
        return { metrics: [], chartData: [] };
      }
    },
  });

  return query;
};
