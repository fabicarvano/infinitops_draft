import { useState, useEffect } from 'react';
import { 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  CalendarClock, 
  Hourglass, 
  TimerOff, 
  Timer,
  ChevronDown,
  ChevronUp,
  ToggleRight,
  ToggleLeft
} from 'lucide-react';
import { format, differenceInSeconds } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EffectiveSlaCardProps {
  firstResponseTime: number; // Tempo base para primeiro atendimento (minutos)
  resolutionTime: number; // Tempo base para resolução (minutos)
  firstResponseDeadline: string; // Prazo para primeiro atendimento
  resolutionDeadline: string; // Prazo para resolução
  serviceHours: string; // 24x7, Seg-Sex 06h-23h, Seg-Sex 09h-18h
  adjustmentFactor: number; // Fator de ajuste aplicado (0.5, 0.75, 0.9, 1.0)
  isAdjustmentEnabled: boolean; // Se o ajuste por criticidade está habilitado
  slaPaused: boolean; // Se o SLA está pausado
  slaViolated: boolean; // Se o SLA foi violado
  ticketCreatedAt: string; // Data/hora de criação do ticket
  serviceLevel: string; // Nível de serviço do contrato (Platinum, Premium, Standard, Personalizado)
  technicalCriticality: string; // Criticidade técnica (Disaster, High, Average, Warning, Information)
  businessCriticality: number; // Criticidade de negócio (0-5)
  finalPriority: string; // Prioridade final (Crítica, Muito Alta, Alta, Média, Baixa, Muito Baixa)
}

