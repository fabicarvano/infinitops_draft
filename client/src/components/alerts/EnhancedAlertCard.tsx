import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  FileText, 
  MoreVertical,
  Server,
  Building,
  Tag
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import MonitoringStatusPanel from '../monitoring/MonitoringStatusPanel';
import MonitoringStatusHistory from '../monitoring/MonitoringStatusHistory';
import EffectiveSlaCard from '../sla/EffectiveSlaCard';
import SlaRiskIndicator from '../sla/SlaRiskIndicator';
import PriorityMatrix from '../sla/PriorityMatrix';

interface EnhancedAlertCardProps {
  alert: {
    id: number;
    status: string;  // Severidade técnica
    client: string;
    asset: string;
    assetId: number;
    message: string;
    time: string;
    createdAt: string;
    // Campos de monitoramento
    monitoringStatus: string;
    monitoringSource: string;
    monitoringId?: string;
    // Campos de SLA
    ticketId?: number;
    ticketCreatedAt?: string;
    finalPriority: string;
    serviceLevel: string;
    technicalCriticality: string;
    businessCriticality: number;
    // Tempos e prazos de SLA
    firstResponseTime: number;
    resolutionTime: number;
    firstResponseDeadline: string;
    resolutionDeadline: string;
    serviceHours: string;
    adjustmentFactor: number;
    isAdjustmentEnabled: boolean;
    slaPaused: boolean;
    slaViolated: boolean;
  };
  onAcknowledge?: (alertId: number) => void;
  onCreateTicket?: (alertId: number) => void;
  onViewTicket?: (ticketId: number) => void;
}

