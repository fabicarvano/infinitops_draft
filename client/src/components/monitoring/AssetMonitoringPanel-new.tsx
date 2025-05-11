import { useState, useEffect } from "react";
import { 
  Activity, 
  Server, 
  HardDrive, 
  MemoryStick, 
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
  
  // Usando dados estáticos para testes
  const mockData: AssetMonitoringState = {
    assetId: assetId,
    assetName: `Asset-${assetId}`,
    status: 'up',
    lastUpdated: new Date().toISOString(),
    metrics: {
      cpu: {
        usage: 45,
        trend: 'stable',
        history: [42, 44, 47, 45, 43, 45]
      },
      memory: {
        total: 16384,
        used: 8192,
        percentage: 50,
        trend: 'up'
      },
      disk: {
        total: 1024000,
        used: 512000,
        percentage: 50,
        trend: 'stable'
      },
      network: {
        inbound: 75,
        outbound: 25,
        errors: 0
      },
      uptime: 604800, // 7 dias em segundos
      lastCheck: new Date().toISOString(),
      relatedIssues: 1
    },
    monitoringSystem: {
      name: "Zabbix",
      url: "https://zabbix.example.com",
      assetUrl: "https://zabbix.example.com/asset/" + assetId
    },
    activeAlerts: [
      {
        id: "1",
        severity: "average",
        status: "active",
        startTime: new Date().toISOString(),
        description: "Alta utilização de CPU",
        hostName: `Asset-${assetId}`
      }
    ]
  };
  
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
              className={`${getAssetStatusColor(mockData.status)} text-white px-2 py-1`}
            >
              {mockData.status === 'up' ? 'Online' : 
               mockData.status === 'down' ? 'Offline' : 
               mockData.status === 'warning' ? 'Atenção' : 
               mockData.status === 'maintenance' ? 'Manutenção' : 'Desconhecido'}
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
                  <p>Abrir no {mockData.monitoringSystem.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
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
                <div className="text-2xl font-bold">{mockData.metrics.cpu?.usage || 0}%</div>
                <Progress 
                  value={mockData.metrics.cpu?.usage || 0} 
                  className={getStatusColor(mockData.metrics.cpu?.usage || 0)} 
                />
                {mockData.metrics.cpu?.trend && (
                  <div className="text-xs text-gray-500 mt-1 flex items-center">
                    Tendência: 
                    <span className="ml-1">
                      {mockData.metrics.cpu.trend === 'up' ? '↗️ Subindo' : 
                       mockData.metrics.cpu.trend === 'down' ? '↘️ Descendo' : 
                       '➡️ Estável'}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <MemoryStick className="h-4 w-4 text-purple-600 mr-2" />
                  <h3 className="text-sm font-medium">Memória</h3>
                </div>
                <div className="text-2xl font-bold">{mockData.metrics.memory?.percentage || 0}%</div>
                <Progress 
                  value={mockData.metrics.memory?.percentage || 0} 
                  className={getStatusColor(mockData.metrics.memory?.percentage || 0)} 
                />
                <div className="text-xs text-gray-500 mt-1">
                  {mockData.metrics.memory ? 
                    `${formatStorage(mockData.metrics.memory.used)} de ${formatStorage(mockData.metrics.memory.total)}` : 
                    'Dados não disponíveis'}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <HardDrive className="h-4 w-4 text-amber-600 mr-2" />
                  <h3 className="text-sm font-medium">Disco</h3>
                </div>
                <div className="text-2xl font-bold">{mockData.metrics.disk?.percentage || 0}%</div>
                <Progress 
                  value={mockData.metrics.disk?.percentage || 0} 
                  className={getStatusColor(mockData.metrics.disk?.percentage || 0)} 
                />
                <div className="text-xs text-gray-500 mt-1">
                  {mockData.metrics.disk ? 
                    `${formatStorage(mockData.metrics.disk.used)} de ${formatStorage(mockData.metrics.disk.total)}` : 
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
                    <div className="text-sm font-medium">{mockData.monitoringSystem.name}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Activity className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <div className="text-xs text-gray-500">Tempo Ativo</div>
                    <div className="text-sm font-medium">
                      {mockData.metrics.uptime ? formatUptime(mockData.metrics.uptime) : 'N/A'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Info className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <div className="text-xs text-gray-500">Último check</div>
                    <div className="text-sm font-medium">
                      {mockData.metrics.lastCheck ? 
                        new Date(mockData.metrics.lastCheck).toLocaleTimeString('pt-BR') : 
                        'N/A'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Network className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <div className="text-xs text-gray-500">Alertas relacionados</div>
                    <div className="text-sm font-medium">
                      {mockData.metrics.relatedIssues || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <ScrollArea className="h-64">
              <div className="space-y-4 px-1">
                {mockData.metrics.cpu && (
                  <MetricWithProgress
                    label="CPU"
                    value={mockData.metrics.cpu.usage}
                    max={100}
                    unit="%"
                    icon={<Cpu className="h-4 w-4 text-blue-600" />}
                    additionalInfo="Percentual de utilização de CPU no momento"
                  />
                )}
                
                {mockData.metrics.memory && (
                  <MetricWithProgress
                    label="Memória"
                    value={mockData.metrics.memory.used}
                    max={mockData.metrics.memory.total}
                    unit="MB"
                    icon={<MemoryStick className="h-4 w-4 text-purple-600" />}
                    additionalInfo="Memória RAM em uso"
                  />
                )}
                
                {mockData.metrics.disk && (
                  <MetricWithProgress
                    label="Espaço em Disco"
                    value={mockData.metrics.disk.used}
                    max={mockData.metrics.disk.total}
                    unit="MB"
                    icon={<HardDrive className="h-4 w-4 text-amber-600" />}
                    additionalInfo="Espaço em disco utilizado no dispositivo principal"
                  />
                )}
                
                {mockData.metrics.network && (
                  <>
                    <MetricWithProgress
                      label="Tráfego de Entrada"
                      value={mockData.metrics.network.inbound}
                      max={100}
                      unit="Mbps"
                      icon={<Network className="h-4 w-4 text-green-600" />}
                      showPercentage={false}
                      additionalInfo="Tráfego de rede recebido (Megabits por segundo)"
                    />
                    
                    <MetricWithProgress
                      label="Tráfego de Saída"
                      value={mockData.metrics.network.outbound}
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
                  
                  {mockData.activeAlerts && mockData.activeAlerts.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-xs font-medium text-gray-500 mb-1">Alertas Ativos</h4>
                      <div className="space-y-2">
                        {mockData.activeAlerts.map((alert) => (
                          <div key={alert.id} className="bg-white p-2 rounded border border-gray-100 text-sm">
                            <div className="flex items-start">
                              <div 
                                className={`h-2 w-2 rounded-full mt-1.5 mr-2 ${
                                  alert.severity === 'critical' ? 'bg-red-500' :
                                  alert.severity === 'high' ? 'bg-orange-500' :
                                  alert.severity === 'average' ? 'bg-yellow-500' :
                                  alert.severity === 'warning' ? 'bg-blue-500' :
                                  'bg-gray-500'
                                }`} 
                              />
                              <div>
                                <div className="font-medium">{alert.description}</div>
                                <div className="text-xs text-gray-500 mt-0.5">
                                  {new Date(alert.startTime).toLocaleString('pt-BR')}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}