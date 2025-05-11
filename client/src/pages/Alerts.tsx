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
import AlertMonitoringInfo from "@/components/monitoring/AlertMonitoringInfo";

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

  // Função para expandir/recolher alertas
  const toggleExpandAlert = (alertId: number) => {
    setExpandedAlerts(prev => 
      prev.includes(alertId)
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };

  // Mapeia a severidade do sistema para a severidade do SLA-Demo
  const mapSystemToSlaDemoSeverity = (severity: SystemSeverity): SlaDemoSeverity => {
    switch (severity) {
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
    let adjustmentFactor = 1.0;
    
    // Define tempos base por criticidade técnica
    switch (techCriticality) {
      case "Disaster":
        firstResponseTime = 15; // 15 minutos
        resolutionTime = 120; // 2 horas
        serviceHours = "24x7";
        break;
      case "High":
        firstResponseTime = 30; // 30 minutos
        resolutionTime = 240; // 4 horas
        serviceHours = "24x7";
        break;
      case "Average":
        firstResponseTime = 60; // 1 hora
        resolutionTime = 480; // 8 horas
        serviceHours = "12x7";
        break;
      case "Warning":
        firstResponseTime = 120; // 2 horas
        resolutionTime = 960; // 16 horas (2 dias úteis)
        serviceHours = "8x5";
        break;
      case "Information":
      default:
        firstResponseTime = 240; // 4 horas
        resolutionTime = 1920; // 32 horas (4 dias úteis)
        serviceHours = "8x5";
        break;
    }
    
    // Ajusta tempos baseado na criticidade de negócio
    if (businessCriticality > 0) {
      // Quanto maior a criticidade de negócio, menor o tempo de resposta
      adjustmentFactor = Math.max(0.5, 1.0 - (businessCriticality * 0.1));
      firstResponseTime = Math.floor(firstResponseTime * adjustmentFactor);
      resolutionTime = Math.floor(resolutionTime * adjustmentFactor);
    }
    
    // Determina a prioridade final baseada na combinação de criticidade técnica e de negócio
    let finalPriority: PriorityLevel;
    
    if (techCriticality === "Disaster" && businessCriticality >= 3) {
      finalPriority = "Crítica";
    } else if (techCriticality === "Disaster" || (techCriticality === "High" && businessCriticality >= 3)) {
      finalPriority = "Muito Alta";
    } else if (techCriticality === "High" || (techCriticality === "Average" && businessCriticality >= 3)) {
      finalPriority = "Alta";
    } else if (techCriticality === "Average" || (techCriticality === "Warning" && businessCriticality >= 3)) {
      finalPriority = "Média";
    } else if (techCriticality === "Warning" || (techCriticality === "Information" && businessCriticality >= 3)) {
      finalPriority = "Baixa";
    } else {
      finalPriority = "Muito Baixa";
    }
    
    // Calcular prazos de SLA (para demonstração, usamos a data atual + X minutos)
    const now = new Date();
    const firstResponseDeadline = new Date(now.getTime() + firstResponseTime * 60000).toISOString();
    const resolutionDeadline = new Date(now.getTime() + resolutionTime * 60000).toISOString();
    
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
  }, [location]);

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
      client: "Seguros Confiança",
      asset: "Database Cluster",
      assetId: 202,
      message: "Replication lag > 30s",
      time: "15m atrás",
      status: "open",
      ticketId: 5002,
      ticketStatus: "aberto",
      ticketCreationType: "automatico",
      isAcknowledged: false
    },
    {
      id: 3,
      severity: "medio",
      apiSeverity: "3",
      client: "Educação Virtual",
      asset: "API Gateway",
      assetId: 303,
      message: "High response time (2.5s)",
      time: "24m atrás",
      status: "open",
      ticketId: undefined,
      isAcknowledged: false
    },
    {
      id: 4,
      severity: "aviso",
      apiSeverity: "2", 
      client: "Transportes Rápidos",
      asset: "Load Balancer",
      assetId: 404,
      message: "Certificate expiring in 2 weeks",
      time: "1h 5m atrás",
      status: "open",
      ticketId: undefined,
      isAcknowledged: false
    },
    {
      id: 5,
      severity: "informativo",
      apiSeverity: "1",
      client: "Saúde Integrada",
      asset: "Backup Server",
      assetId: 505,
      message: "Backup completed with warnings",
      time: "2h atrás",
      status: "open",
      ticketId: undefined,
      isAcknowledged: false
    },
    {
      id: 6,
      severity: "alto",
      apiSeverity: "4",
      client: "E-commerce Global",
      asset: "Payment Gateway",
      assetId: 606,
      message: "SSL certificate error",
      time: "42m atrás",
      status: "open",
      ticketId: 5003,
      ticketStatus: "aberto",
      ticketCreationType: "automatico",
      isAcknowledged: false
    },
  ];

  // Função para filtrar alertas com base no filtro ativo
  const getFilteredAlerts = () => {
    const localAcknowledged = acknowledged; // Estado local 
    
    const getAlerts = () => {
      if (activeFilter === null) {
        return alerts;
      }
      
      if (activeFilter === "critical") {
        return alerts.filter(alert => 
          alert.severity === "critico" || alert.severity === "alto"
        );
      }
      
      if (activeFilter === "open") {
        return alerts.filter(alert => 
          alert.ticketId !== undefined
        );
      }
      
      if (activeFilter === "pending") {
        return alerts.filter(alert => 
          alert.ticketId === undefined && !alert.isAcknowledged && !localAcknowledged.includes(alert.id)
        );
      }
      
      return alerts;
    };
  
    return getAlerts();
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

  // Badge de status para alertas
  const getStatusBadge = (alert: Alert) => {
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
            className={activeFilter === "pending" ? "bg-blue-100 text-blue-700 border-blue-200" : ""}
            onClick={() => handleFilter("pending")}
          >
            <Bell className="mr-1 h-4 w-4" />
            Pendentes
            {activeFilter === "pending" && <X className="ml-1 h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Buscar alertas por cliente, ativo ou mensagem..."
            className="w-full pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6">
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
                    
                    {/* Conteúdo expandido */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-8">
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
                        
                        {/* Dados de Monitoramento */}
                        <div>
                          <h4 className="text-lg font-medium mb-3">Dados de Monitoramento</h4>
                          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                            <AlertMonitoringInfo 
                              alertId={alert.id} 
                              assetId={alert.assetId} 
                            />
                          </div>
                        </div>
                        
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
        </div>
      </div>
    </div>
  );
}