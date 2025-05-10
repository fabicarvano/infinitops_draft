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

// Definições de tipos
type AlertStatus = "critical" | "high" | "medium" | "low";
type MonitoringStatus = "ativo" | "normalizado" | "flapping" | "reconhecido" | "suprimido";
type TechnicalCriticality = "Information" | "Warning" | "Average" | "High" | "Disaster";
type BusinessCriticality = 0 | 1 | 2 | 3 | 4 | 5;
type PriorityLevel = "Crítica" | "Muito Alta" | "Alta" | "Média" | "Baixa" | "Muito Baixa";

interface EnhancedAlert {
  id: number;
  status: AlertStatus;
  client: string;
  asset: string;
  assetId: number;
  message: string;
  time: string;
  createdAt: string;
  // Campos de monitoramento
  monitoringStatus: MonitoringStatus;
  monitoringSource: string;
  monitoringId?: string;
  // Campos de SLA
  ticketId?: number;
  ticketCreatedAt?: string;
  finalPriority: PriorityLevel;
  serviceLevel: string;
  technicalCriticality: TechnicalCriticality;
  businessCriticality: BusinessCriticality;
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
}

interface EnhancedAlertCardProps {
  alert: EnhancedAlert;
  onAcknowledge?: (alertId: number) => void;
  onCreateTicket?: (alertId: number) => void;
  onViewTicket?: (ticketId: number) => void;
}

// Mapeamento de cores por status
const STATUS_COLORS: Record<AlertStatus, string> = {
  critical: "bg-red-100 text-red-800 border-red-300",
  high: "bg-orange-100 text-orange-800 border-orange-300",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  low: "bg-green-100 text-green-800 border-green-300"
};

// Mapeamento de cores por prioridade
const PRIORITY_COLORS: Record<PriorityLevel, string> = {
  "Crítica": "bg-red-100 text-red-800 border-red-300",
  "Muito Alta": "bg-orange-100 text-orange-800 border-orange-300",
  "Alta": "bg-amber-100 text-amber-800 border-amber-300",
  "Média": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "Baixa": "bg-green-100 text-green-800 border-green-300",
  "Muito Baixa": "bg-blue-100 text-blue-800 border-blue-300"
};

// Mapeamento de status de monitoramento para componentes visuais
const MONITORING_STATUS_PROPS: Record<MonitoringStatus, { icon: JSX.Element, title: string, description: string, color: string }> = {
  ativo: {
    icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
    title: "Alerta Ativo",
    description: "O problema ainda está ocorrendo no monitoramento",
    color: "border-red-300 bg-red-50"
  },
  normalizado: {
    icon: <AlertTriangle className="h-5 w-5 text-green-500" />,
    title: "Normalizado",
    description: "O problema foi resolvido no monitoramento",
    color: "border-green-300 bg-green-50"
  },
  flapping: {
    icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    title: "Flapping",
    description: "O alerta está oscilando entre ativo e normalizado",
    color: "border-amber-300 bg-amber-50"
  },
  reconhecido: {
    icon: <AlertTriangle className="h-5 w-5 text-blue-500" />,
    title: "Reconhecido",
    description: "O alerta foi reconhecido por um operador",
    color: "border-blue-300 bg-blue-50"
  },
  suprimido: {
    icon: <AlertTriangle className="h-5 w-5 text-gray-500" />,
    title: "Suprimido",
    description: "O alerta foi suprimido e não gerará novos alertas",
    color: "border-gray-300 bg-gray-50"
  }
};

