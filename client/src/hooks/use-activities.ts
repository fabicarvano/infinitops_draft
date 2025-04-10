import { useQuery } from "@tanstack/react-query";
import { ActivityType } from "@/components/dashboard/ActivityFeed";

export interface Activity {
  id: number;
  type: ActivityType;
  content: {
    item: string;
    subject: string;
  };
  time: string;
}

// This is a temporary function to provide sample data
// In a real application, this would fetch from the API
const getMockActivities = (): Activity[] => {
  return [
    {
      id: 1,
      type: "ticket_created",
      content: {
        item: "#38721",
        subject: "Empresa XYZ",
      },
      time: "há 14 minutos",
    },
    {
      id: 2,
      type: "ticket_resolved",
      content: {
        item: "#38719",
        subject: "João Silva",
      },
      time: "há 27 minutos",
    },
    {
      id: 3,
      type: "alert_generated",
      content: {
        item: "#1298",
        subject: "SRV-DB01",
      },
      time: "há 42 minutos",
    },
    {
      id: 4,
      type: "ticket_assigned",
      content: {
        item: "#38718",
        subject: "Maria Costa",
      },
      time: "há 1 hora",
    },
    {
      id: 5,
      type: "asset_added",
      content: {
        item: "RTR-EDGE-04",
        subject: "Empresa ABC",
      },
      time: "há 1 hora e 15 minutos",
    },
  ];
};

export const useActivities = () => {
  // In a real app, this would be a proper API call
  const query = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
    queryFn: async () => {
      try {
        // In development, use mock data to simulate API response
        if (process.env.NODE_ENV === "development") {
          return getMockActivities();
        }

        // In production, this would make a real API call
        const response = await fetch("/api/activities");
        if (!response.ok) throw new Error("Failed to fetch activities");
        return await response.json();
      } catch (error) {
        console.error("Error fetching activities:", error);
        return [];
      }
    },
  });

  return query;
};
