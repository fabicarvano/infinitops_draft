import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  Bell, 
  TicketPlus, 
  ArrowUpRight, 
  AlertCircle, 
  CheckCircle, 
  AlertOctagon,
  Clock,
  FileText,
  Info,
  X,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
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
import SimpleAlertHistory from "@/components/monitoring/SimpleAlertHistory";
import SlaRiskIndicator from "@/components/sla/SlaRiskIndicator";
import SupportContactsPanel from "@/components/support/SupportContactsPanel";
import PriorityBadge from "@/components/sla/PriorityBadge";

// Tipos para a API de alertas
type ApiSeverity = "0" | "1" | "2" | "3" | "4" | "5";
type AlertSeverity = "not_classified" | "information" | "warning" | "average" | "high" | "disaster";
type SystemSeverity = "nao_classificado" | "informativo" | "aviso" | "medio" | "alto" | "critico";
type AlertStatus = "open" | "acknowledged" | "resolved";
type TicketStatus = "aberto" | "pendente" | "reconhecido" | "resolvido";
type TicketCreationType = "automatico" | "manual"; // apenas para histórico interno

// Tipos necessários para o SLA-Demo
type SlaDemoSeverity = "critical" | "high" | "medium" | "low";
type MonitoringStatus = "ativo" | "normalizado" | "flapping" | "reconhecido" | "suprimido";
type TechnicalCriticality = "Information" | "Warning" | "Average" | "High" | "Disaster";
type BusinessCriticality = 0 | 1 | 2 | 3 | 4 | 5;
type PriorityLevel = "Crítica" | "Muito Alta" | "Alta" | "Média" | "Baixa" | "Muito Baixa";

// Cores para os status de alertas
const STATUS_COLORS = {
  critical: "border-red-200 text-red-700 hover:bg-red-50",
  high: "border-orange-200 text-orange-700 hover:bg-orange-50",
  medium: "border-yellow-200 text-yellow-700 hover:bg-yellow-50",
  low: "border-blue-200 text-blue-700 hover:bg-blue-50"
};

interface Alert {
  id: number;
  severity: SystemSeverity; // Severidade já mapeada para o sistema
  apiSeverity: ApiSeverity; // Código original da API
  client: string;
  asset: string;
  assetId: number;
  message: string;
  time: string;
  status: AlertStatus;
  ticketId?: number;
  ticketStatus?: TicketStatus;
  ticketCreationType?: TicketCreationType; // apenas para histórico interno
  isAcknowledged: boolean;
}

// Tipo para os filtros disponíveis
type FilterType = "critical" | "open" | "pending" | null;

