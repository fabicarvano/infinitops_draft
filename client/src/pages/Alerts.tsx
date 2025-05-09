import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, AlertTriangle, Bell, TicketPlus, ArrowUpRight, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Alerts() {
  const [searchTerm, setSearchTerm] = useState("");

  // Dados de exemplo para alertas
  const alerts = [
    {
      id: 1,
      status: "critical",
      client: "Empresa XYZ",
      asset: "SRV-DB01",
      message: "Disco crítico (98%)",
      time: "12m atrás",
      ticketId: 1001
    },
    {
      id: 2,
      status: "medium",
      client: "Empresa ABC",
      asset: "RTR-EDGE-03",
      message: "Tráfego acima do normal",
      time: "27m atrás",
      ticketId: undefined
    },
    {
      id: 3,
      status: "critical",
      client: "Tech Solutions",
      asset: "SRV-WEB02",
      message: "Serviço Apache indisponível",
      time: "43m atrás",
      ticketId: undefined
    },
    {
      id: 4,
      status: "medium",
      client: "Empresa XYZ",
      asset: "NAS-BACKUP",
      message: "Falha no backup noturno",
      time: "1h 12m atrás",
      ticketId: 1004
    },
    {
      id: 5,
      status: "low",
      client: "Empresa DEF",
      asset: "RTR-CORE-01",
      message: "Latência elevada",
      time: "1h 38m atrás",
      ticketId: undefined
    },
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-100 text-red-700">Crítico</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-700">Médio</Badge>;
      case "low":
        return <Badge className="bg-blue-100 text-blue-700">Baixo</Badge>;
      default:
        return <Badge className="bg-slate-100">Indefinido</Badge>;
    }
  };

  const handleGoToTicket = (ticketId?: number) => {
    if (ticketId) {
      alert(`Redirecionando para o chamado #${ticketId}`);
    } else {
      alert("Criando um novo chamado para este alerta");
    }
  };

  // Calcular alertas sem chamados
  const alertsWithoutTickets = alerts.filter(alert => !alert.ticketId);
  const alertsWithoutTicketsCount = alertsWithoutTickets.length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar alertas..."
            className="w-full pl-9 border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          className="w-full sm:w-auto border-green-700 text-green-700 hover:bg-green-50"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card overflow-hidden border-l-4 border-l-red-500">
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="bg-red-50 p-2 rounded-lg mr-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <Badge className="bg-red-100 text-red-700 mb-1">Crítico</Badge>
                  <h3 className="font-medium">2 alertas críticos</h3>
                </div>
              </div>
            </div>
            <p className="text-slate-500 text-sm mb-4">
              Alertas que precisam de atenção imediata
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full border-red-200 text-red-700 hover:bg-red-50"
            >
              Ver alertas críticos
            </Button>
          </div>
        </div>
        
        <div className="card overflow-hidden border-l-4 border-l-yellow-500">
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="bg-yellow-50 p-2 rounded-lg mr-3">
                  <Bell className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <Badge className="bg-yellow-100 text-yellow-700 mb-1">Médio</Badge>
                  <h3 className="font-medium">3 alertas de atenção</h3>
                </div>
              </div>
            </div>
            <p className="text-slate-500 text-sm mb-4">
              Alertas que precisam ser monitorados
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full border-yellow-200 text-yellow-700 hover:bg-yellow-50"
            >
              Ver alertas de atenção
            </Button>
          </div>
        </div>

        {/* Novo card: Alertas sem Chamados */}
        <div className="card overflow-hidden border-l-4 border-l-blue-500">
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="bg-blue-50 p-2 rounded-lg mr-3">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <Badge className="bg-blue-100 text-blue-700 mb-1">Pendentes</Badge>
                  <h3 className="font-medium">{alertsWithoutTicketsCount} alertas sem chamados</h3>
                </div>
              </div>
            </div>
            <p className="text-slate-500 text-sm mb-4">
              Alertas que precisam de abertura de chamado
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              Ver alertas sem chamados
            </Button>
          </div>
        </div>
      </div>
      
      {/* Tabela de Alertas Ativos */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-red-50 p-2 rounded-lg mr-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="title text-lg">Alertas Ativos</h3>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800"
          >
            Atualizar
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-200">
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Severidade</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Cliente</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Ativo</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Mensagem</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Tempo</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <TableCell>{getSeverityBadge(alert.status)}</TableCell>
                  <TableCell className="font-medium">{alert.client}</TableCell>
                  <TableCell>{alert.asset}</TableCell>
                  <TableCell>{alert.message}</TableCell>
                  <TableCell>{alert.time}</TableCell>
                  <TableCell className="text-right">
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
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
