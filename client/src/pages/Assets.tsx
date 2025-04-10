import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Server, AlertTriangle, ArrowUpRight, TicketPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Assets() {
  const [searchTerm, setSearchTerm] = useState("");

  // Dados de exemplo para ativos com alertas
  const assetsWithAlerts = [
    {
      id: 1, 
      name: "SRV-WEB-01", 
      type: "Servidor", 
      client: "Empresa ABC", 
      alertCount: 3, 
      criticality: "high",
      status: "active"
    },
    {
      id: 2, 
      name: "FW-MAIN-01", 
      type: "Firewall", 
      client: "Tech Solutions", 
      alertCount: 2, 
      criticality: "medium",
      status: "active"
    },
    {
      id: 3, 
      name: "DB-SQL-03", 
      type: "Banco de Dados", 
      client: "Empresa XYZ", 
      alertCount: 1, 
      criticality: "low",
      status: "active"
    },
    {
      id: 4, 
      name: "STORAGE-01", 
      type: "Storage", 
      client: "Global Services", 
      alertCount: 4, 
      criticality: "critical",
      status: "maintenance"
    },
  ];

  // Dados de exemplo para alertas recentes
  const recentAlerts = [
    {
      id: 101,
      asset: "SRV-WEB-01",
      client: "Empresa ABC",
      message: "CPU acima de 90%",
      severity: "critical",
      time: "12m atrás",
      ticketId: 1001
    },
    {
      id: 102,
      asset: "FW-MAIN-01",
      client: "Tech Solutions",
      message: "Pacotes descartados",
      severity: "medium",
      time: "25m atrás",
      ticketId: undefined
    },
    {
      id: 103,
      asset: "DB-SQL-03",
      client: "Empresa XYZ",
      message: "Lentidão em queries",
      severity: "medium",
      time: "43m atrás",
      ticketId: 1003
    },
    {
      id: 104,
      asset: "STORAGE-01",
      client: "Global Services",
      message: "Disco com erro de leitura",
      severity: "critical",
      time: "1h 5m atrás",
      ticketId: 1004
    },
  ];

  const getCriticalityBadge = (criticality: string) => {
    switch (criticality) {
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar ativos..."
            className="w-full pl-9 border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="w-full sm:w-auto bg-green-700 hover:bg-green-800">
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Ativo
        </Button>
      </div>

      {/* Ativos com mais alertas */}
      <div className="card overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-red-50 p-2 rounded-lg mr-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="title text-lg">Ativos com Mais Alertas</h3>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800"
          >
            Ver todos
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-200">
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Nome</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Tipo</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Cliente</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Alertas</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Criticidade</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assetsWithAlerts.map((asset) => (
                <TableRow key={asset.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell>{asset.type}</TableCell>
                  <TableCell>{asset.client}</TableCell>
                  <TableCell>
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-200">
                      {asset.alertCount} {asset.alertCount === 1 ? 'alerta' : 'alertas'}
                    </Badge>
                  </TableCell>
                  <TableCell>{getCriticalityBadge(asset.criticality)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      <ArrowUpRight className="mr-1 h-4 w-4" />
                      Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Últimos alertas gerados */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-yellow-50 p-2 rounded-lg mr-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <h3 className="title text-lg">Últimos Alertas Gerados</h3>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800"
          >
            Ver todos
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-200">
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Ativo</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Cliente</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Mensagem</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Severidade</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Tempo</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium text-right">Chamado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAlerts.map((alert) => (
                <TableRow key={alert.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <TableCell className="font-medium">{alert.asset}</TableCell>
                  <TableCell>{alert.client}</TableCell>
                  <TableCell>{alert.message}</TableCell>
                  <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
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
