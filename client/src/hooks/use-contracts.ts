import { useQuery } from "@tanstack/react-query";

export interface Contract {
  id: number;
  client: string;
  type: string;
  daysLeft: number;
  status: "critical" | "warning";
}

// This is a temporary function to provide sample data
// In a real application, this would fetch from the API
const getMockContractsData = () => {
  const contracts: Contract[] = [
    {
      id: 1,
      client: "Tech Solutions",
      type: "Suporte Premium + Monitoramento",
      daysLeft: 7,
      status: "critical",
    },
    {
      id: 2,
      client: "Empresa XYZ",
      type: "Suporte Básico",
      daysLeft: 15,
      status: "warning",
    },
    {
      id: 3,
      client: "DataSys",
      type: "Suporte Premium",
      daysLeft: 23,
      status: "warning",
    },
    {
      id: 4,
      client: "InfoTech",
      type: "Monitoramento",
      daysLeft: 28,
      status: "warning",
    },
    {
      id: 5,
      client: "CloudServe",
      type: "Suporte + Backup",
      daysLeft: 30,
      status: "warning",
    },
  ];

  const expiringCount = contracts.length;

  return { contracts, expiringCount };
};

export const useContracts = () => {
  // In a real app, this would be a proper API call
  const query = useQuery({
    queryKey: ["/api/contracts/expiring"],
    queryFn: async () => {
      try {
        // In development, use mock data to simulate API response
        if (process.env.NODE_ENV === "development") {
          return getMockContractsData();
        }

        // In production, this would make a real API call
        const response = await fetch("/api/contracts/expiring");
        if (!response.ok) throw new Error("Failed to fetch contracts data");
        return await response.json();
      } catch (error) {
        console.error("Error fetching contracts data:", error);
        return { contracts: [], expiringCount: 0 };
      }
    },
  });

  return query;
};
