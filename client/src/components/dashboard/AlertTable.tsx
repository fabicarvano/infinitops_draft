import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

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
        return "bg-red-500/20 hover:bg-red-500/30 text-red-500";
      case "medium":
        return "bg-amber-500/20 hover:bg-amber-500/30 text-amber-500";
      case "low":
        return "bg-blue-500/20 hover:bg-blue-500/30 text-blue-500";
      default:
        return "bg-blue-500/20 hover:bg-blue-500/30 text-blue-500";
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="border-b border-slate-700 px-4 py-3">
        <CardTitle className="text-base font-semibold">Alertas Recentes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-transparent">
                <TableHead className="text-xs text-slate-400 uppercase">Status</TableHead>
                <TableHead className="text-xs text-slate-400 uppercase">Cliente</TableHead>
                <TableHead className="text-xs text-slate-400 uppercase">Ativo</TableHead>
                <TableHead className="text-xs text-slate-400 uppercase">Mensagem</TableHead>
                <TableHead className="text-xs text-slate-400 uppercase">Tempo</TableHead>
                <TableHead className="text-xs text-slate-400 uppercase">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Carregando alertas...
                  </TableCell>
                </TableRow>
              ) : alerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Nenhum alerta encontrado
                  </TableCell>
                </TableRow>
              ) : (
                alerts.map((alert) => (
                  <TableRow key={alert.id} className="border-slate-700">
                    <TableCell>
                      <Badge variant="outline" className={getSeverityBadgeStyle(alert.status)}>
                        {alert.status === "critical" && "Crítico"}
                        {alert.status === "medium" && "Médio"}
                        {alert.status === "low" && "Baixo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{alert.client}</TableCell>
                    <TableCell className="text-sm">{alert.asset}</TableCell>
                    <TableCell className="text-sm">{alert.message}</TableCell>
                    <TableCell className="text-sm">{alert.time}</TableCell>
                    <TableCell className="text-sm">
                      <Button size="icon" variant="ghost" className="text-primary-500 hover:text-primary-400">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-center pb-4">
          <Button variant="link" className="text-primary-500 text-sm hover:text-primary-400">
            Ver todos os alertas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
