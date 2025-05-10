import { AlertTriangle, Calendar, Clock, InfoIcon, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Define interface for component props
interface MonitoringStatusPanelProps {
  status: "ativo" | "normalizado" | "flapping" | "reconhecido" | "suprimido";
  source: string;
  monitoringId?: string;
  lastUpdated?: string;
}

// Mapping of monitoring status to visual components
const STATUS_CONFIG = {
  ativo: {
    icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
    title: "Alerta Ativo",
    description: "O problema ainda está ocorrendo no monitoramento",
    color: "border-red-300 bg-red-50 text-red-800"
  },
  normalizado: {
    icon: <AlertTriangle className="h-5 w-5 text-green-500" />,
    title: "Normalizado",
    description: "O problema foi resolvido no monitoramento",
    color: "border-green-300 bg-green-50 text-green-800"
  },
  flapping: {
    icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    title: "Flapping",
    description: "O alerta está oscilando entre ativo e normalizado",
    color: "border-amber-300 bg-amber-50 text-amber-800"
  },
  reconhecido: {
    icon: <AlertTriangle className="h-5 w-5 text-blue-500" />,
    title: "Reconhecido",
    description: "O alerta foi reconhecido por um operador",
    color: "border-blue-300 bg-blue-50 text-blue-800"
  },
  suprimido: {
    icon: <AlertTriangle className="h-5 w-5 text-gray-500" />,
    title: "Suprimido",
    description: "O alerta foi suprimido e não gerará novos alertas",
    color: "border-gray-300 bg-gray-50 text-gray-800"
  }
};

export default function MonitoringStatusPanel({ 
  status, 
  source, 
  monitoringId, 
  lastUpdated 
}: MonitoringStatusPanelProps) {
  const config = STATUS_CONFIG[status];
  
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
          <Badge variant="outline" className="capitalize">
            {status}
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
        </div>
      </CardContent>
    </Card>
  );
}