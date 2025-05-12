import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import AlertMonitoringInfo from "@/components/monitoring/AlertMonitoringInfo";

// Importar componentes do sistema de tickets
import { CreateTicketModal, CreateTicketData } from "@/components/tickets/CreateTicketModal";
import { TicketModal } from "@/components/tickets/TicketModal";

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
  low: "border-green-200 text-green-700 hover:bg-green-50"
};

// Interface para os alertas do sistema
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
type FilterType = "all" | "critical" | "open" | "acknowledged";

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

interface AlternateAlertsViewProps {
  className?: string;
}

export function AlternateAlertsView({ className = "" }: AlternateAlertsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "critical" | "open" | "acknowledged">("all");
  const [acknowledged, setAcknowledged] = useState<number[]>([]);
  const [createdTickets, setCreatedTickets] = useState<number[]>([]);
  const [expandedAlerts, setExpandedAlerts] = useState<number[]>([]);
  const { toast } = useToast();
  
  // Estados para gerenciar os modais de tickets
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [selectedAlertId, setSelectedAlertId] = useState<number | undefined>(undefined);
  const [selectedTicketId, setSelectedTicketId] = useState<number | undefined>(undefined);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [alertInfoForTicket, setAlertInfoForTicket] = useState<{
    id: number;
    message: string;
    severity: string;
    asset: {
      id: number;
      name: string;
      type: string;
    };
    client: {
      id: number;
      name: string;
    };
  } | undefined>(undefined);
  
  // Função para extrair parâmetros da URL
  const getURLParameter = (paramName: string): string | null => {
    const params = new URLSearchParams(window.location.search);
    return params.get(paramName);
  };

  // Ao carregar a página, verificar se existe parâmetro de busca na URL
  useEffect(() => {
    const searchParam = getURLParameter("search");
    if (searchParam) {
      setSearchTerm(searchParam);
    }
    
    const filterParam = getURLParameter("filter") as FilterType;
    if (filterParam) {
      setActiveFilter(filterParam);
    }
  }, []);

  // Dados de exemplo para alertas
  const alerts: Alert[] = [
    {
      id: 1,
      severity: "critico",
      apiSeverity: "5",
      client: "Banco Nacional",
      asset: "Servidor Web Produção",
      assetId: 101,
      message: "CPU load critical (95%)",
      time: "8m atrás",
      status: "open",
      ticketId: 5001,
      ticketStatus: "aberto",
      ticketCreationType: "automatico",
      isAcknowledged: false
    },
    {
      id: 2,
      severity: "alto",
      apiSeverity: "4",
      client: "Empresa ABC",
      asset: "Firewall Principal",
      assetId: 102,
      message: "Multiple connection attempts failed",
      time: "15m atrás",
      status: "open",
      isAcknowledged: false
    },
    {
      id: 3,
      severity: "medio",
      apiSeverity: "3",
      client: "Empresa XYZ",
      asset: "Switch Core",
      assetId: 103,
      message: "Port errors detected",
      time: "30m atrás",
      status: "open",
      isAcknowledged: true
    },
    {
      id: 4,
      severity: "aviso",
      apiSeverity: "2",
      client: "Empresa DEF",
      asset: "Storage Array",
      assetId: 104,
      message: "Disk space warning (85% used)",
      time: "1h atrás",
      status: "open",
      ticketId: 5002,
      ticketStatus: "aberto",
      ticketCreationType: "manual",
      isAcknowledged: false
    },
    {
      id: 5,
      severity: "informativo",
      apiSeverity: "1",
      client: "Empresa GHI",
      asset: "Servidor de Backup",
      assetId: 105,
      message: "Backup job completed successfully",
      time: "2h atrás",
      status: "open",
      isAcknowledged: false
    }
  ];
  
  // Função para filtrar alertas baseado no filtro ativo
  const getFilteredAlerts = () => {
    switch (activeFilter) {
      case "critical":
        return alerts.filter(alert => alert.severity === "critico" || alert.severity === "alto");
      case "open":
        return alerts.filter(alert => alert.ticketId || createdTickets.includes(alert.id));
      case "acknowledged":
        return alerts.filter(alert => alert.isAcknowledged || acknowledged.includes(alert.id));
      case "all":
      default:
        return alerts;
    }
  };
  
  // Handler para alterar o filtro ativo
  const handleFilter = (filter: "all" | "critical" | "open" | "acknowledged") => {
    if (activeFilter === filter) {
      setActiveFilter("all");
    } else {
      setActiveFilter(filter);
    }
  };
  
  // Mapeia a severidade da API para a severidade do sistema
  const mapApiSeverityToSystemSeverity = (apiSeverity: ApiSeverity): SystemSeverity => {
    switch (apiSeverity) {
      case "5":
        return "critico";
      case "4":
        return "alto";
      case "3":
        return "medio";
      case "2":
        return "aviso";
      case "1":
        return "informativo";
      case "0":
      default:
        return "nao_classificado";
    }
  };
  
  // Mapeia a severidade do sistema para a severidade da interface do SLA-Demo
  const mapSystemSeverityToSlaDemoSeverity = (systemSeverity: SystemSeverity): SlaDemoSeverity => {
    switch (systemSeverity) {
      case "critico":
        return "critical";
      case "alto":
        return "high";
      case "medio":
        return "medium";
      case "aviso":
      case "informativo":
      case "nao_classificado":
      default:
        return "low";
    }
  };
  
  // Mapeia o status do alerta para o status de monitoramento
  const mapStatusToMonitoringStatus = (alert: Alert): MonitoringStatus => {
    // Na implementação real, usaríamos um mapeamento mais complexo baseado no status do alerta
    if (alert.isAcknowledged || acknowledged.includes(alert.id)) {
      return "reconhecido";
    }
    
    return "ativo";
  };
  
  // Mapeia a severidade do sistema para a criticidade técnica
  const mapSeverityToTechnicalCriticality = (severity: SystemSeverity): TechnicalCriticality => {
    switch (severity) {
      case "critico":
        return "Disaster";
      case "alto":
        return "High";
      case "medio":
        return "Average";
      case "aviso":
        return "Warning";
      case "informativo":
      case "nao_classificado":
      default:
        return "Information";
    }
  };
  
  // Calcula os valores de SLA baseado na criticidade técnica e de negócio
  const calculateSlaValues = (techCriticality: TechnicalCriticality, businessCriticality: BusinessCriticality): {
    finalPriority: PriorityLevel;
    firstResponseTime: number;
    resolutionTime: number;
    firstResponseDeadline: string;
    resolutionDeadline: string;
    serviceHours: string;
    adjustmentFactor: number;
  } => {
    // Base de tempo de resposta em minutos para cada criticidade técnica
    let firstResponseTime = 0;
    let resolutionTime = 0;
    let serviceHours = "8x5";
    
    // Define tempos base baseado na criticidade técnica
    switch (techCriticality) {
      case "Disaster":
        firstResponseTime = 15;
        resolutionTime = 120;
        serviceHours = "24x7";
        break;
      case "High":
        firstResponseTime = 30;
        resolutionTime = 240;
        serviceHours = "24x7";
        break;
      case "Average":
        firstResponseTime = 60;
        resolutionTime = 480;
        serviceHours = "12x7";
        break;
      case "Warning":
        firstResponseTime = 120;
        resolutionTime = 960;
        serviceHours = "8x5";
        break;
      case "Information":
      default:
        firstResponseTime = 240;
        resolutionTime = 1920;
        serviceHours = "8x5";
        break;
    }
    
    // Aplicar ajuste baseado na criticidade de negócio
    // Quanto maior a criticidade, menor o tempo de resposta
    const businessAdjustment = 1 - (businessCriticality * 0.1);
    firstResponseTime = Math.round(firstResponseTime * businessAdjustment);
    resolutionTime = Math.round(resolutionTime * businessAdjustment);
    
    // Gerar datas de prazo baseado nos tempos calculados
    const now = new Date();
    const firstResponseDeadline = new Date(now.getTime() + firstResponseTime * 60000);
    const resolutionDeadline = new Date(now.getTime() + resolutionTime * 60000);
    
    // Calcular a prioridade final baseado nas criticidades
    let finalPriority: PriorityLevel;
    const criticalitySum = businessCriticality + {
      "Disaster": 5,
      "High": 4,
      "Average": 3,
      "Warning": 2,
      "Information": 1
    }[techCriticality];
    
    if (criticalitySum >= 9) {
      finalPriority = "Crítica";
    } else if (criticalitySum >= 7) {
      finalPriority = "Muito Alta";
    } else if (criticalitySum >= 5) {
      finalPriority = "Alta";
    } else if (criticalitySum >= 3) {
      finalPriority = "Média";
    } else if (criticalitySum >= 2) {
      finalPriority = "Baixa";
    } else {
      finalPriority = "Muito Baixa";
    }
    
    return {
      finalPriority,
      firstResponseTime,
      resolutionTime,
      firstResponseDeadline: firstResponseDeadline.toISOString(),
      resolutionDeadline: resolutionDeadline.toISOString(),
      serviceHours,
      adjustmentFactor: businessAdjustment
    };
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
      ? new Date(Date.parse(createdAt) + 5 * 60000).toISOString() // 5 minutos após o alerta
      : undefined;
    
    // Status de monitoramento (reconhecido ou ativo)
    const monitoringStatus = isAcknowledged ? "reconhecido" : "ativo";
    
    // Determinar fonte de monitoramento (simulado)
    const monitoringSource = "Zabbix";
    
    // Mapeamento para severidade SLA-Demo
    const status = mapSystemSeverityToSlaDemoSeverity(alert.severity);
    
    // Determinar se o SLA está violado ou pausado (simulado)
    const slaPaused = false;
    const slaViolated = false;
    
    return {
      id: alert.id,
      status,
      client: alert.client,
      asset: alert.asset,
      assetId: alert.assetId,
      message: alert.message,
      time: alert.time,
      createdAt,
      monitoringStatus,
      monitoringSource,
      monitoringId: `ZBX-${alert.id + 10000}`,
      ticketId,
      ticketCreatedAt,
      finalPriority: slaValues.finalPriority,
      serviceLevel: "Standard",
      technicalCriticality,
      businessCriticality,
      firstResponseTime: slaValues.firstResponseTime,
      resolutionTime: slaValues.resolutionTime,
      firstResponseDeadline: slaValues.firstResponseDeadline,
      resolutionDeadline: slaValues.resolutionDeadline,
      serviceHours: slaValues.serviceHours,
      adjustmentFactor: slaValues.adjustmentFactor,
      isAdjustmentEnabled: true,
      slaPaused,
      slaViolated
    };
  });
  
  // Função para expandir/recolher um alerta
  const toggleExpandAlert = (alertId: number) => {
    setExpandedAlerts(prev => 
      prev.includes(alertId) 
        ? prev.filter(id => id !== alertId) 
        : [...prev, alertId]
    );
  };
  
  // Função para formatar tempo sem ação (para alertas pendentes)
  const getTimeWithoutActionIndicator = (timeString: string) => {
    // Extrair minutos a partir da string de tempo
    let minutes = 0;
    
    if (timeString.includes('h')) {
      // Formato "Xh atrás" ou "Xh Ym atrás"
      const hours = parseInt(timeString.split('h')[0]);
      minutes = hours * 60;
      
      if (timeString.includes('m')) {
        // Formato "Xh Ym atrás"
        const minutesPart = parseInt(timeString.split('h')[1].split('m')[0].trim());
        minutes += minutesPart;
      }
    } else if (timeString.includes('m')) {
      // Formato "Xm atrás"
      minutes = parseInt(timeString.split('m')[0]);
    }
    
    // Mostrar indicadores visuais baseados no tempo sem ação
    if (minutes >= 30) {
      return <div className="flex items-center ml-2 text-red-600">
        <Clock className="h-3.5 w-3.5 mr-1" />
        <span className="text-xs">{minutes} min</span>
      </div>;
    } else if (minutes >= 15) {
      return <div className="flex items-center ml-2 text-orange-600">
        <Clock className="h-3.5 w-3.5 mr-1" />
        <span className="text-xs">{minutes} min</span>
      </div>;
    } else if (minutes >= 5) {
      return <div className="flex items-center ml-2 text-yellow-600">
        <Clock className="h-3.5 w-3.5 mr-1" />
        <span className="text-xs">{minutes} min</span>
      </div>;
    }
    
    return null;
  };
  
  // Helper para verificar se um alerta é considerado de alta severidade
  const isHighSeverity = (severity: SystemSeverity): boolean => {
    return severity === "critico" || severity === "alto";
  };
  
  // Handler para reconhecer alertas
  const handleAcknowledge = (alertId: number) => {
    // Encontrar o alerta
    const alert = alerts.find(a => a.id === alertId);
    
    // Verificar se o alerta está pendente (sem chamado e não reconhecido)
    if (!alert || alert.ticketId || alert.isAcknowledged) {
      toast({
        title: "Erro",
        description: "Este alerta não pode ser reconhecido.",
        variant: "destructive",
      });
      return;
    }
    
    // Adicionar à lista de alertas reconhecidos
    setAcknowledged(prev => [...prev, alertId]);
    
    toast({
      title: "Alerta reconhecido",
      description: `Alerta #${alertId} foi reconhecido com sucesso.`,
      variant: "default",
    });
  };
  
  // Handler para abrir o modal de criação de chamados
  const handleOpenCreateTicketModal = (alertId: number) => {
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) {
      toast({
        title: "Erro",
        description: "Alerta não encontrado.",
        variant: "destructive",
      });
      return;
    }
    
    // Preparar os dados do alerta para o modal
    setAlertInfoForTicket({
      id: alert.id,
      message: alert.message,
      severity: alert.severity,
      asset: {
        id: alert.assetId,
        name: alert.asset,
        type: "Servidor" // Tipo padrão para demonstração
      },
      client: {
        id: parseInt(alert.id.toString() + "00"), // ID fictício para cliente baseado no ID do alerta
        name: alert.client
      }
    });
    
    setSelectedAlertId(alertId);
    setIsCreateTicketModalOpen(true);
  };
  
  // Handler para criar chamados a partir do formulário
  const handleCreateTicket = (data: CreateTicketData) => {
    const alertId = selectedAlertId || 0;
    
    // Adicionar à lista de alertas com tickets criados
    if (alertId > 0) {
      setCreatedTickets(prev => [...prev, alertId]);
    }
    
    // Fechando o modal
    setIsCreateTicketModalOpen(false);
    setSelectedAlertId(undefined);
    setAlertInfoForTicket(undefined);
    
    toast({
      title: "Chamado criado",
      description: `Chamado '${data.title}' foi criado com sucesso.`,
      variant: "default",
    });
    
    // Opcionalmente, podemos abrir o modal do ticket recém-criado
    // Assumindo que o ID do ticket é baseado no ID do alerta para demonstração
    const newTicketId = alertId + 1000;
    setTimeout(() => {
      handleViewTicket(newTicketId);
    }, 500);
  };
  
  // Handler para visualizar um ticket existente
  const handleViewTicket = (ticketId: number) => {
    setSelectedTicketId(ticketId);
    setIsTicketModalOpen(true);
  };
  
  // Função para gerar um card de status de alerta
  const getAlertStatusCard = (alert: Alert) => {
    // Alerta reconhecido
    if (alert.isAcknowledged || acknowledged.includes(alert.id)) {
      return (
        <div className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
          <AlertTriangle className="h-4 w-4 mr-1" />
          Reconhecido
        </div>
      );
    }
    
    // Alerta com chamado
    if (alert.ticketId || createdTickets.includes(alert.id)) {
      return (
        <div className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
          <AlertTriangle className="h-4 w-4 mr-1" />
          Aberto
        </div>
      );
    }
    
    // Alerta pendente
    return (
      <div className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
        <AlertTriangle className="h-4 w-4 mr-1" />
        <span className="flex items-center">
          Pendente
          {getTimeWithoutActionIndicator(alert.time)}
        </span>
      </div>
    );
  };
  
  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Gerenciamento de Alertas</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm" 
            className={activeFilter === "critical" ? "bg-red-100 text-red-700 border-red-200" : ""}
            onClick={() => handleFilter("critical")}
          >
            <AlertOctagon className="mr-1 h-4 w-4" />
            Críticos
            {activeFilter === "critical" && <X className="ml-1 h-3.5 w-3.5" />}
          </Button>
          <Button variant="outline" size="sm" 
            className={activeFilter === "open" ? "bg-yellow-100 text-yellow-700 border-yellow-200" : ""}
            onClick={() => handleFilter("open")}
          >
            <TicketPlus className="mr-1 h-4 w-4" />
            Com Chamado
            {activeFilter === "open" && <X className="ml-1 h-3.5 w-3.5" />}
          </Button>
          <Button variant="outline" size="sm" 
            className={activeFilter === "acknowledged" ? "bg-blue-100 text-blue-700 border-blue-200" : ""}
            onClick={() => handleFilter("acknowledged")}
          >
            <CheckCircle className="mr-1 h-4 w-4" />
            Reconhecidos
            {activeFilter === "acknowledged" && <X className="ml-1 h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Buscar por cliente, ativo ou mensagem..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="default"
            className="bg-green-700 hover:bg-green-800 flex-shrink-0"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtros Avançados
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-red-100 mr-2">
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
          
          {/* Visualização de alertas no formato SLA-Demo */}
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
                                      "Problema sério que afeta múltiplos usuários ou funções importantes." :
                                    alert.status === "medium" ? 
                                      "Problema que afeta uma parte do sistema, mas não é crítico para operações." :
                                      "Alerta informativo ou de baixo impacto que não requer ação imediata."}
                                  </p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <PriorityBadge priority={alert.finalPriority} showPopover />
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-1">{alert.message}</h3>
                        
                        <div className="text-sm text-slate-600 mb-2 flex items-center">
                          <span className="mr-4">Cliente: <span className="font-medium">{alert.client}</span></span>
                          <span>Ativo: <span className="font-medium">{alert.asset}</span></span>
                        </div>
                        
                        <div className="text-xs text-slate-500">
                          Detectado {alert.time}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 items-end">
                        {/* Status do alerta */}
                        <div className="flex items-center gap-2 justify-end">
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
                        
                        {/* SLA Info caso tenha chamado */}
                        {alert.ticketId && (
                          <SlaRiskIndicator 
                            deadline={alert.resolutionDeadline} 
                            totalDuration={alert.resolutionTime} 
                          />
                        )}
                      </div>
                    </div>
                    
                    {/* Informações de Monitoramento */}
                    <AlertMonitoringInfo 
                      status={alert.monitoringStatus} 
                      source={alert.monitoringSource}
                      monitoringId={alert.monitoringId}
                    />
                    
                    {/* Conteúdo expandido */}
                    {isExpanded && (
                      <div className="mt-4 border-t pt-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            {alert.ticketId && (
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
                            )}
                            
                            <div className="bg-white rounded-lg border p-4 mt-4">
                              <h4 className="text-sm font-medium mb-2">Histórico do Alerta</h4>
                              <SimpleAlertHistory alertId={alert.id} />
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="bg-white rounded-lg border p-4">
                              <h4 className="text-sm font-medium mb-2">Matriz de Prioridade</h4>
                              <PriorityMatrix 
                                highlightTechnical={alert.technicalCriticality}
                                highlightBusiness={alert.businessCriticality}
                              />
                            </div>
                            
                            <div className="bg-white rounded-lg border p-4">
                              <h4 className="text-sm font-medium mb-2">Contatos para Suporte</h4>
                              <SupportContactsPanel 
                                contactName="Central de Suporte" 
                                phoneNumber="0800-123-4567" 
                                email="suporte@empresa.com.br"
                                priority={alert.finalPriority}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Botões de ação */}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                      <Button 
                        variant="ghost" 
                        onClick={() => toggleExpandAlert(alert.id)}
                        className="text-gray-500"
                      >
                        {isExpanded ? (
                          <><ChevronUp className="h-4 w-4 mr-2" /> Recolher</>
                        ) : (
                          <><ChevronDown className="h-4 w-4 mr-2" /> Expandir</>
                        )}
                      </Button>
                      
                      <div className="flex gap-2">
                        {canCreateTicket && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleOpenCreateTicketModal(alert.id)}
                            className="bg-green-700 hover:bg-green-800"
                          >
                            <TicketPlus className="h-4 w-4 mr-2" />
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
                        
                        {alert.ticketId && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleViewTicket(alert.ticketId!)}
                          >
                            Ver Chamado
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {demoAlerts.length === 0 && (
              <div className="bg-white border rounded-lg py-12 px-6 text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <h3 className="text-lg font-medium text-slate-900 mb-1">Nenhum alerta encontrado</h3>
                <p className="text-slate-500">
                  Não há alertas correspondentes aos filtros atuais.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal para criação de chamados a partir de alertas */}
      <CreateTicketModal
        isOpen={isCreateTicketModalOpen}
        onClose={() => {
          setIsCreateTicketModalOpen(false);
          setSelectedAlertId(undefined);
          setAlertInfoForTicket(undefined);
        }}
        onSubmit={handleCreateTicket}
        alertId={selectedAlertId}
        alertInfo={alertInfoForTicket}
      />
      
      {/* Modal para visualização de detalhes do chamado */}
      <TicketModal
        ticketId={selectedTicketId}
        isOpen={isTicketModalOpen}
        onClose={() => {
          setIsTicketModalOpen(false);
          setSelectedTicketId(undefined);
        }}
        onStatusChange={(ticketId, newStatus) => {
          toast({
            title: "Status Atualizado",
            description: `O status do chamado #${ticketId} foi alterado para ${newStatus}`,
            variant: "default",
          });
        }}
        onAddComment={(ticketId, comment, isPublic) => {
          toast({
            title: "Comentário Adicionado",
            description: `${isPublic ? "Comentário público" : "Comentário interno"} adicionado ao chamado #${ticketId}`,
            variant: "default",
          });
        }}
      />
    </div>
  );
}