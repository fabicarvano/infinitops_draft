import { useQuery } from "@tanstack/react-query";
import { useAlerts } from "./use-alerts";
import { addDays, addHours, addMinutes } from "date-fns";

// Definição de tipos obtidos do use-alerts.ts
type AlertSeverity = "critical" | "high" | "medium" | "low";

interface Alert {
  id: number;
  status: AlertSeverity;
  client: string;
  asset: string;
  assetId: number;
  message: string;
  time: string;
  createdAt: string;
  ticketId?: number;
  ticketCreatedAt?: string;
  sla?: string;
  isAutoTicket?: boolean;
}

interface EnhancedAlert extends Alert {
  // Campos de monitoramento
  monitoringStatus: "ativo" | "normalizado" | "flapping" | "reconhecido" | "suprimido";
  monitoringSource: string;
  monitoringId?: string;
  
  // Campos de SLA
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
}

export const useEnhancedAlerts = () => {
  // Usar o hook original de alertas
  const alertsQuery = useAlerts();
  
  // Processar os alertas para adicionar as informações de SLA e monitoramento
  const enhancedAlerts: EnhancedAlert[] = (alertsQuery.data || []).map(alert => {
    // Determinar criticidade de negócio simulada (baseada no ID do ativo)
    const businessCriticality = alert.assetId % 6; // 0-5
    
    // Determinar criticidade técnica e prioridade final
    let technicalCriticality: string;
    switch (alert.status) {
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
    let finalPriority: string;
    if (alert.status === "critical") {
      if (businessCriticality <= 0) finalPriority = "Crítica";
      else if (businessCriticality <= 2) finalPriority = "Muito Alta";
      else finalPriority = "Alta";
    } else if (alert.status === "high") {
      if (businessCriticality <= 0) finalPriority = "Muito Alta";
      else if (businessCriticality <= 2) finalPriority = "Alta";
      else if (businessCriticality <= 4) finalPriority = "Média";
      else finalPriority = "Baixa";
    } else if (alert.status === "medium") {
      if (businessCriticality <= 1) finalPriority = "Alta";
      else if (businessCriticality <= 3) finalPriority = "Média";
      else finalPriority = "Baixa";
    } else {
      if (businessCriticality <= 2) finalPriority = "Média";
      else if (businessCriticality <= 4) finalPriority = "Baixa";
      else finalPriority = "Muito Baixa";
    }
    
    // Gerar status de monitoramento simulado
    const monitoringStatus = alert.status === "critical" ? "ativo" : 
                            (alert.status === "medium" && alert.id % 2 === 0) ? "flapping" : 
                            "normalizado";
    
    // Gerar informações de SLA simuladas
    const isAdjustmentEnabled = alert.id % 3 !== 0; // 2/3 dos alertas têm ajuste habilitado
    const serviceLevel = alert.id % 4 === 0 ? "Platinum" : 
                         alert.id % 3 === 0 ? "Premium" : 
                         alert.id % 2 === 0 ? "Standard" : "Personalizado";
    
    // Calcular tempos base (em minutos) 
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
    
    // Aplicar fator de ajuste baseado na criticidade do negócio se o ajuste estiver habilitado
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
    
    // Gerar datas de deadline a partir da criação do chamado
    const ticketCreatedAt = alert.ticketCreatedAt || alert.createdAt;
    const firstResponseDeadline = addMinutes(new Date(ticketCreatedAt), firstResponseTime).toISOString();
    const resolutionDeadline = addMinutes(new Date(ticketCreatedAt), resolutionTime).toISOString();
    
    // Status do SLA
    const slaPaused = alert.id % 10 === 0; // 10% dos alertas com SLA pausado
    const slaViolated = alert.id % 15 === 0; // 6.67% dos alertas com SLA violado
    
    return {
      ...alert,
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
      serviceHours: serviceLevel === "Platinum" ? "24x7" : serviceLevel === "Premium" ? "Seg-Sex 06h-23h" : "Seg-Sex 09h-18h",
      adjustmentFactor,
      isAdjustmentEnabled,
      slaPaused,
      slaViolated
    };
  });
  
  return {
    ...alertsQuery,
    data: enhancedAlerts
  };
};