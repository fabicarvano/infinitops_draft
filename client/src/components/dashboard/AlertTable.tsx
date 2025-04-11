import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertTriangle, TicketPlus, ArrowUpRight } from "lucide-react";

type AlertSeverity = "critical" | "medium" | "low";

interface Alert {
  id: number;
  status: AlertSeverity;
  client: string;
  asset: string;
  message: string;
  time: string;
  ticketId?: number;
}

interface AlertTableProps {
  alerts: Alert[];
  loading: boolean;
}

export default function AlertTable({ alerts, loading }: AlertTableProps) {
  const getSeverityBadgeStyle = (severity: AlertSeverity) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-700 hover:bg-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200";
      default:
        return "bg-slate-100 text-slate-700 hover:bg-slate-200";
    }
  };

  const handleGoToTicket = (ticketId?: number) => {
    if (ticketId) {
      alert(`Redirecionando para o chamado #${ticketId}`);
    } else {
      alert("Criando um novo chamado para este alerta");
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-red-50 p-2 rounded-lg mr-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <h3 className="title text-lg">Alertas Ativos</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-green-700 hover:text-green-800 hover:bg-green-50 -mr-2"
        >
          Ver todos
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-[650px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-slate-200">
              <TableHead className="text-xs text-slate-500 uppercase font-medium px-4 w-[90px]">Status</TableHead>
              <TableHead className="text-xs text-slate-500 uppercase font-medium w-[120px]">Cliente</TableHead>
              <TableHead className="text-xs text-slate-500 uppercase font-medium w-[120px]">Ativo</TableHead>
              <TableHead className="text-xs text-slate-500 uppercase font-medium">Mensagem</TableHead>
              <TableHead className="text-xs text-slate-500 uppercase font-medium w-[100px]">Tempo</TableHead>
              <TableHead className="text-xs text-slate-500 uppercase font-medium text-right w-[140px]">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-slate-500">
                  Carregando alertas...
                </TableCell>
              </TableRow>
            ) : alerts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-slate-500">
                  Nenhum alerta encontrado
                </TableCell>
              </TableRow>
            ) : (
              alerts.map((alert) => (
                <TableRow key={alert.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <TableCell className="px-4">
                    <Badge className={getSeverityBadgeStyle(alert.status)}>
                      {alert.status === "critical" && "Crítico"}
                      {alert.status === "medium" && "Médio"}
                      {alert.status === "low" && "Baixo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-700">{alert.client}</TableCell>
                  <TableCell className="text-sm text-slate-600">{alert.asset}</TableCell>
                  <TableCell className="text-sm text-slate-600">{alert.message}</TableCell>
                  <TableCell className="text-sm text-slate-500">{alert.time}</TableCell>
                  <TableCell className="text-sm text-right">
                    <Button 
                      size="sm" 
                      variant={alert.ticketId ? "outline" : "default"}
                      className={
                        alert.ticketId 
                          ? "text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-800" 
                          : "bg-green-700 hover:bg-green-800"
                      }
                      onClick={() => handleGoToTicket(alert.ticketId)}
                    >
                      {alert.ticketId ? (
                        <>
                          <ArrowUpRight className="mr-1 h-4 w-4" />
                          Chamado #{alert.ticketId}
                        </>
                      ) : (
                        <>
                          <TicketPlus className="mr-1 h-4 w-4" />
                          Criar Chamado
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
