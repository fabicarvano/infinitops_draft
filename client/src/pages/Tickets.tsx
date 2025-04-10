import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, PlusCircle, TicketPlus, Clock, CheckCircle2, User2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Tickets() {
  const [searchTerm, setSearchTerm] = useState("");

  // Dados de exemplo para chamados
  const tickets = [
    {
      id: 1001,
      title: "Servidor não responde a ping",
      status: "open",
      priority: "critical",
      client: "Empresa ABC",
      asset: "SRV-WEB-01",
      assignee: "Técnico 1",
      createdAt: "09/04/2023 08:30",
      slaExpiration: "2h restantes"
    },
    {
      id: 1002,
      title: "Lentidão no acesso ao banco de dados",
      status: "in_progress",
      priority: "high",
      client: "Empresa XYZ",
      asset: "DB-SQL-03",
      assignee: "Técnico 2",
      createdAt: "08/04/2023 14:45",
      slaExpiration: "4h restantes"
    },
    {
      id: 1003,
      title: "Firewall apresentando logs de erro",
      status: "open",
      priority: "medium",
      client: "Empresa DEF",
      asset: "FW-MAIN-01",
      assignee: null,
      createdAt: "09/04/2023 10:15",
      slaExpiration: "12h restantes"
    },
    {
      id: 1004,
      title: "Backup não completado",
      status: "open",
      priority: "high",
      client: "Empresa GHI",
      asset: "STORAGE-01",
      assignee: "Técnico 3",
      createdAt: "09/04/2023 07:00",
      slaExpiration: "3h restantes"
    },
    {
      id: 1005,
      title: "Switch com porta em erro",
      status: "open",
      priority: "low",
      client: "Empresa JKL",
      asset: "SW-FLOOR-02",
      assignee: null,
      createdAt: "08/04/2023 16:30",
      slaExpiration: "24h restantes"
    }
  ];

  // Chamados com SLA próximo (prioridade crítica ou alta)
  const slaExpiringTickets = tickets.filter(
    ticket => ticket.priority === "critical" || ticket.priority === "high"
  );

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
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar chamados..."
            className="w-full pl-9 border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto border-green-700 text-green-700 hover:bg-green-50"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
          <Button className="w-full sm:w-auto bg-green-700 hover:bg-green-800">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Chamado
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-yellow-50 p-2 rounded-lg">
              <TicketPlus className="h-5 w-5 text-yellow-600" />
            </div>
            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">5</Badge>
          </div>
          <h3 className="title text-lg mb-1">Em Aberto</h3>
          <p className="caption">Chamados que aguardam ação</p>
        </div>
        
        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">3</Badge>
          </div>
          <h3 className="title text-lg mb-1">Em Progresso</h3>
          <p className="caption">Chamados em andamento</p>
        </div>
        
        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-green-50 p-2 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-200">12</Badge>
          </div>
          <h3 className="title text-lg mb-1">Resolvidos</h3>
          <p className="caption">Chamados concluídos</p>
        </div>
        
        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-purple-50 p-2 rounded-lg">
              <User2 className="h-5 w-5 text-purple-600" />
            </div>
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">4</Badge>
          </div>
          <h3 className="title text-lg mb-1">Meus Chamados</h3>
          <p className="caption">Atribuídos a você</p>
        </div>
      </div>
      
      {/* Tabela de Chamados Recentes */}
      <div className="card overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-yellow-50 p-2 rounded-lg mr-3">
              <TicketPlus className="h-5 w-5 text-yellow-600" />
            </div>
            <h3 className="title text-lg">Chamados Recentes</h3>
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
                <TableHead className="text-xs text-slate-500 uppercase font-medium">ID</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Título</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Cliente</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Ativo</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Prioridade</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Status</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Data</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <TableCell className="font-medium">#{ticket.id}</TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>{ticket.client}</TableCell>
                  <TableCell>{ticket.asset}</TableCell>
                  <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                  <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                  <TableCell>{ticket.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Chamados com SLA próximo */}
      <div className="card overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-red-50 p-2 rounded-lg mr-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="title text-lg">Chamados com SLA Próximo</h3>
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
                <TableHead className="text-xs text-slate-500 uppercase font-medium">ID</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Título</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Cliente</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Prioridade</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Status</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">SLA</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Atribuído</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slaExpiringTickets.map((ticket) => (
                <TableRow key={ticket.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <TableCell className="font-medium">#{ticket.id}</TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>{ticket.client}</TableCell>
                  <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                  <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-sm text-red-500">{ticket.slaExpiration}</span>
                    </div>
                  </TableCell>
                  <TableCell>{ticket.assignee || "Não atribuído"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-200 hover:text-blue-800 hover:bg-blue-50"
                    >
                      Assumir
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