// Interface para alertas formatados para o SLA-Demo
interface DemoAlert {
  id: number;
  status: SlaDemoSeverity;
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

export default function Alerts() {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const { toast } = useToast();
  
  // Estado para controlar quais alertas estão expandidos, reconhecidos ou com chamados
  const [expandedAlerts, setExpandedAlerts] = useState<number[]>([]);
  const [acknowledged, setAcknowledged] = useState<number[]>([]);
  const [createdTickets, setCreatedTickets] = useState<number[]>([]);

  // Função para extrair parâmetros da URL
  const getURLParameter = (paramName: string): string | null => {
    const params = new URLSearchParams(window.location.search);
    return params.get(paramName);
  };

  // Ao carregar a página, verificar se existe parâmetro de busca na URL
  useEffect(() => {
    const searchParam = getURLParameter("search");
    if (searchParam) {
      setSearchTerm(decodeURIComponent(searchParam));
    }
  }, [location]);

  // Função para mapear códigos de severidade da API para valores do sistema
  const mapApiSeverityToSystem = (apiSeverity: ApiSeverity): SystemSeverity => {
    switch (apiSeverity) {
      case "0": return "nao_classificado";
      case "1": return "informativo";
      case "2": return "aviso";
      case "3": return "medio";
      case "4": return "alto";
      case "5": return "critico";
      default: return "nao_classificado";
    }
  };

  // Dados de exemplo para alertas
  const alerts: Alert[] = [
    {
      id: 1,
      apiSeverity: "5",
      severity: "critico",
      client: "Empresa XYZ",
      asset: "SRV-DB01",
      assetId: 1,
      message: "Disco crítico (98%)",
      time: "12m atrás",
      ticketId: 1001,
      status: "open",
      isAcknowledged: false
    },
    {
      id: 2,
      apiSeverity: "3",
      severity: "medio",
      client: "Empresa ABC",
      asset: "RTR-EDGE-03",
      assetId: 2,
      message: "Tráfego acima do normal",
      time: "27m atrás",
      ticketId: undefined,
      status: "open",
      isAcknowledged: false
    },
    {
      id: 3,
      apiSeverity: "5",
      severity: "critico",
      client: "Tech Solutions",
      asset: "SRV-WEB02",
      assetId: 3,
      message: "Serviço Apache indisponível",
      time: "43m atrás",
      ticketId: 1003,
      status: "open",
      isAcknowledged: false
    },
    {
      id: 4,
      apiSeverity: "3",
      severity: "medio",
      client: "Empresa XYZ",
      asset: "NAS-BACKUP",
      assetId: 4,
      message: "Falha no backup noturno",
      time: "1h 12m atrás",
      ticketId: 1004,
      status: "open",
      isAcknowledged: false
    },
    {
      id: 5,
      apiSeverity: "2",
      severity: "aviso",
      client: "Empresa DEF",
      asset: "RTR-CORE-01",
      assetId: 5,
      message: "Latência elevada",
      time: "1h 38m atrás",
      ticketId: undefined,
      status: "open",
      isAcknowledged: false
    },
    {
      id: 6,
      apiSeverity: "1",
      severity: "informativo",
      client: "Tech Solutions",
      asset: "SRV-WEB01",
      assetId: 6,
      message: "Reinício programado em 30 minutos",
      time: "2h atrás",
      ticketId: undefined,
      status: "open",
      isAcknowledged: true
    },
    {
      id: 7,
      apiSeverity: "4",
      severity: "alto",
      client: "Empresa ABC",
      asset: "FW-MAIN",
      assetId: 7,
      message: "Alto uso de CPU",
      time: "45m atrás",
      ticketId: 1007,
      status: "open",
      isAcknowledged: false
    },
    {
      id: 8,
      apiSeverity: "2",
      severity: "aviso",
      client: "Empresa XYZ",
      asset: "SW-DIST-02",
      assetId: 8,
      message: "Tráfego elevado na porta 24",
      time: "1h 5m atrás",
      ticketId: undefined,
      status: "open",
      isAcknowledged: false
    },
    {
      id: 9,
      apiSeverity: "0",
      severity: "nao_classificado",
      client: "Tech Solutions",
      asset: "SRV-LOG",
      assetId: 9,
      message: "Alerta não classificado",
      time: "3h atrás",
      ticketId: undefined,
      status: "open",
      isAcknowledged: false
    },
  ];

  // Função para verificar se o alerta é de alta severidade (Alto ou Crítico)
  const isHighSeverity = (severity: SystemSeverity): boolean => {
    return severity === "alto" || severity === "critico";
  };

  // Verificamos se o alerta precisa estar no card "Alertas sem Chamados"
  // Alertas no card: Não reconhecidos OU sem chamados abertos (exceto Alta/Crítica que já têm chamados automáticos)
  const pendingAlerts = alerts.filter(alert => 
    !isHighSeverity(alert.severity) && // Não é de alta severidade
    (!alert.isAcknowledged || !alert.ticketId) // Não reconhecido OU sem chamado
  );

  // Contagem de alertas por severidade e chamados
  const criticalAlerts = alerts.filter(alert => alert.severity === "critico");
  const openTickets = alerts.filter(alert => alert.ticketId !== undefined);
  const mediumAlerts = alerts.filter(alert => 
    ["medio", "aviso", "informativo", "nao_classificado"].includes(alert.severity)
  );
  
  // Função para filtrar alertas baseado no filtro ativo
  const getFilteredAlerts = () => {
    if (!activeFilter) return alerts;
    
    switch (activeFilter) {
      case "critical":
        return alerts.filter(alert => alert.severity === "critico");
      case "open":
        return alerts.filter(alert => alert.ticketId !== undefined);
      case "pending":
        return alerts.filter(alert => 
          !isHighSeverity(alert.severity) && 
          (!alert.isAcknowledged || !alert.ticketId)
        );
      default:
        return alerts;
    }
  };
  
  // Alertas filtrados para exibição na tabela
  const filteredAlerts = getFilteredAlerts().filter(alert => 
    alert.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.message.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Transformar alertas para o formato do SLA-Demo
  const demoAlerts: DemoAlert[] = filteredAlerts.map(alert => {
    // Determinar criticidade de negócio simulada (baseada no ID do ativo)
    const businessCriticality = (alert.assetId % 6) as BusinessCriticality;
    
    // Determinar criticidade técnica
    const technicalCriticality = mapSeverityToTechnicalCriticality(alert.severity);
    
    // Calcular valores de SLA
    const slaValues = calculateSlaValues(technicalCriticality, businessCriticality);
    
    // Verificar se o alerta está reconhecido
    const isAcknowledged = alert.isAcknowledged || acknowledged.includes(alert.id);
    
    // Verificar se o alerta tem chamado (original ou criado pelo usuário)
    const ticketId = alert.ticketId || (createdTickets.includes(alert.id) ? 1000 + alert.id : undefined);
    
    // Criar data de criação do alerta (para demonstração, usamos a data atual - X minutos)
    const createdAt = (() => {
      const now = new Date();
      let timeString = alert.time;
      
      if (timeString.includes('h') && timeString.includes('m')) {
        // Formato "Xh Ym atrás"
        const hourPart = parseInt(timeString.split('h')[0]);
        const minutePart = parseInt(timeString.split('h')[1].split('m')[0].trim());
        return new Date(now.getTime() - (hourPart * 60 + minutePart) * 60000).toISOString();
      } else if (timeString.includes('h')) {
        // Formato "Xh atrás"
        const hours = parseInt(timeString.split('h')[0]);
        return new Date(now.getTime() - hours * 60 * 60000).toISOString();
      } else if (timeString.includes('m')) {
        // Formato "Xm atrás"
        const minutes = parseInt(timeString.split('m')[0]);
        return new Date(now.getTime() - minutes * 60000).toISOString();
      }
      
      return new Date().toISOString();
    })();
    
    // Data de criação do chamado (se existir)
    const ticketCreatedAt = ticketId 
      ? new Date(Date.parse(createdAt) + 60000).toISOString() // 1 minuto após a criação do alerta
      : undefined;
      
    // Determinar status de monitoramento
    let monitoringStatus: MonitoringStatus = "ativo";
    if (isAcknowledged) monitoringStatus = "reconhecido";
    
    return {
      id: alert.id,
      status: mapSystemToSlaDemoSeverity(alert.severity),
      client: alert.client,
      asset: alert.asset,
      assetId: alert.assetId,
      message: alert.message,
      time: alert.time,
      createdAt,
      // Campos de monitoramento
      monitoringStatus,
      monitoringSource: "Zabbix",
      monitoringId: `ZBX-${alert.id}`,
      // Campos de SLA
      ticketId,
      ticketCreatedAt,
      finalPriority: slaValues.finalPriority,
      serviceLevel: businessCriticality >= 3 ? "Platinum" : (businessCriticality >= 1 ? "Premium" : "Standard"),
      technicalCriticality,
      businessCriticality,
      // Tempos e prazos de SLA
      firstResponseTime: slaValues.firstResponseTime,
      resolutionTime: slaValues.resolutionTime,
      firstResponseDeadline: slaValues.firstResponseDeadline,
      resolutionDeadline: slaValues.resolutionDeadline,
      serviceHours: slaValues.serviceHours,
      adjustmentFactor: slaValues.adjustmentFactor,
      isAdjustmentEnabled: businessCriticality > 0,
      slaPaused: false,
      slaViolated: false
    };
  });
  
  // Função para aplicar ou remover um filtro
  const handleFilter = (filterType: FilterType) => {
    // Se o mesmo filtro já estiver ativo, desativamos
    if (activeFilter === filterType) {
      setActiveFilter(null);
    } else {
      setActiveFilter(filterType);
    }
  };

  // Mapeia a severidade do sistema para um badge visual
  const getSeverityBadge = (severity: SystemSeverity) => {
    switch (severity) {
      case "critico":
        return <Badge className="bg-red-100 text-red-700">Crítico</Badge>;
      case "alto":
        return <Badge className="bg-orange-100 text-orange-700">Alto</Badge>;
      case "medio":
        return <Badge className="bg-yellow-100 text-yellow-700">Médio</Badge>;
      case "aviso":
        return <Badge className="bg-blue-100 text-blue-700">Aviso</Badge>;
      case "informativo":
        return <Badge className="bg-green-100 text-green-700">Informativo</Badge>;
      case "nao_classificado":
      default:
        return <Badge className="bg-slate-100 text-slate-700">Não classificado</Badge>;
    }
  };

  // Obtem ícone baseado na severidade
  const getSeverityIcon = (severity: SystemSeverity) => {
    switch (severity) {
      case "critico":
        return <AlertOctagon className="h-4 w-4 mr-1 text-red-600" />;
      case "alto":
        return <AlertTriangle className="h-4 w-4 mr-1 text-orange-600" />;
      case "medio":
        return <AlertTriangle className="h-4 w-4 mr-1 text-yellow-600" />;
      case "aviso":
        return <AlertCircle className="h-4 w-4 mr-1 text-blue-600" />;
      case "informativo":
        return <Info className="h-4 w-4 mr-1 text-green-600" />;
      case "nao_classificado":
      default:
        return <AlertCircle className="h-4 w-4 mr-1 text-slate-600" />;
    }
  };

  // Função para calcular indicador de tempo para alertas pendentes
  const getTimeWithoutActionIndicator = (timeString: string) => {
    // Nesta função de demonstração, vamos usar o formato "Xm atrás" e "Xh Ym atrás" para simular
    // Em um ambiente real, usaríamos timestamps reais e cálculos de diferença de tempo
    
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
      return <div className="flex items-center ml-2 text-red-600">
        <Clock className="h-3 w-3 mr-1" />
        <span className="text-xs font-medium">+10min</span>
      </div>;
    } else if (minutes >= 5) {
      return <div className="flex items-center ml-2 text-orange-600">
        <Clock className="h-3 w-3 mr-1" />
        <span className="text-xs font-medium">+5min</span>
      </div>;
    } else if (minutes >= 2) {
      return <div className="flex items-center ml-2 text-yellow-600">
        <Clock className="h-3 w-3 mr-1" />
        <span className="text-xs font-medium">+2min</span>
      </div>;
    } else if (minutes >= 1) {
      return <div className="flex items-center ml-2 text-yellow-500">
        <Clock className="h-3 w-3 mr-1" />
        <span className="text-xs font-medium">+1min</span>
      </div>;
    }
    
    // Menos de 1 minuto, não mostramos indicador
    return null;
  };

  // Simplificando os status de acordo com as regras de negócio
  const getStatusBadge = (alert: Alert) => {
    // Status Reconhecido
    if (alert.isAcknowledged) {
      return <Badge className="bg-green-100 text-green-700">Reconhecido</Badge>;
    }
    
    // Status Aberto (quando tem chamado) - agora com cor amarela
    if (alert.ticketId) {
      return <Badge className="bg-yellow-100 text-yellow-700">Aberto</Badge>;
    }
    
    // Status Pendente (quando não tem chamado e não foi reconhecido) - agora com cor azul
    // Para alertas pendentes, adicionamos o indicador de tempo
    return (
      <div className="flex items-center">
        <Badge className="bg-blue-100 text-blue-700">Pendente</Badge>
        {getTimeWithoutActionIndicator(alert.time)}
      </div>
    );
  };
  
  // Mapear severidade do sistema para o formato SLA-Demo
  const mapSystemToSlaDemoSeverity = (severity: SystemSeverity): SlaDemoSeverity => {
    switch (severity) {
      case "critico": return "critical";
      case "alto": return "high";
      case "medio": return "medium";
      case "aviso": 
      case "informativo": 
      case "nao_classificado":
      default: return "low";
    }
  };
  
  // Mapear status do alerta para o formato MonitoringStatus
  const mapStatusToMonitoringStatus = (alert: Alert): MonitoringStatus => {
    if (alert.isAcknowledged) return "reconhecido";
    if (alert.status === "resolved") return "normalizado";
    return "ativo";
  };
  
  // Mapear criticidade técnica com base na severidade do alerta
  const mapSeverityToTechnicalCriticality = (severity: SystemSeverity): TechnicalCriticality => {
    switch (severity) {
      case "critico": return "Disaster";
      case "alto": return "High";
      case "medio": return "Average";
      case "aviso": return "Warning";
      case "informativo": 
      case "nao_classificado":
      default: return "Information";
    }
  };
  
  // Calcular valores de SLA com base na criticidade técnica e de negócio
  const calculateSlaValues = (techCriticality: TechnicalCriticality, businessCriticality: BusinessCriticality): {
    firstResponseTime: number;
    resolutionTime: number;
    firstResponseDeadline: string;
    resolutionDeadline: string;
    serviceHours: string;
    adjustmentFactor: number;
    finalPriority: PriorityLevel;
  } => {
    // Tempos base de SLA baseados na criticidade técnica
    let baseFirstResponse: number;
    let baseResolution: number;
    let serviceHours: string;
    
    switch (techCriticality) {
      case "Disaster":
        baseFirstResponse = 15; // 15 minutos
        baseResolution = 120; // 2 horas
        serviceHours = "24x7";
        break;
      case "High":
        baseFirstResponse = 30; // 30 minutos
        baseResolution = 240; // 4 horas
        serviceHours = "24x7";
        break;
      case "Average":
        baseFirstResponse = 60; // 1 hora
        baseResolution = 480; // 8 horas
        serviceHours = "8x5";
        break;
      case "Warning":
        baseFirstResponse = 120; // 2 horas
        baseResolution = 1440; // 24 horas
        serviceHours = "8x5";
        break;
      case "Information":
      default:
        baseFirstResponse = 240; // 4 horas
        baseResolution = 2880; // 48 horas
        serviceHours = "8x5";
        break;
    }
    
    // Fator de ajuste baseado na criticidade de negócio (0-5)
    // Quanto maior a criticidade, menor o tempo (maior a prioridade)
    const adjustmentFactor = businessCriticality === 0 ? 1 : 1 - (businessCriticality * 0.1);
    
    // Aplicar o fator de ajuste
    const firstResponseTime = Math.round(baseFirstResponse * adjustmentFactor);
    const resolutionTime = Math.round(baseResolution * adjustmentFactor);
    
    // Calcular prazos (simplificado para demonstração - apenas adicionamos os minutos à data atual)
    const now = new Date();
    const firstResponseDeadline = new Date(now.getTime() + firstResponseTime * 60000).toISOString();
    const resolutionDeadline = new Date(now.getTime() + resolutionTime * 60000).toISOString();
    
    // Determinar prioridade final com base nas criticidades combinadas
    let finalPriority: PriorityLevel;
    const totalScore = (["Disaster", "High", "Average", "Warning", "Information"].indexOf(techCriticality) + 1) + (5 - businessCriticality);
    
    if (totalScore <= 2) finalPriority = "Crítica";
    else if (totalScore <= 4) finalPriority = "Muito Alta";
    else if (totalScore <= 6) finalPriority = "Alta";
    else if (totalScore <= 8) finalPriority = "Média";
    else if (totalScore <= 10) finalPriority = "Baixa";
    else finalPriority = "Muito Baixa";
    
    return {
      firstResponseTime,
      resolutionTime,
      firstResponseDeadline,
      resolutionDeadline,
      serviceHours,
      adjustmentFactor,
      finalPriority
    };
  };
  
  // Função para expandir/recolher alertas
  const toggleExpandAlert = (alertId: number) => {
    setExpandedAlerts(prev => 
      prev.includes(alertId)
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };
  
  // Handler para reconhecer alertas
  const handleAcknowledge = (alertId: number) => {
    // Encontrar o alerta
    const alert = alerts.find(a => a.id === alertId);
    
    // Verificar se o alerta está pendente (sem chamado e não reconhecido)
    if (!alert || alert.ticketId || alert.isAcknowledged) {
      toast({
        title: "Ação não permitida",
        description: "Apenas alertas pendentes podem ser reconhecidos.",
        variant: "destructive",
      });
      return;
    }
    
    setAcknowledged(prev => [...prev, alertId]);
    
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
    const alert = alerts.find(a => a.id === alertId);
    const alertIsHighSeverity = alert && (alert.severity === "critico" || alert.severity === "alto");
    
    toast({
      title: "Chamado criado",
      description: `Chamado para o alerta #${alertId} foi criado com sucesso.`,
      variant: "default",
    });
  };

  // Funções para gerenciar ações nos alertas
  const handleGoToTicket = (ticketId?: number) => {
    if (ticketId) {
      toast({
        title: "Redirecionando",
        description: `Indo para o chamado #${ticketId}`,
        variant: "default"
      });
    } else {
      handleCreateTicket(0); // Parâmetro fictício, não será usado
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar alertas..."
            className="w-full pl-9 border-slate-200"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          className="w-full sm:w-auto border-green-700 text-green-700 hover:bg-green-50"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Card de Alertas Críticos */}
        <div className={`card overflow-hidden border-l-4 border-l-red-500 transition-all duration-200 ${activeFilter === "critical" ? "ring-2 ring-red-400 shadow-lg" : ""}`}>
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="bg-red-50 p-2 rounded-lg mr-3">
                  <AlertOctagon className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <Badge className="bg-red-100 text-red-700 mb-1">Crítico</Badge>
                  <h3 className="font-medium">{criticalAlerts.length} alertas críticos</h3>
                </div>
              </div>
              {activeFilter === "critical" && (
                <Button 
                  size="sm"
                  variant="ghost" 
                  className="h-7 w-7 p-0 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveFilter(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-slate-500 text-sm mb-4">
              Alertas que precisam de atenção imediata
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              className={`w-full ${activeFilter === "critical" 
                ? "bg-red-50 border-red-300 text-red-700 hover:bg-red-100" 
                : "border-red-200 text-red-700 hover:bg-red-50"}`}
              onClick={() => handleFilter("critical")}
            >
              {activeFilter === "critical" ? "Filtro ativo" : "Ver alertas críticos"}
              {activeFilter === "critical" && <Filter className="ml-2 h-3 w-3" />}
            </Button>
          </div>
        </div>
        
        {/* Card de Alertas Abertos (Chamados) */}
        <div className={`card overflow-hidden border-l-4 border-l-yellow-500 transition-all duration-200 ${activeFilter === "open" ? "ring-2 ring-yellow-400 shadow-lg" : ""}`}>
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="bg-yellow-50 p-2 rounded-lg mr-3">
                  <TicketPlus className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <Badge className="bg-yellow-100 text-yellow-700 mb-1">Aberto</Badge>
                  <h3 className="font-medium">{openTickets.length} chamados abertos</h3>
                </div>
              </div>
              {activeFilter === "open" && (
                <Button 
                  size="sm"
                  variant="ghost" 
                  className="h-7 w-7 p-0 rounded-full text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveFilter(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-slate-500 text-sm mb-4">
              Chamados que estão em atendimento
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              className={`w-full ${activeFilter === "open" 
                ? "bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100" 
                : "border-yellow-200 text-yellow-700 hover:bg-yellow-50"}`}
              onClick={() => handleFilter("open")}
            >
              {activeFilter === "open" ? "Filtro ativo" : "Ver chamados abertos"}
              {activeFilter === "open" && <Filter className="ml-2 h-3 w-3" />}
            </Button>
          </div>
        </div>

        {/* Card de Alertas Pendentes */}
        <div className={`card overflow-hidden border-l-4 border-l-blue-500 transition-all duration-200 ${activeFilter === "pending" ? "ring-2 ring-blue-400 shadow-lg" : ""}`}>
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="bg-blue-50 p-2 rounded-lg mr-3">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <Badge className="bg-blue-100 text-blue-700 mb-1">Pendentes</Badge>
                  <h3 className="font-medium">{pendingAlerts.length} alertas sem chamados</h3>
                </div>
              </div>
              {activeFilter === "pending" && (
                <Button 
                  size="sm"
                  variant="ghost" 
                  className="h-7 w-7 p-0 rounded-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveFilter(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-slate-500 text-sm mb-4">
              Alertas que precisam ser reconhecidos ou terem chamados abertos
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              className={`w-full ${activeFilter === "pending" 
                ? "bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100" 
                : "border-blue-200 text-blue-700 hover:bg-blue-50"}`}
              onClick={() => handleFilter("pending")}
            >
              {activeFilter === "pending" ? "Filtro ativo" : "Ver alertas pendentes"}
              {activeFilter === "pending" && <Filter className="ml-2 h-3 w-3" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Tabela de Alertas Ativos */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-red-50 p-2 rounded-lg mr-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="title text-lg">Alertas Ativos</h3>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800"
          >
            Atualizar
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-200">
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Severidade</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Cliente</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Ativo</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Mensagem</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Status</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Início</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.map((alert) => {
                // Determina se o alerta é de alta severidade (alto ou crítico)
                const highSeverityAlert = isHighSeverity(alert.severity);
                
                return (
                  <TableRow key={alert.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <TableCell>
                      <div className="flex items-center">
                        {getSeverityIcon(alert.severity)}
                        {getSeverityBadge(alert.severity)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{alert.client}</TableCell>
                    <TableCell>{alert.asset}</TableCell>
                    <TableCell>{alert.message}</TableCell>
                    <TableCell>{getStatusBadge(alert)}</TableCell>
                    <TableCell>{alert.time}</TableCell>
                    <TableCell className="text-right">
                      {/* Ações diferentes dependendo do tipo de alerta */}
                      {highSeverityAlert ? (
                        /* Alertas alto/crítico: apenas ver chamado */
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-800"
                          onClick={() => handleGoToTicket(alert.ticketId)}
                        >
                          <FileText className="mr-1 h-4 w-4" />
                          Ver Chamado
                        </Button>
                      ) : (
                        /* Alertas de menor severidade: reconhecer ou criar chamado */
                        <div className="flex space-x-2 justify-end">
                          {!alert.isAcknowledged && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800"
                              onClick={() => handleAcknowledge(alert.id)}
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Reconhecer
                            </Button>
                          )}
                          
                          {/* Só mostramos o botão "Criar Chamado" se o alerta NÃO tiver chamado E NÃO estiver reconhecido */}
                          {!alert.ticketId && !alert.isAcknowledged && (
                            <Button 
                              size="sm" 
                              variant="default"
                              className="bg-blue-700 hover:bg-blue-800"
                              onClick={() => handleGoToTicket(alert.ticketId)}
                            >
                              <TicketPlus className="mr-1 h-4 w-4" />
                              Criar Chamado
                            </Button>
                          )}
                          
                          {alert.ticketId && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-800"
                              onClick={() => handleGoToTicket(alert.ticketId)}
                            >
                              <ArrowUpRight className="mr-1 h-4 w-4" />
                              Chamado #{alert.ticketId}
                            </Button>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
