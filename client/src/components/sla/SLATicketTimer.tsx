import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlarmClock, Clock, AlertTriangle, CheckCircle2, PauseCircle } from "lucide-react";

// Tipos para o componente de timer de SLA
type ResponseStatus = "pending" | "responded" | "overdue";
type ResolutionStatus = "pending" | "resolved" | "overdue";
type SLAStatus = "normal" | "warning" | "critical" | "violated" | "paused" | "completed";

interface SLATimerProps {
  // Timestamps
  createdAt: string;
  firstResponseAt?: string;
  resolvedAt?: string;
  
  // Deadlines (em ISO string)
  firstResponseDeadline: string;
  resolutionDeadline: string;
  
  // Configurações
  isPaused?: boolean;
  pausedAt?: string;
  totalPausedTime?: number; // em minutos
  
  // Formatação
  className?: string;
  compact?: boolean;
  showResponseTimer?: boolean;
}

export function SLATicketTimer({
  createdAt,
  firstResponseAt,
  resolvedAt,
  firstResponseDeadline,
  resolutionDeadline,
  isPaused = false,
  pausedAt,
  totalPausedTime = 0,
  className = "",
  compact = false,
  showResponseTimer = true
}: SLATimerProps) {
  // Estados para o tempo restante
  const [responseTimeRemaining, setResponseTimeRemaining] = useState<number>(0);
  const [resolutionTimeRemaining, setResolutionTimeRemaining] = useState<number>(0);
  const [responsePercentage, setResponsePercentage] = useState<number>(0);
  const [resolutionPercentage, setResolutionPercentage] = useState<number>(0);
  const [responseStatus, setResponseStatus] = useState<ResponseStatus>("pending");
  const [resolutionStatus, setResolutionStatus] = useState<ResolutionStatus>("pending");
  const [slaStatus, setSlaStatus] = useState<SLAStatus>("normal");
  
  // Atualizar tempos a cada segundo
  useEffect(() => {
    // Função para calcular o tempo restante
    const calculateTimeRemaining = () => {
      const now = new Date();
      
      // Verificar se já respondido
      if (firstResponseAt) {
        setResponseStatus("responded");
        setResponseTimeRemaining(0);
        setResponsePercentage(100);
      } else {
        // Calcular tempo restante para resposta
        const responseDeadline = new Date(firstResponseDeadline);
        const timeUntilResponseDeadline = responseDeadline.getTime() - now.getTime();
        
        if (timeUntilResponseDeadline <= 0) {
          setResponseStatus("overdue");
          setResponseTimeRemaining(0);
          setResponsePercentage(100);
        } else {
          setResponseStatus("pending");
          setResponseTimeRemaining(timeUntilResponseDeadline);
          
          // Calcular porcentagem de progresso
          const createdTime = new Date(createdAt).getTime();
          const totalResponseTime = responseDeadline.getTime() - createdTime;
          const elapsedResponseTime = now.getTime() - createdTime;
          const responsePerc = Math.min(100, Math.max(0, (elapsedResponseTime / totalResponseTime) * 100));
          setResponsePercentage(responsePerc);
        }
      }
      
      // Verificar se já resolvido
      if (resolvedAt) {
        setResolutionStatus("resolved");
        setResolutionTimeRemaining(0);
        setResolutionPercentage(100);
      } else {
        // Calcular tempo restante para resolução
        const resolutionDeadlineDate = new Date(resolutionDeadline);
        const timeUntilResolutionDeadline = resolutionDeadlineDate.getTime() - now.getTime();
        
        if (timeUntilResolutionDeadline <= 0) {
          setResolutionStatus("overdue");
          setResolutionTimeRemaining(0);
          setResolutionPercentage(100);
        } else {
          setResolutionStatus("pending");
          setResolutionTimeRemaining(timeUntilResolutionDeadline);
          
          // Calcular porcentagem de progresso
          const createdTime = new Date(createdAt).getTime();
          const totalResolutionTime = resolutionDeadlineDate.getTime() - createdTime;
          const elapsedResolutionTime = now.getTime() - createdTime;
          const resolutionPerc = Math.min(100, Math.max(0, (elapsedResolutionTime / totalResolutionTime) * 100));
          setResolutionPercentage(resolutionPerc);
        }
      }
      
      // Determinar status geral do SLA
      if (isPaused) {
        setSlaStatus("paused");
      } else if (resolvedAt) {
        setSlaStatus("completed");
      } else if (resolutionStatus === "overdue" || responseStatus === "overdue") {
        setSlaStatus("violated");
      } else {
        // Calcular baseado no tempo restante
        const resolutionDeadlineDate = new Date(resolutionDeadline);
        const timeUntilResolutionDeadline = resolutionDeadlineDate.getTime() - now.getTime();
        const hoursRemaining = timeUntilResolutionDeadline / (1000 * 60 * 60);
        
        if (hoursRemaining <= 1) {
          setSlaStatus("critical");
        } else if (hoursRemaining <= 4) {
          setSlaStatus("warning");
        } else {
          setSlaStatus("normal");
        }
      }
    };
    
    // Calcular inicialmente
    calculateTimeRemaining();
    
    // Atualizar a cada segundo, mas apenas se não estiver pausado
    let interval: NodeJS.Timeout;
    if (!isPaused) {
      interval = setInterval(calculateTimeRemaining, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [createdAt, firstResponseAt, resolvedAt, firstResponseDeadline, resolutionDeadline, isPaused]);
  
  // Formatar o tempo restante em horas:minutos:segundos
  const formatTimeRemaining = (milliseconds: number): string => {
    if (milliseconds <= 0) return "00:00:00";
    
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Obter a cor baseada no status
  const getStatusColor = (status: SLAStatus): string => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "critical":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "violated":
        return "bg-red-100 text-red-800 border-red-200";
      case "paused":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };
  
  // Obter o ícone baseado no status
  const getStatusIcon = (status: SLAStatus) => {
    switch (status) {
      case "normal":
        return <Clock className="h-4 w-4" />;
      case "warning":
        return <AlarmClock className="h-4 w-4" />;
      case "critical":
        return <AlertTriangle className="h-4 w-4" />;
      case "violated":
        return <AlertTriangle className="h-4 w-4" />;
      case "paused":
        return <PauseCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  // Obter o texto do status
  const getStatusText = (status: SLAStatus): string => {
    switch (status) {
      case "normal":
        return "SLA em Andamento";
      case "warning":
        return "SLA em Alerta";
      case "critical":
        return "SLA Crítico";
      case "violated":
        return "SLA Violado";
      case "paused":
        return "SLA Pausado";
      case "completed":
        return "SLA Cumprido";
      default:
        return "SLA em Andamento";
    }
  };
  
  // Obter a cor da barra de progresso
  const getProgressColor = (percentage: number, status: "response" | "resolution"): string => {
    if (
      (status === "response" && responseStatus === "overdue") ||
      (status === "resolution" && resolutionStatus === "overdue")
    ) {
      return "bg-red-500";
    }
    
    if (
      (status === "response" && responseStatus === "responded") ||
      (status === "resolution" && resolutionStatus === "resolved")
    ) {
      return "bg-green-500";
    }
    
    if (percentage >= 90) {
      return "bg-red-500";
    } else if (percentage >= 75) {
      return "bg-orange-500";
    } else if (percentage >= 50) {
      return "bg-yellow-500";
    }
    
    return "bg-green-500";
  };
  
  // Renderizar o conteúdo compacto
  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Badge variant="outline" className={getStatusColor(slaStatus)}>
          <span className="flex items-center gap-1">
            {getStatusIcon(slaStatus)}
            {getStatusText(slaStatus)}
          </span>
        </Badge>
        
        {slaStatus !== "completed" && slaStatus !== "paused" && (
          <p className="text-sm font-medium">
            {formatTimeRemaining(resolutionTimeRemaining)} restantes
          </p>
        )}
      </div>
    );
  }
  
  // Renderizar o componente completo
  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium">Status do SLA</h3>
          <Badge variant="outline" className={getStatusColor(slaStatus)}>
            <span className="flex items-center gap-1.5">
              {getStatusIcon(slaStatus)}
              {getStatusText(slaStatus)}
            </span>
          </Badge>
        </div>
        
        {showResponseTimer && (
          <div className="space-y-1 mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Primeira Resposta</span>
              <span>
                {responseStatus === "responded" ? (
                  <span className="text-green-600">Completado</span>
                ) : responseStatus === "overdue" ? (
                  <span className="text-red-600">Expirado</span>
                ) : (
                  formatTimeRemaining(responseTimeRemaining)
                )}
              </span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Progress 
                    value={responsePercentage} 
                    className="h-2 w-full"
                    // O indicador precisa ser estilizado via CSS
                  />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <div className="text-xs">
                    {responseStatus === "responded" ? (
                      <span>Respondido dentro do SLA</span>
                    ) : responseStatus === "overdue" ? (
                      <span>Tempo de resposta excedido</span>
                    ) : (
                      <span>{Math.round(responsePercentage)}% do tempo de resposta decorrido</span>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        
        <div className="space-y-1">
          <div className="flex justify-between text-sm mb-1">
            <span>Resolução</span>
            <span>
              {resolutionStatus === "resolved" ? (
                <span className="text-green-600">Completado</span>
              ) : resolutionStatus === "overdue" ? (
                <span className="text-red-600">Expirado</span>
              ) : (
                formatTimeRemaining(resolutionTimeRemaining)
              )}
            </span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Progress 
                  value={resolutionPercentage} 
                  className="h-2 w-full"
                  // O indicador precisa ser estilizado via CSS
                />
              </TooltipTrigger>
              <TooltipContent side="top">
                <div className="text-xs">
                  {resolutionStatus === "resolved" ? (
                    <span>Resolvido dentro do SLA</span>
                  ) : resolutionStatus === "overdue" ? (
                    <span>Tempo de resolução excedido</span>
                  ) : (
                    <span>{Math.round(resolutionPercentage)}% do tempo de resolução decorrido</span>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Detalhes do SLA */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="text-slate-500">Aberto em:</div>
          <div className="font-medium">{new Date(createdAt).toLocaleString('pt-BR')}</div>
          
          <div className="text-slate-500">Resposta até:</div>
          <div className="font-medium">
            {responseStatus === "responded" ? (
              <span className="text-green-600">Respondido</span>
            ) : (
              new Date(firstResponseDeadline).toLocaleString('pt-BR')
            )}
          </div>
          
          <div className="text-slate-500">Resolução até:</div>
          <div className="font-medium">
            {resolutionStatus === "resolved" ? (
              <span className="text-green-600">Resolvido</span>
            ) : (
              new Date(resolutionDeadline).toLocaleString('pt-BR')
            )}
          </div>
          
          {isPaused && (
            <>
              <div className="text-slate-500">Pausado em:</div>
              <div className="font-medium text-blue-600">
                {pausedAt ? new Date(pausedAt).toLocaleString('pt-BR') : 'N/A'}
              </div>
              
              <div className="text-slate-500">Tempo pausado:</div>
              <div className="font-medium text-blue-600">
                {`${Math.floor(totalPausedTime / 60)}h ${totalPausedTime % 60}min`}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}