export default function EnhancedAlertCard({ 
  alert, 
  onAcknowledge, 
  onCreateTicket, 
  onViewTicket 
}: EnhancedAlertCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Valores simulados para o histórico de status de monitoramento
  const statusHistory = [
    {
      id: 1,
      status: "ativo" as const,
      timestamp: alert.createdAt,
      value: "CPU Usage: 95%",
      message: "Alerta criado - CPU Usage acima do limiar de 90%",
    },
    {
      id: 2,
      status: "reconhecido" as const,
      timestamp: new Date(new Date(alert.createdAt).getTime() + 15 * 60000).toISOString(),
      user: "Carlos Silva",
    },
    {
      id: 3,
      status: "normalizado" as const,
      timestamp: new Date(new Date(alert.createdAt).getTime() + 45 * 60000).toISOString(),
      value: "CPU Usage: 78%",
      message: "Sistema normalizado",
    },
    {
      id: 4,
      status: "ativo" as const,
      timestamp: new Date(new Date(alert.createdAt).getTime() + 120 * 60000).toISOString(),
      value: "CPU Usage: 97%",
      message: "Alerta reativado - CPU Usage acima do limiar de 90%",
    },
    {
      id: 5,
      status: alert.monitoringStatus as any,
      timestamp: new Date(new Date(alert.createdAt).getTime() + 150 * 60000).toISOString(),
      value: "CPU Usage: 82%",
      message: alert.monitoringStatus === "ativo" 
        ? "Alerta ainda ativo" 
        : "Sistema normalizado",
    },
  ];
  
  // Mapeamento de severidade para cor
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Mapeamento de severidade para criticidade técnica
  const mapSeverityToTechnicalCriticality = (severity: string) => {
    const map = {
      'critical': 'Disaster',
      'high': 'High',
      'medium': 'Average',
      'low': 'Warning',
    };
    return map[severity] || 'Information';
  };
  
  const getPriorityColor = (priority: string) => {
    const map = {
      'Crítica': 'bg-red-100 text-red-800 border-red-200',
      'Muito Alta': 'bg-orange-100 text-orange-800 border-orange-200',
      'Alta': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Média': 'bg-green-100 text-green-800 border-green-200',
      'Baixa': 'bg-blue-100 text-blue-800 border-blue-200',
      'Muito Baixa': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return map[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };
  
  // Status de monitoramento atual para o painel
  const currentMonitoringStatus = {
    status: alert.monitoringStatus as any,
    source: alert.monitoringSource,
    sourceId: alert.monitoringId,
    lastUpdated: statusHistory[statusHistory.length - 1].timestamp,
    currentValue: "CPU Usage: 82%",  // Valor simulado
    threshold: "CPU Usage > 90%",    // Limiar simulado
    sourceUrl: `https://zabbix.example.com/alerts/${alert.monitoringId}`,
  };
  
  // Determinar qual badge de "em SLA" mostrar
  const getSLAStatusBadge = () => {
    if (alert.slaPaused) {
      return <Badge variant="outline" className="bg-gray-100">SLA Pausado</Badge>;
    }
    if (alert.slaViolated) {
      return <Badge variant="destructive">SLA Violado</Badge>;
    }
    return <Badge variant="outline" className="bg-green-100 text-green-800">Dentro do SLA</Badge>;
  };
  
  return (
    <Card className={`mb-4 overflow-hidden ${alert.monitoringStatus === 'ativo' ? 'border-red-300' : ''}`}>
      <CardHeader className="px-4 py-3 bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <AlertTriangle className={`h-5 w-5 ${alert.status === 'critical' ? 'text-red-500' : alert.status === 'medium' ? 'text-yellow-500' : 'text-blue-500'}`} />
            <span className="font-medium">{alert.message}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Badge de severidade técnica */}
            <Badge variant="outline" className={getSeverityColor(alert.status)}>
              {alert.status === 'critical' ? 'Crítico' : 
               alert.status === 'high' ? 'Alto' :
               alert.status === 'medium' ? 'Médio' : 'Baixo'}
            </Badge>
            
            {/* Badge de prioridade final */}
            <Badge variant="outline" className={getPriorityColor(alert.finalPriority)}>
              {alert.finalPriority}
            </Badge>
            
            {/* Badge de status do SLA */}
            {alert.ticketId && getSLAStatusBadge()}
            
            {/* Menu de ações */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                {!alert.ticketId && (
                  <DropdownMenuItem onClick={() => onCreateTicket?.(alert.id)}>
                    Criar Chamado
                  </DropdownMenuItem>
                )}
                {alert.ticketId && (
                  <DropdownMenuItem onClick={() => onViewTicket?.(alert.ticketId!)}>
                    Ver Chamado #{alert.ticketId}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {alert.monitoringStatus === 'ativo' && (
                  <DropdownMenuItem onClick={() => onAcknowledge?.(alert.id)}>
                    Reconhecer Alerta
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Botão para expandir/recolher */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between text-sm">
          {/* Informações básicas do alerta */}
          <div className="space-y-1">
            <div className="flex items-center text-gray-600">
              <Building className="h-4 w-4 mr-2" />
              <span>Cliente: <span className="font-medium">{alert.client}</span></span>
            </div>
            <div className="flex items-center text-gray-600">
              <Server className="h-4 w-4 mr-2" />
              <span>Ativo: <span className="font-medium">{alert.asset}</span></span>
            </div>
          </div>
          
          <div className="mt-2 md:mt-0 space-y-1">
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>Criado: <span className="font-medium">{format(new Date(alert.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}</span></span>
            </div>
            {alert.ticketId && (
              <div className="flex items-center text-gray-600">
                <FileText className="h-4 w-4 mr-2" />
                <span>Chamado: <span className="font-medium">#{alert.ticketId}</span> ({format(new Date(alert.ticketCreatedAt!), "dd/MM/yyyy HH:mm", { locale: ptBR })})</span>
              </div>
            )}
          </div>
          
          <div className="mt-2 md:mt-0">
            {alert.ticketId && !alert.slaPaused && !alert.slaViolated && (
              <SlaRiskIndicator 
                deadline={alert.resolutionDeadline} 
                totalDuration={alert.resolutionTime} 
              />
            )}
          </div>
        </div>
        
        {/* Seção expandida com detalhes do SLA e monitoramento */}
        {expanded && (
          <div className="mt-4 space-y-6 pt-4 border-t">
            {/* Painel de Status do Monitoramento */}
            <div>
              <h3 className="text-lg font-medium mb-3">Status de Monitoramento</h3>
              <MonitoringStatusPanel {...currentMonitoringStatus} />
            </div>
            
            {/* Card de SLA Efetivo (se houver ticket) */}
            {alert.ticketId && (
              <div>
                <h3 className="text-lg font-medium mb-3">SLA & Priorização</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <EffectiveSlaCard 
                    firstResponseTime={alert.firstResponseTime}
                    resolutionTime={alert.resolutionTime}
                    firstResponseDeadline={alert.firstResponseDeadline}
                    resolutionDeadline={alert.resolutionDeadline}
                    serviceHours={alert.serviceHours}
                    adjustmentFactor={alert.adjustmentFactor}
                    isAdjustmentEnabled={alert.isAdjustmentEnabled}
                    slaPaused={alert.slaPaused}
                    slaViolated={alert.slaViolated}
                    ticketCreatedAt={alert.ticketCreatedAt!}
                    serviceLevel={alert.serviceLevel}
                    technicalCriticality={alert.technicalCriticality}
                    businessCriticality={alert.businessCriticality}
                    finalPriority={alert.finalPriority}
                  />
                  
                  <PriorityMatrix 
                    highlightTechnical={mapSeverityToTechnicalCriticality(alert.status)}
                    highlightBusiness={alert.businessCriticality}
                  />
                </div>
              </div>
            )}
            
            {/* Histórico de Status */}
            <MonitoringStatusHistory 
              alertId={alert.id}
              statusHistory={statusHistory}
            />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="px-4 py-3 bg-gray-50 border-t">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {alert.monitoringSource} #{alert.monitoringId || '-'}
            </span>
          </div>
          
          <div className="flex space-x-2">
            {!alert.ticketId && (
              <Button 
                variant="outline"
                size="sm"
                onClick={() => onCreateTicket?.(alert.id)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Criar Chamado
              </Button>
            )}
            
            {alert.ticketId && (
              <Button 
                variant="outline"
                size="sm"
                onClick={() => onViewTicket?.(alert.ticketId!)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Ver Chamado #{alert.ticketId}
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}