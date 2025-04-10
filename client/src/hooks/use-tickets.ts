import { useQuery } from "@tanstack/react-query";
import { Ticket } from "@/components/dashboard/TicketsTable";

const ticketsMockData: Ticket[] = [
  {
    id: 1001,
    title: "Servidor não responde a ping",
    priority: "critical",
    status: "open",
    asset: "SRV-WEB-01",
    client: "Empresa ABC",
    assignee: "Técnico 1",
    createdAt: "2023-04-09T08:30:00Z",
    slaExpiration: "2h restantes"
  },
  {
    id: 1002,
    title: "Lentidão no acesso ao banco de dados",
    priority: "high",
    status: "in_progress",
    asset: "DB-SQL-03",
    client: "Empresa XYZ",
    assignee: "Técnico 2",
    createdAt: "2023-04-08T14:45:00Z",
    slaExpiration: "4h restantes"
  },
  {
    id: 1003,
    title: "Firewall apresentando logs de erro",
    priority: "medium",
    status: "open",
    asset: "FW-MAIN-01",
    client: "Empresa DEF",
    assignee: undefined,
    createdAt: "2023-04-09T10:15:00Z",
    slaExpiration: "12h restantes"
  },
  {
    id: 1004,
    title: "Backup não completado",
    priority: "high",
    status: "open",
    asset: "STORAGE-01",
    client: "Empresa GHI",
    assignee: "Técnico 3",
    createdAt: "2023-04-09T07:00:00Z",
    slaExpiration: "3h restantes"
  },
  {
    id: 1005,
    title: "Switch com porta em erro",
    priority: "low",
    status: "open",
    asset: "SW-FLOOR-02",
    client: "Empresa JKL",
    assignee: undefined,
    createdAt: "2023-04-08T16:30:00Z",
    slaExpiration: "24h restantes"
  }
];

export const useTickets = (type: "recent" | "sla-expiring" = "recent") => {
  return useQuery<{ tickets: Ticket[] }>({
    queryKey: ["/api/tickets", type],
    initialData: {
      tickets: type === "sla-expiring" 
        ? ticketsMockData.filter(ticket => ticket.priority === "critical" || ticket.priority === "high")
        : ticketsMockData
    }
  });
};