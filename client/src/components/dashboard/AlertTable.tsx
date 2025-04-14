import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  ArrowRight, 
  AlertTriangle, 
  TicketPlus, 
  ArrowUpRight, 
  Terminal, 
  Clock, 
  CalendarClock,
  ShieldCheck 
} from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

// Função para formatar a data de criação
export const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Função para calcular a diferença de tempo entre duas datas
export const calculateTimeDifference = (createdAt: string, ticketCreatedAt?: string) => {
  if (!ticketCreatedAt) return "-";
  
  const alertDate = new Date(createdAt);
  const ticketDate = new Date(ticketCreatedAt);
  const diffMs = ticketDate.getTime() - alertDate.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffMins < 1) return "< 1min";
  if (diffMins < 60) return `${diffMins}min`;
  
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return `${hours}h${mins ? ` ${mins}min` : ''}`;
};

type AlertSeverity = "critical" | "medium" | "low";

interface Alert {
  id: number;
  status: AlertSeverity;
  client: string;
  asset: string;
  assetId: number;
  message: string;
  time: string;
  ticketId?: number;
  createdAt: string;
  ticketCreatedAt?: string;
  sla?: string;
  isAutoTicket?: boolean;
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
  
  // Função para calcular o tempo decorrido entre alerta e criação do chamado
  const calculateTimeDifference = (alertCreatedAt: string, ticketCreatedAt?: string) => {
    if (!ticketCreatedAt) return null;
    
    const alertDate = new Date(alertCreatedAt);
    const ticketDate = new Date(ticketCreatedAt);
    
    const diffMs = ticketDate.getTime() - alertDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) {
      return `${diffMins}m`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}m`;
    }
  };
  
  // Formatar data/hora de criação
  const formatCreatedAt = (createdAt: string) => {
    const date = new Date(createdAt);
    return date.toLocaleString('pt-BR', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleGoToTicket = (ticketId?: number) => {
    if (ticketId) {
      alert(`Redirecionando para o chamado #${ticketId}`);
    } else {
      alert("Criando um novo chamado para este alerta");
    }
  };
  
  const handleRunScript = (alertId: number) => {
    alert(`Preparando execução de script para o alerta #${alertId}`);
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
        <Table className="min-w-[1000px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-slate-200">
              <TableHead className="text-xs text-slate-500 uppercase font-medium px-4 w-[90px]">Status</TableHead>
              <TableHead className="text-xs text-slate-500 uppercase font-medium w-[120px]">Cliente</TableHead>
              <TableHead className="text-xs text-slate-500 uppercase font-medium w-[120px]">Ativo</TableHead>
              <TableHead className="text-xs text-slate-500 uppercase font-medium">Mensagem</TableHead>
              <TableHead className="text-xs text-slate-500 uppercase font-medium w-[140px]">Criado em</TableHead>
              <TableHead className="text-xs text-slate-500 uppercase font-medium w-[100px]">Tempo</TableHead>
              <TableHead className="text-xs text-slate-500 uppercase font-medium w-[100px]">SLA</TableHead>
              <TableHead className="text-xs text-slate-500 uppercase font-medium w-[150px]">Tempo até Chamado</TableHead>
              <TableHead className="text-xs text-slate-500 uppercase font-medium text-right w-[180px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4 text-slate-500">
                  Carregando alertas...
                </TableCell>
              </TableRow>
            ) : alerts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4 text-slate-500">
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
                  <TableCell className="text-sm text-slate-600">
                    <Link href={`/assets/${alert.assetId}`} className="text-blue-600 hover:text-blue-800 hover:underline flex items-center">
                      {alert.asset}
                      <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{alert.message}</TableCell>
                  <TableCell className="text-sm text-slate-500">{formatCreatedAt(alert.createdAt)}</TableCell>
                  <TableCell className="text-sm text-slate-500">{alert.time}</TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {alert.sla ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center">
                              <ShieldCheck className="h-4 w-4 text-green-600 mr-1" />
                              <span>{alert.sla}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">SLA definido pelo contrato</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {alert.ticketId ? (
                      alert.isAutoTicket ? (
                        <Badge className="bg-purple-100 text-purple-700">Automático</Badge>
                      ) : (
                        <span className="text-slate-600">
                          {calculateTimeDifference(alert.createdAt, alert.ticketCreatedAt)}
                        </span>
                      )
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-700">Pendente</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-slate-500 hover:text-slate-800"
                              onClick={() => handleRunScript(alert.id)}
                            >
                              <Terminal className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Executar Script</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
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
                    </div>
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
