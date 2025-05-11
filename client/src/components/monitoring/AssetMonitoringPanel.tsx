import { useState, useEffect } from "react";
import { 
  Activity, 
  Server, 
  HardDrive, 
  MemoryStick as Memory, 
  Cpu, 
  Network, 
  Info, 
  ExternalLink,
  RefreshCcw
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MonitoringService, { AssetMonitoringState } from "@/services/MonitoringService";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AssetMonitoringPanelProps {
  assetId: number;
  className?: string;
}

export function AssetMonitoringPanel({ assetId, className }: AssetMonitoringPanelProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Buscar dados de monitoramento usando react-query
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["asset-monitoring", assetId],
    queryFn: () => MonitoringService.getAssetMonitoringState(assetId, true),
    staleTime: 30000, // 30 segundos
    refetchInterval: 60000, // Atualizar a cada 1 minuto
  });

  // Formatar unidades de armazenamento
  const formatStorage = (value: number): string => {
    if (value >= 1024 * 1024) {
      return `${(value / (1024 * 1024)).toFixed(2)} TB`;
    } else if (value >= 1024) {
      return `${(value / 1024).toFixed(2)} GB`;
    } else {
      return `${value.toFixed(2)} MB`;
    }
  };

  // Formatar uptime em dias, horas e minutos
  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // Obter cor baseada no valor percentual
  const getStatusColor = (value: number): string => {
    if (value >= 90) return "bg-red-500";
    if (value >= 75) return "bg-orange-500";
    if (value >= 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Obter cor baseada no status do ativo
  const getAssetStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
      up: "bg-green-500",
      warning: "bg-yellow-500",
      down: "bg-red-500",
      maintenance: "bg-blue-500",
      unknown: "bg-gray-500"
    };
    
    return statusColors[status] || "bg-gray-500";
  };

  // Componente para mostrar métrica com progresso
  const MetricWithProgress = ({ 
    label, 
    value, 
    max, 
    unit, 
    icon, 
    showPercentage = true,
    additionalInfo
  }: { 
    label: string, 
    value: number, 
    max: number, 
    unit: string,
    icon?: React.ReactNode,
    showPercentage?: boolean,
    additionalInfo?: string
  }) => {
    const percentage = Math.round((value / max) * 100);
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
            {icon && <span className="mr-2">{icon}</span>}
            <span>{label}</span>
            
            {additionalInfo && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 ml-1 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{additionalInfo}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium">
              {showPercentage ? `${percentage}%` : `${value} ${unit}`}
            </span>
            {showPercentage && (
              <span className="text-xs text-gray-400 ml-2">
                {value} {unit} / {max} {unit}
              </span>
            )}
          </div>
        </div>
        <Progress value={percentage} className={getStatusColor(percentage)} />
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-600" />
            Monitoramento do Ativo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48">
            <div className="flex flex-col items-center">
              <RefreshCcw className="h-8 w-8 text-blue-500 animate-spin" />
              <p className="mt-4 text-sm text-gray-500">Carregando dados de monitoramento...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-600" />
            Monitoramento do Ativo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-md text-center">
            <Server className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <h3 className="text-lg font-medium text-gray-500 mb-1">Monitoramento não disponível</h3>
            <p className="text-sm text-gray-500 mb-3">
              Não foi possível acessar os dados de monitoramento para este ativo.
            </p>
            <Button size="sm" onClick={() => refetch()}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-600" />
            Monitoramento do Ativo
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              className={`${getAssetStatusColor(data.status)} text-white px-2 py-1`}
            >
              {data.status === 'up' ? 'Online' : 
               data.status === 'down' ? 'Offline' : 
               data.status === 'warning' ? 'Atenção' : 
               data.status === 'maintenance' ? 'Manutenção' : 'Desconhecido'}
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 px-2">
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">Abrir no sistema de monitoramento</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Abrir no {data.monitoringSystem.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button size="sm" variant="ghost" onClick={() => refetch()} className="h-8 w-8 p-0">
              <RefreshCcw className="h-4 w-4" />
              <span className="sr-only">Atualizar</span>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="overview" className="text-sm">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="details" className="text-sm">
              Detalhes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <Cpu className="h-4 w-4 text-blue-600 mr-2" />
                  <h3 className="text-sm font-medium">Processador</h3>
                </div>
                <div className="text-2xl font-bold">{data.metrics.cpu?.usage || 0}%</div>
                <Progress 
                  value={data.metrics.cpu?.usage || 0} 
                  className={getStatusColor(data.metrics.cpu?.usage || 0)} 
                />
                {data.metrics.cpu?.trend && (
                  <div className="text-xs text-gray-500 mt-1 flex items-center">
                    Tendência: 
                    <span className="ml-1">
                      {data.metrics.cpu.trend === 'up' ? '↗️ Subindo' : 
                       data.metrics.cpu.trend === 'down' ? '↘️ Descendo' : 
                       '➡️ Estável'}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <Memory className="h-4 w-4 text-purple-600 mr-2" />
                  <h3 className="text-sm font-medium">Memória</h3>
                </div>
                <div className="text-2xl font-bold">{data.metrics.memory?.percentage || 0}%</div>
                <Progress 
                  value={data.metrics.memory?.percentage || 0} 
                  className={getStatusColor(data.metrics.memory?.percentage || 0)} 
                />
                <div className="text-xs text-gray-500 mt-1">
                  {data.metrics.memory ? 
                    `${formatStorage(data.metrics.memory.used)} de ${formatStorage(data.metrics.memory.total)}` : 
                    'Dados não disponíveis'}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <HardDrive className="h-4 w-4 text-amber-600 mr-2" />
                  <h3 className="text-sm font-medium">Disco</h3>
                </div>
                <div className="text-2xl font-bold">{data.metrics.disk?.percentage || 0}%</div>
                <Progress 
                  value={data.metrics.disk?.percentage || 0} 
                  className={getStatusColor(data.metrics.disk?.percentage || 0)} 
                />
                <div className="text-xs text-gray-500 mt-1">
                  {data.metrics.disk ? 
                    `${formatStorage(data.metrics.disk.used)} de ${formatStorage(data.metrics.disk.total)}` : 
                    'Dados não disponíveis'}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">Informações do Sistema</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Server className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <div className="text-xs text-gray-500">Sistema</div>
                    <div className="text-sm font-medium">{data.monitoringSystem.name}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Activity className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <div className="text-xs text-gray-500">Tempo Ativo</div>
                    <div className="text-sm font-medium">
                      {data.metrics.uptime ? formatUptime(data.metrics.uptime) : 'N/A'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Info className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <div className="text-xs text-gray-500">Último check</div>
                    <div className="text-sm font-medium">
                      {data.metrics.lastCheck ? 
                        new Date(data.metrics.lastCheck).toLocaleTimeString('pt-BR') : 
                        'N/A'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Network className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <div className="text-xs text-gray-500">Alertas relacionados</div>
                    <div className="text-sm font-medium">
                      {data.metrics.relatedIssues || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <ScrollArea className="h-64">
              <div className="space-y-4 px-1">
                {data.metrics.cpu && (
                  <MetricWithProgress
                    label="CPU"
                    value={data.metrics.cpu.usage}
                    max={100}
                    unit="%"
                    icon={<Cpu className="h-4 w-4 text-blue-600" />}
                    additionalInfo="Percentual de utilização de CPU no momento"
                  />
                )}
                
                {data.metrics.memory && (
                  <MetricWithProgress
                    label="Memória"
                    value={data.metrics.memory.used}
                    max={data.metrics.memory.total}
                    unit="MB"
                    icon={<Memory className="h-4 w-4 text-purple-600" />}
                    additionalInfo="Memória RAM em uso"
                  />
                )}
                
                {data.metrics.disk && (
                  <MetricWithProgress
                    label="Espaço em Disco"
                    value={data.metrics.disk.used}
                    max={data.metrics.disk.total}
                    unit="MB"
                    icon={<HardDrive className="h-4 w-4 text-amber-600" />}
                    additionalInfo="Espaço em disco utilizado no dispositivo principal"
                  />
                )}
                
                {data.metrics.network && (
                  <>
                    <MetricWithProgress
                      label="Tráfego de Entrada"
                      value={data.metrics.network.inbound}
                      max={100}
                      unit="Mbps"
                      icon={<Network className="h-4 w-4 text-green-600" />}
                      showPercentage={false}
                      additionalInfo="Tráfego de rede recebido (Megabits por segundo)"
                    />
                    
                    <MetricWithProgress
                      label="Tráfego de Saída"
                      value={data.metrics.network.outbound}
                      max={100}
                      unit="Mbps"
                      icon={<Network className="h-4 w-4 text-blue-600" />}
                      showPercentage={false}
                      additionalInfo="Tráfego de rede enviado (Megabits por segundo)"
                    />
                  </>
                )}
                
                <div className="bg-gray-50 p-3 rounded-md mt-4">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-2 text-gray-500" />
                    Informações Adicionais
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Sistema de Monitoramento:</span>
                      <span className="font-medium">{data.monitoringSystem.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Última Atualização:</span>
                      <span className="font-medium">
                        {new Date(data.lastUpdated).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tempo Ativo:</span>
                      <span className="font-medium">
                        {data.metrics.uptime ? formatUptime(data.metrics.uptime) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 pt-4 border-t flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Dados atualizados em {new Date(data.lastUpdated).toLocaleTimeString('pt-BR')}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open(data.monitoringSystem.assetUrl, '_blank')}
            className="text-xs h-8"
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            Abrir no {data.monitoringSystem.name}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default AssetMonitoringPanel;