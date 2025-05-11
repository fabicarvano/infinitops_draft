import { useState, useEffect } from "react";
import { 
  Activity, 
  ExternalLink, 
  Server, 
  Cpu, 
  Memory, 
  HardDrive, 
  ArrowUpRight,
  RefreshCcw,
  AlertTriangle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import MonitoringService, { MonitoringAlert } from "@/services/MonitoringService";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AlertMonitoringInfoProps {
  alertId: number;
  assetId: number;
  className?: string;
}

export function AlertMonitoringInfo({ alertId, assetId, className }: AlertMonitoringInfoProps) {
  // Buscar dados de monitoramento usando react-query
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["alert-monitoring", alertId],
    queryFn: () => MonitoringService.getAlertMonitoringData(alertId),
    staleTime: 30000, // 30 segundos
  });
  
  // Formatar unidades
  const formatUnit = (value: number, unit: string): string => {
    return `${value}${unit}`;
  };
  
  // Mapear severidade para cor
  const getSeverityColor = (severity: string): string => {
    const colorMap: Record<string, string> = {
      'information': 'bg-blue-500',
      'warning': 'bg-yellow-500',
      'average': 'bg-orange-500',
      'high': 'bg-red-500',
      'critical': 'bg-red-600'
    };
    
    return colorMap[severity] || 'bg-gray-500';
  };
  
  // Componente mini-métrica
  const MiniMetric = ({ 
    icon, 
    label, 
    value, 
    unit,
    color = "text-blue-600" 
  }: { 
    icon: React.ReactNode, 
    label: string, 
    value: number | string, 
    unit?: string, 
    color?: string 
  }) => (
    <div className="flex items-center space-x-2 bg-gray-50 rounded-md py-1.5 px-2">
      <div className={`${color}`}>{icon}</div>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm font-medium">{value}{unit ? unit : ''}</div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className={`mt-3 ${className}`}>
        <div className="text-sm font-medium text-gray-500 mb-2 flex items-center">
          <Activity className="h-4 w-4 mr-1" />
          Dados de Monitoramento
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Skeleton className="h-16 rounded-md" />
          <Skeleton className="h-16 rounded-md" />
          <Skeleton className="h-16 rounded-md" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className={`mt-3 ${className}`}>
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium text-gray-500 flex items-center">
            <Activity className="h-4 w-4 mr-1" />
            Dados de Monitoramento
          </div>
          <Button variant="ghost" size="sm" onClick={() => refetch()} className="h-8 w-8 p-0">
            <RefreshCcw className="h-4 w-4" />
            <span className="sr-only">Atualizar</span>
          </Button>
        </div>
        <div className="bg-gray-50 p-3 rounded-md text-center">
          <AlertTriangle className="h-5 w-5 text-amber-500 mx-auto mb-1" />
          <p className="text-sm text-gray-600">
            Não foi possível carregar os dados de monitoramento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`mt-3 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium text-gray-500 flex items-center">
          <Activity className="h-4 w-4 mr-1" />
          Dados de Monitoramento
        </div>
        
        {data.monitoringUrl && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 p-1"
                  onClick={() => window.open(data.monitoringUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  <span className="text-xs">Ver no monitoramento</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Abrir este alerta no sistema de monitoramento</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      {/* Dados de métricas */}
      {data.metrics && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {data.metrics.cpu && (
              <MiniMetric 
                icon={<Cpu className="h-4 w-4" />}
                label="CPU"
                value={data.metrics.cpu.usage}
                unit="%"
                color="text-blue-600"
              />
            )}
            
            {data.metrics.memory && (
              <MiniMetric 
                icon={<Memory className="h-4 w-4" />}
                label="Memória"
                value={data.metrics.memory.percentage}
                unit="%"
                color="text-purple-600"
              />
            )}
            
            {data.metrics.disk && (
              <MiniMetric 
                icon={<HardDrive className="h-4 w-4" />}
                label="Disco"
                value={data.metrics.disk.percentage}
                unit="%"
                color="text-amber-600"
              />
            )}
            
            {data.metrics.relatedIssues !== undefined && (
              <MiniMetric 
                icon={<AlertTriangle className="h-4 w-4" />}
                label="Alertas Relacionados"
                value={data.metrics.relatedIssues}
                color="text-red-500"
              />
            )}
            
            {data.metrics.uptime !== undefined && (
              <MiniMetric 
                icon={<Server className="h-4 w-4" />}
                label="Uptime"
                value={formatUptime(data.metrics.uptime)}
                color="text-green-600"
              />
            )}
          </div>
          
          {/* Tendências e Detalhes Adicionais */}
          {(data.metrics.cpu?.trend || data.metrics.memory?.trend || data.metrics.disk?.trend) && (
            <div className="bg-gray-50 p-2 rounded-md">
              <div className="text-xs text-gray-500 mb-1">Tendências</div>
              <div className="flex flex-wrap gap-3">
                {data.metrics.cpu?.trend && (
                  <div className="flex items-center">
                    <Cpu className="h-3.5 w-3.5 text-gray-500 mr-1" />
                    <span className="text-xs">
                      CPU: {getTrendIcon(data.metrics.cpu.trend)}
                    </span>
                  </div>
                )}
                
                {data.metrics.memory?.trend && (
                  <div className="flex items-center">
                    <Memory className="h-3.5 w-3.5 text-gray-500 mr-1" />
                    <span className="text-xs">
                      Memória: {getTrendIcon(data.metrics.memory.trend)}
                    </span>
                  </div>
                )}
                
                {data.metrics.disk?.trend && (
                  <div className="flex items-center">
                    <HardDrive className="h-3.5 w-3.5 text-gray-500 mr-1" />
                    <span className="text-xs">
                      Disco: {getTrendIcon(data.metrics.disk.trend)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Formatar uptime
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  } else {
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
}

// Obter ícone de tendência
function getTrendIcon(trend: 'up' | 'down' | 'stable'): React.ReactNode {
  switch (trend) {
    case 'up':
      return <span className="text-red-500">↗️ subindo</span>;
    case 'down':
      return <span className="text-green-500">↘️ descendo</span>;
    case 'stable':
      return <span className="text-blue-500">➡️ estável</span>;
    default:
      return null;
  }
}

export default AlertMonitoringInfo;