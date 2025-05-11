import { Clock, AlertTriangle, CheckCircle, Ticket } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipos de eventos simples que serão registrados no histórico
type ActionType = 
  | "criação" 
  | "chamado_automático" 
  | "chamado_manual" 
  | "reconhecimento" 
  | "resolução";

// Uma entrada de histórico simplificada
interface HistoryEntry {
  timestamp: string;
  action: ActionType;
  user: string;
  duration?: string;
}

// Props do componente
interface SimpleAlertHistoryProps {
  alertId: number;
  createdAt: string;
  status: "ativo" | "normalizado" | "flapping" | "reconhecido" | "suprimido";
  hasTicket: boolean;
  ticketType?: "automático" | "manual";
  ticketCreatedAt?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

export default function SimpleAlertHistory({
  alertId,
  createdAt,
  status,
  hasTicket,
  ticketType,
  ticketCreatedAt,
  acknowledgedAt,
  resolvedAt
}: SimpleAlertHistoryProps) {
  
  // Função para calcular a duração entre duas datas
  const calculateDuration = (start: string, end: string): string => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    
    if (diffHrs > 0) {
      return `${diffHrs}h ${diffMins % 60}m`;
    } else if (diffMins > 0) {
      return `${diffMins}m`;
    } else {
      return "<1m";
    }
  };
  
  // Construir o histórico baseado nas propriedades
  const history: HistoryEntry[] = [
    {
      timestamp: createdAt,
      action: "criação",
      user: "Sistema de Monitoramento"
    }
  ];
  
  // Adicionar evento de chamado se existir
  if (hasTicket && ticketCreatedAt) {
    history.push({
      timestamp: ticketCreatedAt,
      action: ticketType === "automático" ? "chamado_automático" : "chamado_manual",
      user: ticketType === "automático" ? "Sistema" : "Operador NOC",
      duration: calculateDuration(createdAt, ticketCreatedAt)
    });
  }
  
  // Adicionar evento de reconhecimento se existir
  if (acknowledgedAt) {
    const previousTimestamp = hasTicket && ticketCreatedAt 
      ? ticketCreatedAt 
      : createdAt;
    
    history.push({
      timestamp: acknowledgedAt,
      action: "reconhecimento",
      user: "Operador NOC",
      duration: calculateDuration(previousTimestamp, acknowledgedAt)
    });
  }
  
  // Adicionar evento de resolução se existir
  if (resolvedAt) {
    const previousTimestamp = acknowledgedAt 
      ? acknowledgedAt 
      : hasTicket && ticketCreatedAt 
        ? ticketCreatedAt 
        : createdAt;
    
    history.push({
      timestamp: resolvedAt,
      action: "resolução",
      user: "Sistema de Monitoramento",
      duration: calculateDuration(previousTimestamp, resolvedAt)
    });
  }
  
  // Ordenar o histórico por timestamp
  history.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  // Renderiza os ícones e cores com base na ação
  const getActionDetails = (action: ActionType) => {
    switch (action) {
      case "criação":
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          color: "bg-blue-100 text-blue-800",
          label: "Alerta criado"
        };
      case "reconhecimento":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          color: "bg-green-100 text-green-800",
          label: "Reconhecido"
        };
      case "chamado_automático":
        return {
          icon: <Ticket className="h-4 w-4" />,
          color: "bg-purple-100 text-purple-800",
          label: "Chamado automático"
        };
      case "chamado_manual":
        return {
          icon: <Ticket className="h-4 w-4" />,
          color: "bg-yellow-100 text-yellow-800",
          label: "Chamado manual"
        };
      case "resolução":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          color: "bg-green-100 text-green-800",
          label: "Resolvido"
        };
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Histórico do Alerta #{alertId}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Timeline visual */}
          <div className="relative border-l border-gray-200 pl-6 ml-2 space-y-5">
            {history.map((entry, index) => {
              const { icon, color, label } = getActionDetails(entry.action);
              
              return (
                <div key={index} className="flex flex-col items-start">
                  <div className={`absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white ${
                    entry.action === "reconhecimento" || entry.action === "resolução" 
                      ? "bg-green-500" 
                      : entry.action.includes("chamado") 
                        ? "bg-yellow-500" 
                        : "bg-blue-500"
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
                    {entry.action === "criação" 
                      ? "Alerta detectado pelo sistema de monitoramento" 
                      : entry.action === "reconhecimento"
                        ? "Alerta reconhecido pelo operador"
                        : entry.action === "chamado_automático"
                          ? "Chamado criado automaticamente pelo sistema"
                          : entry.action === "chamado_manual"
                            ? "Chamado criado manualmente pelo operador"
                            : "Problema resolvido no monitoramento"}
                  </p>
                </div>
              );
            })}
          </div>
          
          {/* Estado atual */}
          <div className="border-t pt-3 mt-3">
            <p className="text-sm font-medium mb-1">Estado Atual:</p>
            <div className="flex flex-wrap gap-2">
              {resolvedAt ? (
                <Badge className="bg-green-100 text-green-800">Resolvido</Badge>
              ) : acknowledgedAt ? (
                <Badge className="bg-green-100 text-green-800">Reconhecido</Badge>
              ) : hasTicket ? (
                <Badge className="bg-yellow-100 text-yellow-800">Chamado Aberto</Badge>
              ) : (
                <Badge className="bg-blue-100 text-blue-800">Pendente</Badge>
              )}
              
              {hasTicket && (
                <Badge className="bg-purple-100 text-purple-800">
                  {ticketType === "automático" ? "Chamado Automático" : "Chamado Manual"}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}