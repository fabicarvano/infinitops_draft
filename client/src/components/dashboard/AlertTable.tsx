import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight } from "lucide-react";

type AlertSeverity = "critical" | "medium" | "low";

interface Alert {
  id: number;
  status: AlertSeverity;
  client: string;
  asset: string;
  message: string;
  time: string;
}

interface AlertTableProps {
  alerts: Alert[];
  loading: boolean;
}

export default function AlertTable({ alerts, loading }: AlertTableProps) {
  const getSeverityBadgeStyle = (severity: AlertSeverity) => {
    switch (severity) {
      case "critical":
        return "status-critical border";
      case "medium":
        return "status-warning border";
      case "low":
        return "status-info border";
      default:
        return "status-info border";
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="title text-lg">Alertas Recentes</h3>
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
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-slate-200">
              <TableHead className="text-xs text-slate-500 uppercase font-medium px-4">Status</TableHead>
              <TableHead className="text-xs text-slate-500 uppercase font-medium">Cliente</TableHead>
              <TableHead className="text-xs text-slate-500 uppercase font-medium">Ativo</TableHead>
              <TableHead className="text-xs text-slate-500 uppercase font-medium">Mensagem</TableHead>
              <TableHead className="text-xs text-slate-500 uppercase font-medium">Tempo</TableHead>
              <TableHead className="text-xs text-slate-500 uppercase font-medium">Ação</TableHead>
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
                  <TableCell className="text-sm">
                    <Button size="icon" variant="ghost" className="text-slate-400 hover:text-green-700 hover:bg-green-50 h-8 w-8">
                      <ExternalLink className="h-4 w-4" />
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
