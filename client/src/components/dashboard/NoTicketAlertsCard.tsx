import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { AlertTriangle, ArrowRight, TicketPlus } from "lucide-react";

type AlertSeverity = "critical" | "medium" | "low";

interface Alert {
  id: number;
  status: AlertSeverity;
  client: string;
  asset: string;
  assetId: number;
  message: string;
  createdAt: string;
  time: string;
}

interface NoTicketAlertsCardProps {
  alerts: Alert[];
  loading: boolean;
}

export default function NoTicketAlertsCard({ alerts, loading }: NoTicketAlertsCardProps) {
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

  // Calcular tempo desde a criação do alerta
  const timeSinceCreation = (createdAt: string) => {
    const now = new Date();
    const alertDate = new Date(createdAt);
    const diffMs = now.getTime() - alertDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) {
      return `${diffMins}m atrás`;
    } else if (diffMins < 24 * 60) {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}m atrás`;
    } else {
      const days = Math.floor(diffMins / (24 * 60));
      return `${days}d atrás`;
    }
  };

  const handleCreateTicket = (alertId: number) => {
    alert(`Criando chamado para o alerta #${alertId}`);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2 pt-4 flex flex-row items-center justify-between">
        <div className="flex items-center">
          <div className="bg-yellow-50 p-2 rounded-lg mr-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          </div>
          <CardTitle className="text-lg">Alertas sem Chamados</CardTitle>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-green-700 hover:text-green-800 hover:bg-green-50"
        >
          Ver todos
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pb-3 pt-1">
        {loading ? (
          <div className="text-center py-8 text-slate-500">Carregando alertas...</div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-8 text-slate-500">Todos os alertas têm chamados</div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-200">
                  <TableHead className="text-xs text-slate-500 uppercase font-medium w-[80px]">Status</TableHead>
                  <TableHead className="text-xs text-slate-500 uppercase font-medium w-[100px]">Cliente</TableHead>
                  <TableHead className="text-xs text-slate-500 uppercase font-medium w-[100px]">Ativo</TableHead>
                  <TableHead className="text-xs text-slate-500 uppercase font-medium">Tempo</TableHead>
                  <TableHead className="text-xs text-slate-500 uppercase font-medium text-right w-[100px]">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.slice(0, 5).map((alert) => (
                  <TableRow key={alert.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <TableCell>
                      <Badge className={getSeverityBadgeStyle(alert.status)}>
                        {alert.status === "critical" && "Crítico"}
                        {alert.status === "medium" && "Médio"}
                        {alert.status === "low" && "Baixo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-700">{alert.client}</TableCell>
                    <TableCell className="text-sm text-slate-600">
                      <Link href={`/assets/${alert.assetId}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                        {alert.asset}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">{timeSinceCreation(alert.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        variant="default"
                        className="bg-green-700 hover:bg-green-800"
                        onClick={() => handleCreateTicket(alert.id)}
                      >
                        <TicketPlus className="mr-1 h-3 w-3" />
                        Chamado
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {alerts.length > 5 && (
              <div className="text-center mt-3">
                <span className="text-sm text-slate-500">
                  Exibindo 5 de {alerts.length} alertas sem chamados
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}