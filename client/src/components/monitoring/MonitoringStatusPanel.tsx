import { 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  BellOff, 
  Eye,
  ExternalLink,
  Clock
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MonitoringStatusPanelProps {
  status: "ativo" | "normalizado" | "flapping" | "reconhecido" | "suprimido";
  source: string;
  sourceId?: string;
  lastUpdated: string;
  currentValue?: string;
  threshold?: string;
  sourceUrl?: string;
}

export default function MonitoringStatusPanel({
  status,
  source,
  sourceId,
  lastUpdated,
  currentValue,
  threshold,
  sourceUrl
}: MonitoringStatusPanelProps) {
  // Ícone e cor com base no status
  const getStatusDetails = () => {
    switch (status) {
      case "ativo":
        return {
          icon: <AlertTriangle className="h-6 w-6" />,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          pulseEffect: true,
          label: "Alerta Ativo"
        };
      case "normalizado":
        return {
          icon: <CheckCircle className="h-6 w-6" />,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          pulseEffect: false,
          label: "Normalizado"
        };
      case "flapping":
        return {
          icon: <RefreshCw className="h-6 w-6" />,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50", 
          borderColor: "border-yellow-200",
          pulseEffect: true,
          label: "Oscilando"
        };
      case "reconhecido":
        return {
          icon: <Eye className="h-6 w-6" />,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          pulseEffect: false,
          label: "Reconhecido"
        };
      case "suprimido":
        return {
          icon: <BellOff className="h-6 w-6" />,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          pulseEffect: false,
          label: "Suprimido"
        };
      default:
        return {
          icon: <AlertTriangle className="h-6 w-6" />,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          pulseEffect: false,
          label: "Desconhecido"
        };
    }
  };

  const statusDetails = getStatusDetails();
  const timeAgo = formatDistanceToNow(new Date(lastUpdated), { locale: ptBR, addSuffix: true });
  const formattedDate = format(new Date(lastUpdated), "dd/MM/yyyy HH:mm:ss", { locale: ptBR });

  return (
    <div className={`rounded-lg border p-4 ${statusDetails.borderColor} ${statusDetails.bgColor}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`${statusDetails.color} ${statusDetails.pulseEffect ? 'animate-pulse' : ''}`}>
            {statusDetails.icon}
          </div>
          <h3 className={`text-lg font-semibold ${statusDetails.color}`}>
            {statusDetails.label}
          </h3>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white border border-gray-300">
          {source}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Fonte de Monitoramento</p>
          <div className="flex items-center justify-between">
            <p className="font-medium">{source}</p>
            {sourceUrl && (
              <a 
                href={sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm"
              >
                <span>Ver no {source}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
          {sourceId && (
            <p className="text-xs text-gray-500 mt-1">ID: {sourceId}</p>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Última Atualização</p>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <p className="font-medium">{timeAgo}</p>
          </div>
          <p className="text-xs text-gray-500 mt-1">{formattedDate}</p>
        </div>
        
        {(currentValue || threshold) && (
          <div className="col-span-1 sm:col-span-2 border-t pt-3 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentValue && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Valor Atual</p>
                  <p className="font-mono font-medium">{currentValue}</p>
                </div>
              )}
              
              {threshold && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Limiar Configurado</p>
                  <p className="font-mono font-medium">{threshold}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}