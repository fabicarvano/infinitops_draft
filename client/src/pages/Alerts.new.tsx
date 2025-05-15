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
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [expandedAlerts, setExpandedAlerts] = useState<number[]>([]);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<number[]>([]);
  const [createdTickets, setCreatedTickets] = useState<number[]>([]);
  
  // Estados para modais
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [selectedAlertId, setSelectedAlertId] = useState<number | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [alertInfoForTicket, setAlertInfoForTicket] = useState<any | null>(null);
  
  // Mapear severidade do sistema para severidade no formato SLA-Demo
  const mapSystemToSlaDemoSeverity = (severity: SystemSeverity): SlaDemoSeverity => {
    switch (severity) {
      case "critico": return "critical";
      case "alto": return "high";
      case "medio": return "medium";
      default: return "low";
    }
  };
  
  // Mapear status para status de monitoramento
  const mapStatusToMonitoringStatus = (alert: Alert): MonitoringStatus => {
    if (alert.status === "resolved") return "normalizado";
    if (alert.status === "acknowledged" || alert.isAcknowledged) return "reconhecido";
    
    // Para efeitos de demonstração, alguns alertas em estado "flapping"
    if (alert.id % 7 === 0) return "flapping";
    
    // Para efeitos de demonstração, alguns alertas em estado "suprimido"
    if (alert.id % 11 === 0) return "suprimido";
    
    return "ativo";
  };
  
  // Mapear severidade do sistema para criticidade técnica no SLA
  const mapSeverityToTechnicalCriticality = (severity: SystemSeverity): TechnicalCriticality => {
    switch (severity) {
      case "critico": return "Disaster";
      case "alto": return "High";
      case "medio": return "Average";
      case "aviso": return "Warning";
      default: return "Information";
    }
  };
  
  // Calcular valores de SLA com base nas criticidades
  const calculateSlaValues = (techCriticality: TechnicalCriticality, businessCriticality: BusinessCriticality): {
    finalPriority: PriorityLevel; 
    firstResponseTime: number;
    resolutionTime: number;
    serviceHours: string;
    adjustmentFactor: number;
  } => {
    // Matriz de prioridade
    let finalPriority: PriorityLevel;
    
    // Mapeamento simplificado da matriz de prioridade
    if (techCriticality === "Disaster" && businessCriticality <= 1) {
      finalPriority = "Crítica";
    } else if (
      (techCriticality === "Disaster" && businessCriticality <= 3) || 
      (techCriticality === "High" && businessCriticality <= 1)
    ) {
      finalPriority = "Muito Alta";
    } else if (
      (techCriticality === "Disaster" && businessCriticality <= 5) ||
      (techCriticality === "High" && businessCriticality <= 3) ||
      (techCriticality === "Average" && businessCriticality <= 1)
    ) {
      finalPriority = "Alta";
    } else if (
      (techCriticality === "High" && businessCriticality <= 5) ||
      (techCriticality === "Average" && businessCriticality <= 3) ||
      (techCriticality === "Warning" && businessCriticality <= 1)
    ) {
      finalPriority = "Média";
    } else if (
      (techCriticality === "Average" && businessCriticality <= 5) ||
      (techCriticality === "Warning" && businessCriticality <= 3) ||
      (techCriticality === "Information" && businessCriticality <= 1)
    ) {
      finalPriority = "Baixa";
    } else {
      finalPriority = "Muito Baixa";
    }
    
    // SLA por prioridade
    let firstResponseTime: number;
    let resolutionTime: number;
    let serviceHours: string;
    let adjustmentFactor: number = 1.0;
    
    // Tempos base de SLA por prioridade
    switch (finalPriority) {
      case "Crítica":
        firstResponseTime = 15; // 15 minutos
        resolutionTime = 120; // 2 horas
        serviceHours = "24x7";
        break;
      case "Muito Alta":
        firstResponseTime = 30; // 30 minutos
        resolutionTime = 240; // 4 horas
        serviceHours = "24x7";
        break;
      case "Alta":
        firstResponseTime = 60; // 1 hora
        resolutionTime = 480; // 8 horas
        serviceHours = "24x7";
        break;
      case "Média":
        firstResponseTime = 120; // 2 horas
        resolutionTime = 960; // 16 horas (2 dias úteis)
        serviceHours = "8x5";
        break;
      case "Baixa":
        firstResponseTime = 240; // 4 horas
        resolutionTime = 1920; // 32 horas (4 dias úteis)
        serviceHours = "8x5";
        break;
      case "Muito Baixa":
        firstResponseTime = 480; // 8 horas (1 dia útil)
        resolutionTime = 3840; // 64 horas (8 dias úteis)
        serviceHours = "8x5";
        break;
    }
    
    // Fatores de ajuste para criticidade de negócio
    // Quanto maior a criticidade (menor o número), menor o ajuste (mais rápido o atendimento)
    switch (businessCriticality) {
      case 0: adjustmentFactor = 0.5; break;  // Reduz o tempo em 50%
      case 1: adjustmentFactor = 0.75; break; // Reduz o tempo em 25%
      case 2: adjustmentFactor = 0.9; break;  // Reduz o tempo em 10%
      case 3: adjustmentFactor = 1.0; break;  // Tempo padrão
      case 4: adjustmentFactor = 1.25; break; // Aumenta o tempo em 25%
      case 5: adjustmentFactor = 1.5; break;  // Aumenta o tempo em 50%
    }
    
    return {
      finalPriority,
      firstResponseTime,
      resolutionTime,
      serviceHours,
      adjustmentFactor
    };
  };
  
  // Dados de exemplo para alertas
  const dummyAlerts: Alert[] = [
    {
      id: 1,
      severity: "critico",
      apiSeverity: "5",
      client: "TechFibra",
      asset: "Router Core MX-960",
      assetId: 112,
      message: "CPU utilization above 95% for 15 minutes",
      time: "8 minutos atrás",
      status: "open",
      isAcknowledged: false
    },
    {
      id: 2,
      severity: "alto",
      apiSeverity: "4",
      client: "Banco Nacional",
      asset: "Firewall Cluster",
      assetId: 234,
      message: "Connection pool exhausted",
      time: "12 minutos atrás",
      status: "open",
      isAcknowledged: false
    },
    {
      id: 3,
      severity: "alto",
      apiSeverity: "4",
      client: "SegurSaúde",
      asset: "Database Server",
      assetId: 312,
      message: "High I/O latency (>500ms)",
      time: "25 minutos atrás",
      status: "acknowledged",
      isAcknowledged: true
    },
    {
      id: 4,
      severity: "medio",
      apiSeverity: "3",
      client: "TechFibra",
      asset: "Load Balancer F5",
      assetId: 114,
      message: "SSL certificate expiring in 7 days",
      time: "43 minutos atrás",
      status: "open",
      ticketId: 1004,
      ticketStatus: "aberto",
      isAcknowledged: false
    },
    {
      id: 5,
      severity: "aviso",
      apiSeverity: "2",
      client: "Industrias Metálicas",
      asset: "CCTV Server",
      assetId: 443,
      message: "Disk space warning (85% used)",
      time: "1h 12m atrás",
      status: "open",
      isAcknowledged: false
    },
    {
      id: 6,
      severity: "critico",
      apiSeverity: "5",
      client: "Transportes Expressos",
      asset: "API Gateway",
      assetId: 523,
      message: "Service unavailable - HTTP 503",
      time: "2h 4m atrás",
      status: "open",
      ticketId: 1006,
      ticketStatus: "aberto",
      isAcknowledged: false
    },
    {
      id: 7,
      severity: "medio",
      apiSeverity: "3",
      client: "Ensino Virtual",
      asset: "Storage Array",
      assetId: 672,
      message: "Redundant controller offline",
      time: "2h 37m atrás",
      status: "open",
      isAcknowledged: false
    }
  ];
  
  // Converter alertas para o formato SLA-Demo
  const convertToSlaAlerts = (alerts: Alert[]): DemoAlert[] => {
    return alerts.map(alert => {
      const techCriticality = mapSeverityToTechnicalCriticality(alert.severity);
      
      // Para efeito de demonstração, gerar criticidade de negócio basada no ID
      const businessCriticality = (alert.id % 6) as BusinessCriticality;
      
      // Calcular valores de SLA
      const slaValues = calculateSlaValues(techCriticality, businessCriticality);
      
      // Status de monitoramento
      let monitoringStatus: MonitoringStatus = mapStatusToMonitoringStatus(alert);
      
      // Para demonstração, calcular prazos de SLA
      const createdAt = new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(); // Até 1h atrás
      const ticketCreatedAt = alert.ticketId 
        ? new Date(Date.now() - Math.floor(Math.random() * 1800000)).toISOString() // Até 30min atrás
        : undefined;
      
      // Calcular prazos para primeiro atendimento e resolução, com fator de ajuste aplicado
      const adjustedFirstResponseTime = Math.ceil(slaValues.firstResponseTime * slaValues.adjustmentFactor);
      const adjustedResolutionTime = Math.ceil(slaValues.resolutionTime * slaValues.adjustmentFactor);
      
      // Adicionar os minutos aos prazos
      const firstResponseDeadline = ticketCreatedAt 
        ? new Date(new Date(ticketCreatedAt).getTime() + adjustedFirstResponseTime * 60000).toISOString()
        : new Date(Date.now() + adjustedFirstResponseTime * 60000).toISOString();
        
      const resolutionDeadline = ticketCreatedAt 
        ? new Date(new Date(ticketCreatedAt).getTime() + adjustedResolutionTime * 60000).toISOString()
        : new Date(Date.now() + adjustedResolutionTime * 60000).toISOString();
      
      // Para demonstração, definir se SLA está pausado ou violado
      const slaPaused = alert.id % 13 === 0;
      const slaViolated = alert.id % 17 === 0;
      
      return {
        id: alert.id,
        status: mapSystemToSlaDemoSeverity(alert.severity),
        client: alert.client,
        asset: alert.asset,
        assetId: alert.assetId,
        message: alert.message,
        time: alert.time,
        createdAt,
        monitoringStatus,
        monitoringSource: "Zabbix", // Valor fixo para demonstração
        monitoringId: `ZBX-${alert.id * 1000}`, // ID fictício para demonstração
        ticketId: alert.ticketId,
        ticketCreatedAt,
        finalPriority: slaValues.finalPriority,
        serviceLevel: alert.id % 3 === 0 ? "Platinum" : alert.id % 3 === 1 ? "Premium" : "Standard",
        technicalCriticality,
        businessCriticality,
        firstResponseTime: adjustedFirstResponseTime,
        resolutionTime: adjustedResolutionTime,
        firstResponseDeadline,
        resolutionDeadline,
        serviceHours: slaValues.serviceHours,
        adjustmentFactor: slaValues.adjustmentFactor,
        isAdjustmentEnabled: true, // Para demonstração, ativado por padrão
        slaPaused,
        slaViolated
      };
    });
  };
  
  // Converter alertas para o formato SLA-Demo
  const alerts = convertToSlaAlerts(dummyAlerts);
  
  // Função utilitária para obter indicador de tempo sem ação
  const getTimeWithoutActionIndicator = (time: string) => {
    // Verificar se o tempo contém valores numéricos
    const match = time.match(/(\d+)/);
    if (!match) return null;
    
    const timeValue = parseInt(match[0], 10);
    // Se o tempo for maior que 30 minutos sem ação, mostrar ícone de aviso
    if ((time.includes("minuto") && timeValue > 30) || time.includes("hora")) {
      return (
        <Tooltip>
          <TooltipTrigger>
            <AlertCircle className="h-4 w-4 ml-2 text-amber-500" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Alerta sem ação há mais de 30 minutos</p>
          </TooltipContent>
        </Tooltip>
      );
    }
    return null;
  };
  
  // Toggle para expandir/recolher detalhes
  const toggleExpandAlert = (alertId: number) => {
    setExpandedAlerts(prev => 
      prev.includes(alertId)
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };
  
  // Filtragem de alertas
  const handleFilter = (filterType: FilterType) => {
    setActiveFilter(prev => prev === filterType ? null : filterType);
  };
  
  // Filtrar alertas com base nos filtros ativos e termo de busca
  const filteredAlerts = alerts.filter(alert => {
    // Aplicar termo de busca
    const matchesSearch = 
      searchTerm === "" || 
      alert.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Aplicar filtros de status
    const matchesFilter = activeFilter === null ||
      (activeFilter === "critical" && alert.status === "critical") ||
      (activeFilter === "open" && alert.ticketId !== undefined) ||
      (activeFilter === "pending" && alert.monitoringStatus === "ativo" && !alert.ticketId);
    
    return matchesSearch && matchesFilter;
  });
  
  // Funções para obter elementos visuais baseados no status
  const getSeverityBadge = (status: SlaDemoSeverity) => {
    switch (status) {
      case "critical":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Crítico</Badge>;
      case "high":
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">Alto</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Médio</Badge>;
      default:
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Aviso</Badge>;
    }
  };
  
  const getSeverityIcon = (status: SlaDemoSeverity) => {
    switch (status) {
      case "critical":
        return <AlertOctagon className="h-5 w-5 text-red-600" />;
      case "high":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case "medium":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };
  
  const getStatusBadge = (alert: DemoAlert) => {
    if (alert.ticketId) {
      return (
        <div className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
          <FileText className="h-4 w-4 mr-1" />
          Chamado #{alert.ticketId}
        </div>
      );
    }
    
    if (alert.monitoringStatus === "reconhecido" || acknowledgedAlerts.includes(alert.id)) {
      return (
        <div className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
          <CheckCircle className="h-4 w-4 mr-1" />
          Reconhecido
        </div>
      );
    }
    
    return alert.status === "critical" ? (
      <div className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
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
    );
  };
  
  // Verificar se o alerta é de severidade alta ou crítica
  const isHighSeverity = (severity: any): boolean => {
    if (typeof severity === 'string') {
      if (severity === "critical" || severity === "high") return true;
      if (severity === "critico" || severity === "alto") return true;
    }
    return false;
  };
  
  // Handler para reconhecer alertas manualmente
  const handleAcknowledge = (alertId: number) => {
    setAcknowledgedAlerts(prev => [...prev, alertId]);
    
    toast({
      title: "Alerta reconhecido",
      description: `O alerta #${alertId} foi reconhecido com sucesso.`,
      variant: "default",
    });
  };
  
  // Handler para abrir modal de criação de ticket
  const handleOpenCreateTicketModal = (alertId: number) => {
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return;
    
    setSelectedAlertId(alertId);
    setAlertInfoForTicket({
      id: alert.id,
      message: alert.message,
      severity: alert.status,
      asset: {
        id: alert.assetId,
        name: alert.asset,
        type: "Network Device", // Valor fixo para demonstração
      },
      client: {
        id: alert.id * 100, // ID fictício para demonstração
        name: alert.client,
      }
    });
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
    setSelectedAlertId(null);
    setAlertInfoForTicket(null);
    
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
  
  // Funções para gerenciar ações nos alertas
  const handleGoToTicket = (ticketId?: number) => {
    if (ticketId) {
      handleViewTicket(ticketId);
    } else {
      // Se não há ticket, criar um novo
      handleOpenCreateTicketModal(0); // Parâmetro fictício, será tratado corretamente pelo handler
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
              className="text-slate-600"
            >
              <Filter className="mr-1 h-4 w-4" />
              Mais Filtros
            </Button>
          </div>
          
          {filteredAlerts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl shadow-sm">
              <HelpCircle className="h-12 w-12 mx-auto text-slate-300 mb-4" />
              <h4 className="text-lg font-medium text-slate-900 mb-1">Nenhum alerta encontrado</h4>
              <p className="text-slate-500">Não foram encontrados alertas com os filtros selecionados.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAlerts.map(alert => {
                // Estado do alert atual
                const isExpanded = expandedAlerts.includes(alert.id);
                const isAcknowledged = alert.monitoringStatus === "reconhecido" || acknowledgedAlerts.includes(alert.id);
                const hasTicket = alert.ticketId !== undefined || createdTickets.includes(alert.id);
                const canCreateTicket = !hasTicket && isHighSeverity(alert.severity as SystemSeverity);
                const canAcknowledge = alert.monitoringStatus === "ativo" && !isAcknowledged;
                
                return (
                  <Card key={alert.id} className="overflow-hidden">
                    <div className="p-4 pb-0">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-4">
                        <div className="flex items-start md:items-center gap-3">
                          <div className="flex-shrink-0 mt-1 md:mt-0">
                            {getSeverityIcon(alert.status)}
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold">{alert.message}</h4>
                            <div className="flex flex-wrap gap-2 items-center mt-1.5">
                              {getSeverityBadge(alert.status)}
                              
                              <Badge variant="outline" className="bg-slate-100 border-slate-200">
                                {alert.client}
                              </Badge>
                              
                              <Badge variant="outline" className="bg-slate-100 border-slate-200">
                                {alert.asset}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3 items-end md:items-center">
                          <div className="flex items-center text-slate-500 text-sm whitespace-nowrap">
                            <Clock className="h-4 w-4 mr-1" />
                            {alert.time}
                          </div>
                          {getStatusBadge(alert)}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 pb-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-500"
                          onClick={() => toggleExpandAlert(alert.id)}
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="mr-1 h-4 w-4" />
                              Ocultar Detalhes
                            </>
                          ) : (
                            <>
                              <ChevronDown className="mr-1 h-4 w-4" />
                              Ver Detalhes
                            </>
                          )}
                        </Button>
                        
                        <div className="flex-grow"></div>
                        
                        {canCreateTicket && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-slate-700"
                            onClick={() => handleOpenCreateTicketModal(alert.id)}
                          >
                            <TicketPlus className="mr-1 h-4 w-4" />
                            Criar Chamado
                          </Button>
                        )}
                        
                        {canAcknowledge && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-slate-700"
                            onClick={() => handleAcknowledge(alert.id)}
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Reconhecer
                          </Button>
                        )}
                        
                        {alert.ticketId && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleViewTicket(alert.ticketId as number)}
                          >
                            <FileText className="mr-1 h-4 w-4" />
                            Ver Chamado
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {/* Conteúdo expandido */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-gray-100">
                        <div className="pt-4 space-y-6">
                          {/* SLA & Priorização */}
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
                                ticketCreatedAt={alert.ticketCreatedAt || new Date().toISOString()}
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
                          
                          {/* Histórico */}
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
                          
                          {/* Dados de Monitoramento */}
                          <div>
                            <h4 className="text-lg font-medium mb-3">Dados de Monitoramento</h4>
                            <AlertMonitoringInfo
                              alertId={alert.id}
                              assetId={alert.assetId}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Modais */}
      <CreateTicketModal
        isOpen={isCreateTicketModalOpen}
        onClose={() => {
          setIsCreateTicketModalOpen(false); 
          setSelectedAlertId(null);
          setAlertInfoForTicket(null);
        }}
        onSubmit={handleCreateTicket}
        alertId={selectedAlertId ?? 0}
        alertInfo={alertInfoForTicket}
      />
      
      <TicketModal
        ticketId={selectedTicketId ?? 0}
        isOpen={isTicketModalOpen}
        onClose={() => {
          setIsTicketModalOpen(false);
          setSelectedTicketId(null);
        }}
        onStatusChange={(ticketId, newStatus) => {
          toast({
            title: "Status do chamado atualizado",
            description: `O status do chamado #${ticketId} foi alterado para "${newStatus}".`,
          });
        }}
        onAddComment={(ticketId, comment, isPublic) => {
          toast({
            title: "Comentário adicionado",
            description: `Um comentário ${isPublic ? 'público' : 'privado'} foi adicionado ao chamado #${ticketId}.`,
          });
        }}
      />
    </div>
  );
}