export default function EnhancedAlertCard({ 
  alert, 
  onAcknowledge, 
  onCreateTicket, 
  onViewTicket 
}: EnhancedAlertCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Extrair dados do status de monitoramento atual
  const currentMonitoringStatus = MONITORING_STATUS_PROPS[alert.monitoringStatus];
  
  // Verificar se pode reconhecer o alerta (apenas os ativos podem ser reconhecidos)
  const canAcknowledge = alert.monitoringStatus === "ativo" || alert.monitoringStatus === "flapping";
  
  // Verificar se pode criar um chamado (apenas se não existir um chamado)
  const canCreateTicket = !alert.ticketId;
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <Badge variant="outline" className={STATUS_COLORS[alert.status]}>
              {alert.status === "critical" ? "Crítico" : 
               alert.status === "high" ? "Alto" : 
               alert.status === "medium" ? "Médio" : "Baixo"}
            </Badge>
            <Badge variant="outline" className={`ml-2 ${PRIORITY_COLORS[alert.finalPriority]}`}>
              {alert.finalPriority}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              {canAcknowledge && onAcknowledge && (
                <DropdownMenuItem onClick={() => onAcknowledge(alert.id)}>
                  Reconhecer Alerta
                </DropdownMenuItem>
              )}
              {canCreateTicket && onCreateTicket && (
                <DropdownMenuItem onClick={() => onCreateTicket(alert.id)}>
                  Criar Chamado
                </DropdownMenuItem>
              )}
              {alert.ticketId && onViewTicket && (
                <DropdownMenuItem onClick={() => onViewTicket(alert.ticketId!)}>
                  Ver Chamado #{alert.ticketId}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Ver Detalhes no Zabbix
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <h3 className="text-lg font-semibold mb-2">{alert.message}</h3>
        
        <div className="flex flex-col gap-1 mb-4">
          <div className="flex items-center text-gray-600">
            <Building className="h-4 w-4 mr-2" />
            <span>Cliente: <span className="font-medium">{alert.client}</span></span>
          </div>
          <div className="flex items-center text-gray-600">
            <Server className="h-4 w-4 mr-2" />
            <span>Ativo: <span className="font-medium">{alert.asset}</span> (ID: {alert.assetId})</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>Detectado: <span className="font-medium">{format(new Date(alert.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}</span></span>
          </div>
          {alert.ticketId && (
            <div className="flex items-center text-gray-600">
              <FileText className="h-4 w-4 mr-2" />
              <span>Chamado: <span className="font-medium">#{alert.ticketId}</span> ({format(new Date(alert.ticketCreatedAt!), "dd/MM/yyyy HH:mm", { locale: ptBR })})</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-md border ${currentMonitoringStatus.color}`}>
              <div className="flex items-center gap-2">
                {currentMonitoringStatus.icon}
                <div>
                  <p className="text-sm font-medium">{currentMonitoringStatus.title}</p>
                </div>
              </div>
            </div>
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
              <MonitoringStatusPanel 
                status={alert.monitoringStatus}
                source={alert.monitoringSource}
                monitoringId={alert.monitoringId}
              />
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
                  
                  <div>
                    <div className="bg-white rounded-lg border p-4">
                      <h4 className="text-sm font-medium mb-2">Matriz de Prioridade</h4>
                      <PriorityMatrix
                        highlightTechnical={alert.technicalCriticality}
                        highlightBusiness={alert.businessCriticality}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Histórico de mudanças de status */}
            <div>
              <h3 className="text-lg font-medium mb-3">Histórico de Status</h3>
              <MonitoringStatusHistory alertId={alert.id} />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="px-6 pb-4 pt-0 flex justify-between">
        <Button 
          variant="ghost" 
          onClick={() => setExpanded(!expanded)}
          className="text-gray-500"
        >
          {expanded ? (
            <><ChevronUp className="h-4 w-4 mr-2" /> Recolher</>
          ) : (
            <><ChevronDown className="h-4 w-4 mr-2" /> Expandir</>
          )}
        </Button>
        
        <div className="flex gap-2">
          {canCreateTicket && onCreateTicket && (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => onCreateTicket(alert.id)}
            >
              Criar Chamado
            </Button>
          )}
          {canAcknowledge && onAcknowledge && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onAcknowledge(alert.id)}
            >
              Reconhecer
            </Button>
          )}
          {alert.ticketId && onViewTicket && (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => onViewTicket(alert.ticketId!)}
            >
              Ver Chamado
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}