import { Clock, AlertTriangle, CheckCircle, TicketIcon, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface HistoryEntry {
  id: number;
  timestamp: string;
  action: "created" | "acknowledged" | "ticketAutoCreated" | "ticketManualCreated" | "resolved";
  user?: string;
  duration?: string; // Duração em que permaneceu neste status
}

interface EnhancedMonitoringHistoryProps {
  alertId: number;
  createdAt: string;
  history: HistoryEntry[];
  hasTicket: boolean;
  isAcknowledged: boolean;
  isResolved: boolean;
}

export default function EnhancedMonitoringHistory({
  alertId,
  createdAt,
  history,
  hasTicket,
  isAcknowledged,
  isResolved
}: EnhancedMonitoringHistoryProps) {
  // Ordenar histórico por timestamp
  const sortedHistory = [...history].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  const getActionDetails = (action: string) => {
    switch (action) {
      case "created":
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          label: "Alerta criado",
          color: "bg-blue-100 text-blue-800",
          description: "Alerta criado pelo sistema de monitoramento"
        };
      case "acknowledged":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          label: "Reconhecido",
          color: "bg-green-100 text-green-800",
          description: "Alerta reconhecido por operador"
        };
      case "ticketAutoCreated":
        return {
          icon: <TicketIcon className="h-4 w-4" />,
          label: "Chamado automático",
          color: "bg-purple-100 text-purple-800",
          description: "Chamado criado automaticamente pelo sistema"
        };
      case "ticketManualCreated":
        return {
          icon: <TicketIcon className="h-4 w-4" />,
          label: "Chamado manual",
          color: "bg-yellow-100 text-yellow-800",
          description: "Chamado criado manualmente por operador"
        };
      case "resolved":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          label: "Resolvido",
          color: "bg-green-100 text-green-800",
          description: "Problema resolvido no monitoramento"
        };
      default:
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          label: action,
          color: "bg-gray-100 text-gray-800",
          description: "Ação desconhecida"
        };
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Histórico Completo do Alerta #{alertId}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Timeline visual */}
          <div className="relative border-l border-gray-200 pl-8 ml-3 space-y-6">
            <div className="flex flex-col items-start">
              <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-blue-500"></div>
              <Badge variant="outline" className="bg-blue-100 text-blue-800 mb-1">
                Criação
              </Badge>
              <p className="text-sm">{format(new Date(createdAt), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}</p>
              <p className="text-xs text-gray-500 mt-1">Alerta detectado pelo sistema de monitoramento</p>
            </div>
            
            {sortedHistory.map((entry) => {
              const { icon, label, color, description } = getActionDetails(entry.action);
              
              return (
                <div key={entry.id} className="flex flex-col items-start">
                  <div className={`absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white ${
                    entry.action === "acknowledged" ? "bg-green-500" :
                    entry.action.includes("ticket") ? "bg-yellow-500" :
                    entry.action === "resolved" ? "bg-green-500" : "bg-gray-500"
                  }`}></div>
                  
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className={`${color} mb-1 flex items-center gap-1`}>
                      {icon}
                      <span>{label}</span>
                    </Badge>
                    
                    {entry.duration && (
                      <Badge variant="outline" className="bg-gray-100 text-gray-700 mb-1">
                        <Clock className="mr-1 h-3 w-3" />
                        {entry.duration}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm">{format(new Date(entry.timestamp), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {description}
                    {entry.user && ` por ${entry.user}`}
                  </p>
                </div>
              );
            })}
            
            {isResolved && !sortedHistory.some(h => h.action === "resolved") && (
              <div className="flex flex-col items-start">
                <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-green-500"></div>
                <Badge variant="outline" className="bg-green-100 text-green-800 mb-1 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>Resolvido</span>
                </Badge>
                <p className="text-sm">Sem data registrada</p>
                <p className="text-xs text-gray-500 mt-1">Problema resolvido no monitoramento</p>
              </div>
            )}
          </div>
          
          {/* Estado atual */}
          <div className="border-t pt-3 mt-3">
            <p className="text-sm font-medium mb-1">Estado Atual:</p>
            <div className="flex flex-wrap gap-2">
              {isResolved ? (
                <Badge className="bg-green-100 text-green-800">Resolvido</Badge>
              ) : isAcknowledged ? (
                <Badge className="bg-green-100 text-green-800">Reconhecido</Badge>
              ) : hasTicket ? (
                <Badge className="bg-yellow-100 text-yellow-800">Chamado Aberto</Badge>
              ) : (
                <Badge className="bg-blue-100 text-blue-800">Pendente</Badge>
              )}
              
              {hasTicket && (
                <Badge className="bg-purple-100 text-purple-800">
                  {sortedHistory.some(h => h.action === "ticketAutoCreated") ? "Chamado Automático" : "Chamado Manual"}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}