export default function EffectiveSlaCard({
  firstResponseTime,
  resolutionTime,
  firstResponseDeadline,
  resolutionDeadline,
  serviceHours,
  adjustmentFactor,
  isAdjustmentEnabled,
  slaPaused,
  slaViolated,
  ticketCreatedAt,
  serviceLevel,
  technicalCriticality,
  businessCriticality,
  finalPriority
}: EffectiveSlaCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({
    firstResponse: '',
    resolution: ''
  });
  const [percentageRemaining, setPercentageRemaining] = useState({
    firstResponse: 100,
    resolution: 100
  });

  // Mapeamento de criticidade técnica para português
  const mapTechnicalCriticality = (criticality: string) => {
    const map: Record<string, string> = {
      'Disaster': 'Desastre',
      'High': 'Alta',
      'Average': 'Média',
      'Warning': 'Alerta',
      'Information': 'Informação'
    };
    return map[criticality] || criticality;
  };

  // Mapeamento de criticidade de negócio para texto descritivo
  const getBusinessCriticalityText = (value: number) => {
    const map: Record<number, string> = {
      0: 'Crítico (impacto máximo)',
      1: 'Muito Alto',
      2: 'Alto',
      3: 'Médio',
      4: 'Baixo',
      5: 'Muito Baixo (impacto mínimo)'
    };
    return map[value] || `Nível ${value}`;
  };

  // Função para transformar minutos em formato legível
  const formatMinutes = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${remainingMinutes}min`;
  };

  // Função para calcular o tempo restante e atualizar os contadores
  useEffect(() => {
    const updateCountdowns = () => {
      const now = new Date();
      const firstResponseDate = new Date(firstResponseDeadline);
      const resolutionDate = new Date(resolutionDeadline);
      
      // Verificar se os SLAs já foram cumpridos ou violados
      if (slaViolated) {
        setTimeRemaining({
          firstResponse: 'SLA violado',
          resolution: 'SLA violado'
        });
        setPercentageRemaining({
          firstResponse: 0,
          resolution: 0
        });
        return;
      }
      
      // Se o SLA estiver pausado
      if (slaPaused) {
        setTimeRemaining({
          firstResponse: 'SLA pausado',
          resolution: 'SLA pausado'
        });
        return;
      }
      
      // Calcular tempo restante para primeiro atendimento
      let firstResponseSeconds = differenceInSeconds(firstResponseDate, now);
      const firstResponsePercentage = Math.max(0, Math.min(100, (firstResponseSeconds / (firstResponseTime * 60)) * 100));
      
      // Calcular tempo restante para resolução
      let resolutionSeconds = differenceInSeconds(resolutionDate, now);
      const resolutionPercentage = Math.max(0, Math.min(100, (resolutionSeconds / (resolutionTime * 60)) * 100));
      
      // Formatação dos tempos restantes
      let firstResponseText = 'Concluído';
      let resolutionText = 'Concluído';
      
      if (firstResponseSeconds > 0) {
        const hours = Math.floor(firstResponseSeconds / 3600);
        const minutes = Math.floor((firstResponseSeconds % 3600) / 60);
        const seconds = firstResponseSeconds % 60;
        
        if (hours > 0) {
          firstResponseText = `${hours}h ${minutes}m ${seconds}s`;
        } else {
          firstResponseText = `${minutes}m ${seconds}s`;
        }
      } else if (firstResponseSeconds < 0) {
        firstResponseText = 'Prazo excedido';
      }
      
      if (resolutionSeconds > 0) {
        const hours = Math.floor(resolutionSeconds / 3600);
        const minutes = Math.floor((resolutionSeconds % 3600) / 60);
        const seconds = resolutionSeconds % 60;
        
        if (hours > 0) {
          resolutionText = `${hours}h ${minutes}m ${seconds}s`;
        } else {
          resolutionText = `${minutes}m ${seconds}s`;
        }
      } else if (resolutionSeconds < 0) {
        resolutionText = 'Prazo excedido';
      }
      
      setTimeRemaining({
        firstResponse: firstResponseText,
        resolution: resolutionText
      });
      
      setPercentageRemaining({
        firstResponse: firstResponsePercentage,
        resolution: resolutionPercentage
      });
    };
    
    // Atualizar imediatamente e depois a cada segundo
    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    
    return () => clearInterval(interval);
  }, [
    firstResponseDeadline,
    resolutionDeadline,
    firstResponseTime,
    resolutionTime,
    slaPaused,
    slaViolated
  ]);

  // Cores para os diferentes estados do SLA
  const getProgressColor = (percentage: number) => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 25) return 'bg-yellow-500';
    if (percentage > 10) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getFinalPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Crítica': return 'text-red-600 bg-red-50';
      case 'Muito Alta': return 'text-orange-600 bg-orange-50';
      case 'Alta': return 'text-yellow-600 bg-yellow-50';
      case 'Média': return 'text-green-600 bg-green-50';
      case 'Baixa': return 'text-blue-600 bg-blue-50';
      case 'Muito Baixa': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getServiceLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'platinum': return 'text-purple-600 bg-purple-50';
      case 'premium': return 'text-yellow-600 bg-yellow-50';
      case 'standard': return 'text-blue-600 bg-blue-50';
      case 'custom': case 'personalizado': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Timer className="h-5 w-5 text-gray-600" />
            <span>SLA Efetivo</span>
          </h3>
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getFinalPriorityColor(finalPriority)}`}>
              {finalPriority}
            </span>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              {showDetails ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="space-y-6">
          {/* Contadores de tempo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primeiro atendimento */}
            <div className={`p-3 rounded-lg border ${slaViolated ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Primeiro Atendimento</h4>
              <div className="flex justify-between items-center mb-2">
                <div className="text-lg font-bold">
                  {timeRemaining.firstResponse}
                </div>
                <div className="text-sm text-gray-500">
                  {format(new Date(firstResponseDeadline), "dd/MM HH:mm", { locale: ptBR })}
                </div>
              </div>
              
              {/* Barra de progresso */}
              {!slaPaused && !slaViolated && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`${getProgressColor(percentageRemaining.firstResponse)} h-2.5 rounded-full`}
                    style={{ width: `${percentageRemaining.firstResponse}%` }}
                  ></div>
                </div>
              )}
              
              {/* Indicador de prazo */}
              <div className="mt-2 text-xs text-gray-500 flex items-center">
                <CalendarClock className="h-3.5 w-3.5 mr-1" />
                <span>Prazo: {formatMinutes(firstResponseTime)}</span>
              </div>
            </div>
            
            {/* Resolução */}
            <div className={`p-3 rounded-lg border ${slaViolated ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Resolução</h4>
              <div className="flex justify-between items-center mb-2">
                <div className="text-lg font-bold">
                  {timeRemaining.resolution}
                </div>
                <div className="text-sm text-gray-500">
                  {format(new Date(resolutionDeadline), "dd/MM HH:mm", { locale: ptBR })}
                </div>
              </div>
              
              {/* Barra de progresso */}
              {!slaPaused && !slaViolated && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`${getProgressColor(percentageRemaining.resolution)} h-2.5 rounded-full`}
                    style={{ width: `${percentageRemaining.resolution}%` }}
                  ></div>
                </div>
              )}
              
              {/* Indicador de prazo */}
              <div className="mt-2 text-xs text-gray-500 flex items-center">
                <CalendarClock className="h-3.5 w-3.5 mr-1" />
                <span>Prazo: {formatMinutes(resolutionTime)}</span>
              </div>
            </div>
          </div>
          
          {/* Status do SLA */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-2">
              {slaPaused ? (
                <>
                  <TimerOff className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">SLA Pausado</span>
                </>
              ) : slaViolated ? (
                <>
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="font-medium text-red-500">SLA Violado</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-green-500">Dentro do SLA</span>
                </>
              )}
            </div>
            
            <div className="text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Criado em: {format(new Date(ticketCreatedAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}</span>
              </div>
            </div>
          </div>
          
          {/* Detalhes do SLA (expansível) */}
          {showDetails && (
            <div className="space-y-4 pt-3 border-t">
              <h4 className="font-medium">Detalhes do SLA</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nível de Serviço */}
                <div className="p-3 rounded-lg border border-gray-200">
                  <h5 className="text-sm text-gray-500 mb-1">Nível de Serviço</h5>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-sm font-medium ${getServiceLevelColor(serviceLevel)}`}>
                      {serviceLevel}
                    </span>
                    <span className="text-sm text-gray-500">{serviceHours}</span>
                  </div>
                </div>
                
                {/* Ajuste por Criticidade */}
                <div className="p-3 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center">
                    <h5 className="text-sm text-gray-500">Ajuste por Criticidade</h5>
                    <div className="flex items-center">
                      {isAdjustmentEnabled ? (
                        <>
                          <ToggleRight className="h-5 w-5 text-green-500 mr-1" />
                          <span className="text-sm text-green-500">Ativado</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-5 w-5 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-400">Desativado</span>
                        </>
                      )}
                    </div>
                  </div>
                  {isAdjustmentEnabled && (
                    <div className="mt-1 text-sm">
                      <span>Fator: <span className="font-medium">{adjustmentFactor}</span></span>
                      {adjustmentFactor !== 1 && (
                        <span className="text-green-600 ml-2">
                          {adjustmentFactor < 1 ? `Redução de ${Math.round((1 - adjustmentFactor) * 100)}%` : `Aumento de ${Math.round((adjustmentFactor - 1) * 100)}%`}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Criticidade Técnica */}
                <div className="p-3 rounded-lg border border-gray-200">
                  <h5 className="text-sm text-gray-500 mb-1">Criticidade Técnica</h5>
                  <div className="font-medium">{mapTechnicalCriticality(technicalCriticality)}</div>
                </div>
                
                {/* Criticidade de Negócio */}
                <div className="p-3 rounded-lg border border-gray-200">
                  <h5 className="text-sm text-gray-500 mb-1">Criticidade de Negócio</h5>
                  <div className="flex items-center">
                    <div className="font-medium mr-2">{businessCriticality}</div>
                    <div className="text-sm text-gray-500">{getBusinessCriticalityText(businessCriticality)}</div>
                  </div>
                </div>
              </div>
              
              {/* Ajustes aplicados */}
              {isAdjustmentEnabled && adjustmentFactor !== 1 && (
                <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                  <h5 className="text-sm font-medium mb-2">Ajustes Aplicados</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Primeiro Atendimento (original):</span>
                      <span className="font-medium">{formatMinutes(Math.round(firstResponseTime / adjustmentFactor))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Primeiro Atendimento (ajustado):</span>
                      <span className="font-medium text-green-600">{formatMinutes(firstResponseTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Resolução (original):</span>
                      <span className="font-medium">{formatMinutes(Math.round(resolutionTime / adjustmentFactor))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Resolução (ajustado):</span>
                      <span className="font-medium text-green-600">{formatMinutes(resolutionTime)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}