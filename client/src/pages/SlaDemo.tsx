import React, { useState, useEffect } from "react";
import { useAlerts } from "@/hooks/use-alerts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addHours, addMinutes } from "date-fns";
import { AlertTriangle, Info, HelpCircle, ChevronDown, ChevronUp, Clock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Importar componentes do sistema de SLA
import PriorityMatrix from "@/components/sla/PriorityMatrix";
import EffectiveSlaCard from "@/components/sla/EffectiveSlaCard";
import MonitoringStatusPanel from "@/components/monitoring/MonitoringStatusPanel";
import MonitoringStatusHistory from "@/components/monitoring/MonitoringStatusHistory";
import SimpleAlertHistory from "@/components/monitoring/SimpleAlertHistory";
import SlaRiskIndicator from "@/components/sla/SlaRiskIndicator";
import SupportContactsPanel from "@/components/support/SupportContactsPanel";
import PriorityBadge from "@/components/sla/PriorityBadge";

// Tipos para nossa demonstração
type AlertSeverity = "critical" | "high" | "medium" | "low";
type MonitoringStatus = "ativo" | "normalizado" | "flapping" | "reconhecido" | "suprimido";
type TechnicalCriticality = "Information" | "Warning" | "Average" | "High" | "Disaster";
type BusinessCriticality = 0 | 1 | 2 | 3 | 4 | 5;
type PriorityLevel = "Crítica" | "Muito Alta" | "Alta" | "Média" | "Baixa" | "Muito Baixa";

interface DemoAlert {
  id: number;
  status: AlertSeverity;
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

// Cores por severidade e prioridade
const STATUS_COLORS: Record<AlertSeverity, string> = {
  critical: "bg-red-100 text-red-800 border-red-300",
  high: "bg-orange-100 text-orange-800 border-orange-300",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  low: "bg-green-100 text-green-800 border-green-300"
};

const PRIORITY_COLORS: Record<PriorityLevel, string> = {
  "Crítica": "bg-red-100 text-red-800 border-red-300",
  "Muito Alta": "bg-orange-100 text-orange-800 border-orange-300",
  "Alta": "bg-amber-100 text-amber-800 border-amber-300",
  "Média": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "Baixa": "bg-green-100 text-green-800 border-green-300",
  "Muito Baixa": "bg-blue-100 text-blue-800 border-blue-300"
};

export default function SlaDemo() {
  const { data: alerts, isLoading } = useAlerts();
  const { toast } = useToast();
  
  // Estados para controlar quais alertas foram reconhecidos ou têm chamados criados
  const [acknowledged, setAcknowledged] = useState<number[]>([]);
  const [createdTickets, setCreatedTickets] = useState<number[]>([]);
  const [expandedAlerts, setExpandedAlerts] = useState<number[]>([]);
  
  
  // Mapear alertas para alertas com SLA
  const demoAlerts: DemoAlert[] = (alerts || []).map(alert => {
    // Determinar criticidade de negócio simulada (baseada no ID do ativo)
    const businessCriticality = (alert.assetId % 6) as BusinessCriticality;
    
    // Determinar criticidade técnica
    let technicalCriticality: TechnicalCriticality;
    switch (alert.status as AlertSeverity) {
      case "critical":
        technicalCriticality = "Disaster";
        break;
      case "high":
        technicalCriticality = "High";
        break;
      case "medium":
        technicalCriticality = "Average";
        break;
      case "low":
        technicalCriticality = "Warning";
        break;
      default:
        technicalCriticality = "Information";
    }
    
    // Determinar prioridade final baseada na matriz
    let finalPriority: PriorityLevel;
    const status = alert.status as AlertSeverity;
    if (status === "critical") {
      if (businessCriticality === 0) finalPriority = "Crítica";
      else if (businessCriticality <= 2) finalPriority = "Muito Alta";
      else finalPriority = "Alta";
    } else if (status === "high") {
      if (businessCriticality === 0) finalPriority = "Muito Alta";
      else if (businessCriticality <= 2) finalPriority = "Alta";
      else if (businessCriticality <= 4) finalPriority = "Média";
      else finalPriority = "Baixa";
    } else if (status === "medium") {
      if (businessCriticality <= 1) finalPriority = "Alta";
      else if (businessCriticality <= 3) finalPriority = "Média";
      else finalPriority = "Baixa";
    } else {
      if (businessCriticality <= 2) finalPriority = "Média";
      else if (businessCriticality <= 4) finalPriority = "Baixa";
      else finalPriority = "Muito Baixa";
    }
    
    // Gerar status de monitoramento simulado
    let monitoringStatus: MonitoringStatus = "ativo";
    if (acknowledged.includes(alert.id)) {
      monitoringStatus = "reconhecido";
    } else if (alert.status === "low") {
      monitoringStatus = "normalizado";
    } else if (alert.status === "medium" && alert.id % 2 === 0) {
      monitoringStatus = "flapping";
    }
    
    // Calcular tempos de SLA
    const isAdjustmentEnabled = alert.id % 3 !== 0; // 2/3 dos alertas têm ajuste habilitado
    const serviceLevel = alert.id % 4 === 0 ? "Platinum" : 
                         alert.id % 3 === 0 ? "Premium" : 
                         alert.id % 2 === 0 ? "Standard" : "Personalizado";
    
    // Tempos base (em minutos)
    let firstResponseTime: number;
    let resolutionTime: number;
    
    switch (serviceLevel) {
      case "Platinum":
        if (technicalCriticality === "Disaster") {
          firstResponseTime = 15;
          resolutionTime = 60;
        } else if (technicalCriticality === "High") {
          firstResponseTime = 30;
          resolutionTime = 120;
        } else {
          firstResponseTime = 60;
          resolutionTime = 240;
        }
        break;
      case "Premium":
        if (technicalCriticality === "Disaster") {
          firstResponseTime = 30;
          resolutionTime = 120;
        } else if (technicalCriticality === "High") {
          firstResponseTime = 60;
          resolutionTime = 240;
        } else {
          firstResponseTime = 120;
          resolutionTime = 480;
        }
        break;
      default: // Standard ou Personalizado
        if (technicalCriticality === "Disaster") {
          firstResponseTime = 60;
          resolutionTime = 240;
        } else if (technicalCriticality === "High") {
          firstResponseTime = 120;
          resolutionTime = 480;
        } else {
          firstResponseTime = 240;
          resolutionTime = 720;
        }
    }
    
    // Aplicar fator de ajuste baseado na criticidade do negócio
    let adjustmentFactor = 1.0;
    if (isAdjustmentEnabled) {
      switch (businessCriticality) {
        case 0:
          adjustmentFactor = 0.5;
          break;
        case 1:
          adjustmentFactor = 0.75;
          break;
        case 2:
          adjustmentFactor = 0.9;
          break;
        default:
          adjustmentFactor = 1.0;
      }
      
      // Aplicar ajuste aos tempos
      firstResponseTime = Math.round(firstResponseTime * adjustmentFactor);
      resolutionTime = Math.round(resolutionTime * adjustmentFactor);
    }
    
    // Criar tempos de SLA e prazos
    const ticketCreatedAt: string = alert.ticketId 
      ? (alert.ticketCreatedAt || new Date().toISOString())
      : createdTickets.includes(alert.id) 
        ? new Date().toISOString() 
        : (alert.createdAt || new Date().toISOString());
        
    const ticketCreatedDate = new Date(ticketCreatedAt);
    const firstResponseDeadline = addMinutes(ticketCreatedDate, firstResponseTime).toISOString();
    const resolutionDeadline = addMinutes(ticketCreatedDate, resolutionTime).toISOString();
    
    // Status do SLA
    const slaPaused = alert.id % 10 === 0; // 10% dos alertas com SLA pausado
    const slaViolated = alert.id % 15 === 0; // 6.67% dos alertas com SLA violado
    
    return {
      ...alert,
      status: alert.status as AlertSeverity,
      monitoringStatus,
      monitoringSource: "Zabbix",
      monitoringId: `Z${alert.id}${alert.assetId}`,
      finalPriority,
      serviceLevel,
      technicalCriticality,
      businessCriticality,
      firstResponseTime,
      resolutionTime,
      firstResponseDeadline,
      resolutionDeadline,
      serviceHours: serviceLevel === "Platinum" ? "24x7" : 
                    serviceLevel === "Premium" ? "Seg-Sex 06h-23h" : 
                    "Seg-Sex 09h-18h",
      adjustmentFactor,
      isAdjustmentEnabled,
      slaPaused,
      slaViolated,
      ticketId: alert.ticketId || (createdTickets.includes(alert.id) ? 1000 + alert.id : undefined),
      ticketCreatedAt
    };
  });
  

  
  // Calcular duração entre duas datas
  const calcDuration = (start: Date, end: Date): string => {
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    
    if (diffHrs > 0) {
      return `${diffHrs}h ${diffMins % 60}m`;
    } else {
      return `${diffMins}m`;
    }
  };
  
  // Handler para reconhecer alertas
  const handleAcknowledge = (alertId: number) => {
    // Encontrar o alerta
    const alert = demoAlerts.find(a => a.id === alertId);
    
    // Verificar se o alerta está pendente (sem chamado e não reconhecido)
    if (!alert || alert.ticketId || alert.monitoringStatus === "reconhecido") {
      toast({
        title: "Ação não permitida",
        description: "Apenas alertas pendentes podem ser reconhecidos.",
        variant: "destructive",
      });
      return;
    }
    
    setAcknowledged(prev => [...prev, alertId]);
    
    // Adicionar entrada no histórico
    addHistoryEntry(alertId, "acknowledged");
    
    toast({
      title: "Alerta reconhecido",
      description: `Alerta #${alertId} foi reconhecido com sucesso.`,
      variant: "default",
    });
  };
  
  // Handler para criar chamados
  const handleCreateTicket = (alertId: number) => {
    setCreatedTickets(prev => [...prev, alertId]);
    
    // Verificar se o alerta é de alta severidade (crítico ou alto)
    const alert = demoAlerts.find(a => a.id === alertId);
    const isHighSeverity = alert && (alert.status === "critical" || alert.status === "high");
    
    // Adicionar entrada no histórico (automático ou manual)
    addHistoryEntry(alertId, isHighSeverity ? "ticketAutoCreated" : "ticketManualCreated", 
      isHighSeverity ? "Sistema" : "Operador NOC");
    
    toast({
      title: "Chamado criado",
      description: `Chamado para o alerta #${alertId} foi criado com sucesso.`,
      variant: "default",
    });
  };
  
  // Handler para expandir/recolher alertas
  const toggleExpandAlert = (alertId: number) => {
    setExpandedAlerts(prev => 
      prev.includes(alertId)
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };
  
  // Função para calcular indicador de tempo para alertas pendentes
  const getTimeWithoutActionIndicator = (timeString?: string) => {
    if (!timeString) return null;
    
    // Extrair a informação de tempo do formato "Xm atrás" ou "Xh Ym atrás"
    let minutes = 0;
    
    if (timeString.includes('h') && timeString.includes('m')) {
      // Formato "Xh Ym atrás"
      const hourPart = parseInt(timeString.split('h')[0]);
      const minutePart = parseInt(timeString.split('h')[1].split('m')[0].trim());
      minutes = hourPart * 60 + minutePart;
    } else if (timeString.includes('h')) {
      // Formato "Xh atrás"
      const hours = parseInt(timeString.split('h')[0]);
      minutes = hours * 60;
    } else if (timeString.includes('m')) {
      // Formato "Xm atrás"
      minutes = parseInt(timeString.split('m')[0]);
    }
    
    // Baseado no tempo, retornamos um indicador diferente
    if (minutes >= 10) {
      return (
        <div className="flex items-center ml-2 text-red-600">
          <Clock className="h-3 w-3 mr-1" />
          <span className="text-xs font-medium">+10min</span>
        </div>
      );
    } else if (minutes >= 5) {
      return (
        <div className="flex items-center ml-2 text-orange-600">
          <Clock className="h-3 w-3 mr-1" />
          <span className="text-xs font-medium">+5min</span>
        </div>
      );
    } else if (minutes >= 2) {
      return (
        <div className="flex items-center ml-2 text-yellow-600">
          <Clock className="h-3 w-3 mr-1" />
          <span className="text-xs font-medium">+2min</span>
        </div>
      );
    }
    
    // Menos de 2 minutos, não mostramos indicador
    return null;
  };
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Demonstração do Sistema de SLA</h1>
        <p className="text-gray-600 mb-4">
          Esta página demonstra o novo sistema de SLA integrado com monitoramento.
          Todos os alertas exibem informações de SLA efetivo, status de monitoramento e
          classificação final em português.
        </p>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex">
              <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800 mb-1">Como testar esta demonstração:</h3>
                <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
                  <li>Clique em <strong>Reconhecer</strong> para alterar o status de um alerta para "reconhecido"</li>
                  <li>Clique em <strong>Criar Chamado</strong> para gerar um ticket e visualizar o SLA completo</li>
                  <li>Clique em <strong>Expandir</strong> para visualizar detalhes do monitoramento e matriz de prioridades</li>
                  <li>Observe como a criticidade técnica e a criticidade de negócio definem a prioridade final</li>
                  <li>Veja como o fator de ajuste modifica os tempos de SLA com base na criticidade de negócio</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Carregando alertas...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {demoAlerts.map(alert => {
            const isExpanded = expandedAlerts.includes(alert.id);
            // Apenas alertas pendentes (sem chamado e não reconhecidos) podem ser reconhecidos
            const canAcknowledge = !alert.ticketId && alert.monitoringStatus !== "reconhecido" && alert.monitoringStatus !== "normalizado";
            const canCreateTicket = !alert.ticketId;
            
            return (
              <Card key={alert.id} className="w-full">
                <CardContent className="p-6">
                  {/* Cabeçalho do alerta */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex space-x-2 mb-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="sm" className={STATUS_COLORS[alert.status]}>
                                <span className="flex items-center">
                                  {alert.status === "critical" ? "Crítico" : 
                                  alert.status === "high" ? "Alto" : 
                                  alert.status === "medium" ? "Médio" : "Baixo"}
                                  <HelpCircle className="ml-1 h-3.5 w-3.5" />
                                </span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="w-64 p-3">
                              <div className="space-y-2">
                                <p className="font-medium text-sm">Severidade do Alerta</p>
                                <p className="text-xs text-gray-600">
                                  {alert.status === "critical" ? 
                                    "Situação crítica que requer ação imediata. Impacto severo em serviços essenciais." : 
                                  alert.status === "high" ? 
                                    "Problema de alto impacto que afeta múltiplos usuários ou processos críticos." :
                                  alert.status === "medium" ? 
                                    "Problema de médio impacto. Afeta funções importantes, mas existem alternativas." :
                                    "Problema de baixo impacto. Afeta funções secundárias ou não-críticas."}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Definida pelo sistema de monitoramento com base nos limiares configurados.
                                </p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <PriorityBadge 
                          priority={alert.finalPriority} 
                          asButton={true}
                        />
                      </div>
                      <h3 className="text-lg font-bold">{alert.message}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Cliente: {alert.client} | Ativo: {alert.asset} (ID: {alert.assetId})
                      </p>
                    </div>
                    
                    <div className="flex items-center">
                      {alert.ticketId && (
                        <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium mr-2">
                          Chamado #{alert.ticketId}
                        </div>
                      )}
                      
                      {/* Status do alerta com a mesma lógica da tabela de alertas ativos */}
                      {alert.monitoringStatus === "reconhecido" ? (
                        <div className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Reconhecido
                        </div>
                      ) : alert.ticketId ? (
                        <div className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Aberto
                        </div>
                      ) : (
                        <div className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          <span className="flex items-center">
                            Pendente
                            {getTimeWithoutActionIndicator(alert.time)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* SLA indicator se tiver chamado */}
                  {alert.ticketId && !alert.slaPaused && !alert.slaViolated && (
                    <div className="mb-4 flex justify-end">
                      <SlaRiskIndicator 
                        deadline={alert.resolutionDeadline} 
                        totalDuration={alert.resolutionTime} 
                      />
                    </div>
                  )}
                  
                  {/* Seção expandida */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-6">
                      {/* Status de Monitoramento */}
                      <div>
                        <h4 className="text-lg font-medium mb-3">Status do Alerta</h4>
                        <MonitoringStatusPanel 
                          status={alert.monitoringStatus}
                          source={alert.monitoringSource}
                          monitoringId={alert.monitoringId}
                          ticketId={alert.ticketId}
                        />
                      </div>
                      
                      {/* SLA e Matriz (apenas se tiver chamado) */}
                      {alert.ticketId && (
                        <>
                          <div>
                            <h4 className="text-lg font-medium mb-3">SLA & Priorização</h4>
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
                                <Card>
                                  <CardContent className="p-4">
                                    <h5 className="text-sm font-medium mb-2">Matriz de Prioridade</h5>
                                    <PriorityMatrix
                                      highlightTechnical={alert.technicalCriticality}
                                      highlightBusiness={alert.businessCriticality}
                                    />
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-lg font-medium mb-3">Histórico Detalhado</h4>
                            <SimpleAlertHistory 
                              alertId={alert.id}
                              createdAt={alert.createdAt}
                              status={alert.monitoringStatus}
                              hasTicket={!!alert.ticketId}
                              ticketType={alert.ticketId ? "automático" : undefined}
                              ticketCreatedAt={alert.ticketCreatedAt}
                              acknowledgedAt={alert.monitoringStatus === "reconhecido" ? 
                                new Date(Date.parse(alert.createdAt) + 5 * 60000).toISOString() : 
                                undefined}
                              resolvedAt={alert.monitoringStatus === "normalizado" ? 
                                new Date(Date.parse(alert.createdAt) + 25 * 60000).toISOString() : 
                                undefined}
                            />
                          </div>
                        </>
                      )}
                      
                      {/* Contatos de Suporte - sempre exibir, independente do status do ticket */}
                      <div>
                        <h4 className="text-lg font-medium mb-3">Contatos para Acionamento</h4>
                        <SupportContactsPanel 
                          assetId={alert.assetId}
                          assetType={alert.asset}
                          severity={alert.status}
                          serviceLevel={alert.serviceLevel}
                          serviceHours={alert.serviceHours}
                          ticketId={alert.ticketId}
                          isAcknowledged={alert.monitoringStatus === "reconhecido"}
                          time={alert.time}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Botões de ação */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <Button
                      variant="ghost"
                      onClick={() => toggleExpandAlert(alert.id)}
                      className="flex items-center space-x-1"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          <span>Recolher</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          <span>Expandir</span>
                        </>
                      )}
                    </Button>
                    
                    <div className="flex space-x-2">
                      {canCreateTicket && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleCreateTicket(alert.id)}
                        >
                          Criar Chamado
                        </Button>
                      )}
                      
                      {canAcknowledge && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAcknowledge(alert.id)}
                        >
                          Reconhecer
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}