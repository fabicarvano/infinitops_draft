import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertTriangle, CheckCircle, History, RefreshCw, Bell, BellOff, Eye } from "lucide-react";

interface StatusChange {
  id: number;
  status: "ativo" | "normalizado" | "flapping" | "reconhecido" | "suprimido";
  timestamp: string;
  value?: string;
  message?: string;
  user?: string;
}

interface MonitoringStatusHistoryProps {
  alertId: number;
  statusHistory: StatusChange[];
}

export default function MonitoringStatusHistory({ alertId, statusHistory }: MonitoringStatusHistoryProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Ícones para cada tipo de status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ativo":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "normalizado":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "flapping":
        return <RefreshCw className="h-5 w-5 text-yellow-500" />;
      case "reconhecido":
        return <Eye className="h-5 w-5 text-blue-500" />;
      case "suprimido":
        return <BellOff className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  // Formatação do texto de status
  const getStatusText = (status: string) => {
    switch (status) {
      case "ativo":
        return "Alerta ativo";
      case "normalizado":
        return "Normalizado";
      case "flapping":
        return "Oscilando";
      case "reconhecido":
        return "Reconhecido";
      case "suprimido":
        return "Suprimido";
      default:
        return status;
    }
  };

  // Formatação da cor de fundo baseada no status
  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-red-50";
      case "normalizado":
        return "bg-green-50";
      case "flapping":
        return "bg-yellow-50";
      case "reconhecido":
        return "bg-blue-50";
      case "suprimido":
        return "bg-gray-50";
      default:
        return "bg-gray-50";
    }
  };

  // Estatísticas agregadas
  const totalOccurrences = statusHistory.length;
  const totalActiveTime = "2h 15m"; // Simulação - Isso seria calculado com base nas transições de status
  const avgTimeToNormalize = "45m"; // Simulação - Isso seria calculado com base nas transições ativo->normalizado

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <History className="h-5 w-5" />
          Histórico de Status
        </h3>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {expanded ? "Ocultar detalhes" : "Ver histórico completo"}
        </button>
      </div>
      
      {/* Últimos status (sempre visíveis) */}
      <div className="space-y-2">
        {statusHistory.slice(0, 3).map((change) => (
          <div 
            key={change.id}
            className={`p-3 rounded-md flex items-start ${getStatusBgColor(change.status)}`}
          >
            <div className="mr-3 mt-0.5">
              {getStatusIcon(change.status)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="font-medium">{getStatusText(change.status)}</p>
                <time className="text-sm text-gray-500">
                  {format(new Date(change.timestamp), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </time>
              </div>
              {change.value && (
                <p className="text-sm text-gray-600 mt-1">
                  Valor: <span className="font-mono">{change.value}</span>
                </p>
              )}
              {change.message && (
                <p className="text-sm text-gray-600 mt-1">{change.message}</p>
              )}
              {change.user && (
                <p className="text-sm text-gray-500 mt-1">Por: {change.user}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Histórico completo (expansível) */}
      {expanded && statusHistory.length > 3 && (
        <div className="space-y-2 mt-2 border-t pt-2">
          {statusHistory.slice(3).map((change) => (
            <div 
              key={change.id}
              className={`p-3 rounded-md flex items-start ${getStatusBgColor(change.status)}`}
            >
              <div className="mr-3 mt-0.5">
                {getStatusIcon(change.status)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium">{getStatusText(change.status)}</p>
                  <time className="text-sm text-gray-500">
                    {format(new Date(change.timestamp), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </time>
                </div>
                {change.value && (
                  <p className="text-sm text-gray-600 mt-1">
                    Valor: <span className="font-mono">{change.value}</span>
                  </p>
                )}
                {change.message && (
                  <p className="text-sm text-gray-600 mt-1">{change.message}</p>
                )}
                {change.user && (
                  <p className="text-sm text-gray-500 mt-1">Por: {change.user}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Estatísticas agregadas */}
      <div className="flex flex-wrap gap-4 mt-4 text-sm bg-gray-50 p-3 rounded-md">
        <div>
          <span className="text-gray-500">Total de ocorrências:</span>{" "}
          <span className="font-medium">{totalOccurrences}</span>
        </div>
        <div>
          <span className="text-gray-500">Tempo total ativo:</span>{" "}
          <span className="font-medium">{totalActiveTime}</span>
        </div>
        <div>
          <span className="text-gray-500">Tempo médio até normalização:</span>{" "}
          <span className="font-medium">{avgTimeToNormalize}</span>
        </div>
      </div>
    </div>
  );
}