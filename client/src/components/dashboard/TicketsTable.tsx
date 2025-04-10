import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TicketIcon, User, Clock, ArrowUpRight } from "lucide-react";

export interface Ticket {
  id: number;
  title: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "closed";
  asset: string;
  client: string;
  assignee?: string;
  createdAt: string;
  slaExpiration?: string;
}

interface TicketsTableProps {
  tickets: Ticket[];
  loading: boolean;
  slaExpiring?: boolean;
}

export default function TicketsTable({ tickets, loading, slaExpiring = false }: TicketsTableProps) {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge className="bg-red-100 text-red-700">Crítico</Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-700">Alto</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-700">Médio</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-700">Baixo</Badge>;
      default:
        return <Badge className="bg-slate-100">Indefinido</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-100 text-blue-700">Aberto</Badge>;
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-700">Em Andamento</Badge>;
      case "resolved":
        return <Badge className="bg-green-100 text-green-700">Resolvido</Badge>;
      case "closed":
        return <Badge className="bg-slate-100 text-slate-700">Fechado</Badge>;
      default:
        return <Badge className="bg-slate-100">Indefinido</Badge>;
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-yellow-50 p-2 rounded-lg mr-3">
            <TicketIcon className="h-5 w-5 text-yellow-600" />
          </div>
          <h3 className="title text-lg">
            {slaExpiring ? "Chamados com SLA Próximo" : "Chamados Recentes"}
          </h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-green-700 hover:text-green-800 hover:bg-green-50 -mr-2"
        >
          Ver todos
        </Button>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="animate-pulse h-12 bg-slate-100 rounded-md"></div>
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="flex items-center justify-center h-64 p-5">
            <p className="text-slate-500">
              {slaExpiring 
                ? "Não há chamados com SLA próximo do vencimento" 
                : "Não há chamados recentes"}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Título</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cliente</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Prioridade</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                {slaExpiring && (
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">SLA</th>
                )}
                <th className="px-5 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 text-sm text-slate-800">#{ticket.id}</td>
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-slate-800">{ticket.title}</div>
                    <div className="text-xs text-slate-500">{ticket.asset}</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-800">{ticket.client}</td>
                  <td className="px-5 py-4 text-sm">{getPriorityBadge(ticket.priority)}</td>
                  <td className="px-5 py-4 text-sm">{getStatusBadge(ticket.status)}</td>
                  {slaExpiring && ticket.slaExpiration && (
                    <td className="px-5 py-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-sm text-red-500">{ticket.slaExpiration}</span>
                      </div>
                    </td>
                  )}
                  <td className="px-5 py-4 text-right">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}