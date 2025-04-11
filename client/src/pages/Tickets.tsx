import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  PlusCircle, 
  TicketPlus, 
  Clock, 
  CheckCircle2, 
  User2, 
  AlertTriangle, 
  Crown, 
  Bell, 
  Phone, 
  Eye, 
  List,
  Building,
  FileText,
  Terminal,
  BarChart3,
  Code
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Definição do tipo para nível de atendimento
type ServiceLevelType = "standard" | "premium" | "vip";

export default function Tickets() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<{ 
    id: number, 
    title: string, 
    client: string, 
    serviceLevel: ServiceLevelType 
  }[]>([]);
  
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
      slaExpiration: "2h restantes",
      serviceLevel: "vip" as ServiceLevelType,
      hasNotification: true,
      slaNearExpiration: true
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
      slaExpiration: "4h restantes",
      serviceLevel: "premium" as ServiceLevelType,
      hasNotification: false,
      slaNearExpiration: true
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
      slaExpiration: "12h restantes",
      serviceLevel: "standard" as ServiceLevelType,
      hasNotification: false,
      slaNearExpiration: false
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
      slaExpiration: "3h restantes",
      serviceLevel: "vip" as ServiceLevelType,
      hasNotification: true,
      slaNearExpiration: true
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
      slaExpiration: "24h restantes",
      serviceLevel: "standard" as ServiceLevelType,
      hasNotification: false,
      slaNearExpiration: false
    }
  ];
  
  // Inicializar notificações (não mostramos mais alertas estáticos)
  useEffect(() => {
    // Não filtrar nenhum chamado para notificações estáticas
    // Iremos usar apenas notificações em tempo real via WebSocket
    
    // Inicializa com array vazio
    setNotifications([]);
  }, []);

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

  // Estado para gerenciar notificações fechadas
  const [closedNotifications, setClosedNotifications] = useState<number[]>([]);
  
  // Função para fechar uma notificação
  const closeNotification = (notificationId: number) => {
    setClosedNotifications((prev) => [...prev, notificationId]);
  };
  
  // Função para gerar a tag de nível de atendimento
  const getServiceLevelBadge = (serviceLevel: ServiceLevelType) => {
    switch (serviceLevel) {
      case "vip":
        return (
          <div className="flex items-center">
            <Badge className="bg-purple-100 text-purple-700 flex items-center gap-1">
              <Crown className="h-3 w-3" />
              VIP
            </Badge>
          </div>
        );
      case "premium":
        return <Badge className="bg-blue-100 text-blue-700">Premium</Badge>;
      case "standard":
        return <Badge className="bg-slate-100 text-slate-700">Standard</Badge>;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Alertas para chamados VIP */}
      {notifications.length > 0 && (
        <div className="mb-6">
          {notifications
            .filter(notification => !closedNotifications.includes(notification.id))
            .map((notification) => (
              <Alert key={notification.id} variant="destructive" className="mb-2 relative pr-10">
                <Bell className="h-4 w-4 mr-2" />
                <AlertTitle className="flex items-center gap-2">
                  Chamado VIP Aberto
                  {getServiceLevelBadge(notification.serviceLevel)}
                </AlertTitle>
                <AlertDescription>
                  Cliente {notification.client}: {notification.title}
                </AlertDescription>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full hover:bg-red-800"
                  onClick={() => closeNotification(notification.id)}
                >
                  <span className="sr-only">Fechar</span>
                  <span aria-hidden>×</span>
                </Button>
              </Alert>
            ))}
        </div>
      )}
      
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
            <div className="bg-red-50 p-2 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <Badge className="bg-red-100 text-red-700 hover:bg-red-200">3</Badge>
          </div>
          <h3 className="title text-lg mb-1">SLA Próximo</h3>
          <p className="caption">Chamados com prazo crítico</p>
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
        
        {/* Filtros para chamados recentes */}
        <div className="px-5 py-3 border-b border-slate-100 flex flex-wrap gap-3 items-center">
          <div className="flex items-center">
            <List className="h-4 w-4 text-slate-500 mr-2" />
            <span className="text-xs text-slate-500 mr-2">Filtros:</span>
          </div>
          
          <div className="flex items-center flex-grow flex-wrap gap-2">
            {/* Filtro por Número do Chamado */}
            <div className="relative min-w-[140px] max-w-[200px]">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Nº do Chamado"
                className="pl-8 py-1 h-8 text-sm"
              />
            </div>
            
            {/* Filtro por Cliente */}
            <div className="min-w-[180px] max-w-[250px]">
              <Select>
                <SelectTrigger className="h-8 text-sm border-slate-200">
                  <div className="flex items-center">
                    <Building className="h-3.5 w-3.5 text-slate-500 mr-2" />
                    <SelectValue placeholder="Cliente" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os clientes</SelectItem>
                  <SelectItem value="empresa-abc">Empresa ABC</SelectItem>
                  <SelectItem value="empresa-xyz">Empresa XYZ</SelectItem>
                  <SelectItem value="empresa-def">Empresa DEF</SelectItem>
                  <SelectItem value="empresa-ghi">Empresa GHI</SelectItem>
                  <SelectItem value="empresa-jkl">Empresa JKL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Filtro por Contrato */}
            <div className="min-w-[180px] max-w-[250px]">
              <Select>
                <SelectTrigger className="h-8 text-sm border-slate-200">
                  <div className="flex items-center">
                    <FileText className="h-3.5 w-3.5 text-slate-500 mr-2" />
                    <SelectValue placeholder="Contrato" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os contratos</SelectItem>
                  <SelectItem value="suporte">Suporte 24x7</SelectItem>
                  <SelectItem value="monitoramento">Monitoramento</SelectItem>
                  <SelectItem value="backup">Backup & Recovery</SelectItem>
                  <SelectItem value="consultoria">Consultoria</SelectItem>
                  <SelectItem value="infraestrutura">Infraestrutura</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Botão de Aplicar Filtros */}
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs px-3 border-slate-200 text-slate-600"
            >
              Aplicar
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs px-3 text-slate-500"
            >
              Limpar
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-200">
                <TableHead className="text-xs text-slate-500 uppercase font-medium">ID</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Título</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Cliente</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Ativo</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Nível</TableHead>
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {ticket.slaNearExpiration && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-block">
                                <Clock className="h-4 w-4 text-red-500" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>SLA: {ticket.slaExpiration}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {ticket.title}
                    </div>
                  </TableCell>
                  <TableCell>{ticket.client}</TableCell>
                  <TableCell>{ticket.asset}</TableCell>
                  <TableCell>{getServiceLevelBadge(ticket.serviceLevel)}</TableCell>
                  <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                  <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                  <TableCell>{ticket.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Detalhes</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ver detalhes</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-800 hover:bg-green-50">
                              <Phone className="h-4 w-4" />
                              <span className="sr-only">Ligar</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ligar para cliente</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-purple-600 hover:text-purple-800 hover:bg-purple-50">
                              <Terminal className="h-4 w-4" />
                              <span className="sr-only">Acesso SSH</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Acesso SSH ao ativo</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
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
