import { AlertTriangle, Calendar, Clock, InfoIcon, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Define interface for component props
interface MonitoringStatusPanelProps {
  status: "ativo" | "normalizado" | "flapping" | "reconhecido" | "suprimido";
  source: string;
  monitoringId?: string;
  lastUpdated?: string;
  ticketId?: number;
}

// Mapping do status de monitoramento para status de alerta
type AlertStatusType = "Pendente" | "Aberto" | "Reconhecido" | "Resolvido";

// Configuração dos status de alerta seguindo o padrão da tabela de alertas ativos
const ALERT_STATUS_CONFIG = {
  Pendente: {
    icon: <AlertTriangle className="h-5 w-5 text-blue-500" />,
    title: "Alerta Pendente",
    description: "O alerta está aguardando ação do operador",
    color: "border-blue-300 bg-blue-50 text-blue-800"
  },
  Aberto: {
    icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    title: "Alerta Aberto",
    description: "Um chamado foi criado para este alerta",
    color: "border-yellow-300 bg-yellow-50 text-yellow-800"
  },
  Reconhecido: {
    icon: <AlertTriangle className="h-5 w-5 text-green-500" />,
    title: "Alerta Reconhecido",
    description: "O alerta foi reconhecido por um operador",
    color: "border-green-300 bg-green-50 text-green-800"
  },
  Resolvido: {
    icon: <AlertTriangle className="h-5 w-5 text-gray-500" />,
    title: "Alerta Resolvido",
    description: "O problema foi resolvido e o alerta encerrado",
    color: "border-gray-300 bg-gray-50 text-gray-800"
  }
};

export default function MonitoringStatusPanel({ 
  status, 
  source, 
  monitoringId, 
  lastUpdated,
  ticketId
}: MonitoringStatusPanelProps) {
  // Mapear status de monitoramento para status de alerta
  let alertStatus: AlertStatusType;
  
  if (status === "reconhecido") {
    alertStatus = "Reconhecido";
  } else if (status === "normalizado") {
    alertStatus = "Resolvido";
  } else if (ticketId) {
    alertStatus = "Aberto";
  } else {
    alertStatus = "Pendente";
  }
  
  const config = ALERT_STATUS_CONFIG[alertStatus];
  
  return (
    <Card className={`border ${config.color.includes('border') ? config.color.split(' ')[0] : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${config.color}`}>
              {config.icon}
            </div>
            <div>
              <h4 className="text-sm font-semibold">{config.title}</h4>
              <p className="text-sm text-gray-500">{config.description}</p>
            </div>
          </div>
          <Badge variant="outline" className={`${config.color}`}>
            {alertStatus}
          </Badge>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Tag className="mr-2 h-4 w-4" />
            <span>Fonte de Monitoramento: </span>
            <span className="ml-1 font-medium text-gray-800">{source}</span>
          </div>
          
          {monitoringId && (
            <div className="flex items-center text-sm text-gray-500">
              <InfoIcon className="mr-2 h-4 w-4" />
              <span>ID no Sistema: </span>
              <span className="ml-1 font-medium text-gray-800">{monitoringId}</span>
            </div>
          )}
          
          {lastUpdated && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="mr-2 h-4 w-4" />
              <span>Última Atualização: </span>
              <span className="ml-1 font-medium text-gray-800">{lastUpdated}</span>
            </div>
          )}
          
          {/* Detalhes adicionais sobre o status de monitoramento */}
          <div className="flex items-center text-sm text-gray-500">
            <InfoIcon className="mr-2 h-4 w-4" />
            <span>Status no Monitoramento: </span>
            <span className="ml-1 font-medium text-gray-800 capitalize">{status}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}