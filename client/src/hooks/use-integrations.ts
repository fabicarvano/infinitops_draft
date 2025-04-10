import { useQuery } from "@tanstack/react-query";
import { Integration } from "@/components/dashboard/IntegrationStatus";

export const useIntegrations = () => {
  return useQuery<{ integrations: Integration[] }>({
    queryKey: ["/api/integrations"],
    initialData: {
      integrations: [
        {
          id: 1,
          name: "Zabbix",
          type: "Monitoramento",
          status: "connected",
          lastCheck: "2023-04-09T12:34:56Z"
        },
        {
          id: 2,
          name: "GLPI",
          type: "Service Desk",
          status: "connected",
          lastCheck: "2023-04-09T10:20:30Z"
        },
        {
          id: 3,
          name: "PABX",
          type: "Telefonia",
          status: "disconnected",
          lastCheck: "2023-04-08T15:45:12Z"
        }
      ]
    }
  });
};