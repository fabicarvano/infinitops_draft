import { format, formatDistance, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertTriangle, Calendar, Clock, Gauge, Settings, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import PriorityBadge from '@/components/sla/PriorityBadge';

type TechnicalCriticality = "Information" | "Warning" | "Average" | "High" | "Disaster";
type BusinessCriticality = 0 | 1 | 2 | 3 | 4 | 5;
type PriorityLevel = "Crítica" | "Muito Alta" | "Alta" | "Média" | "Baixa" | "Muito Baixa";

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
  technicalCriticality: TechnicalCriticality; // Criticidade técnica (Disaster, High, Average, Warning, Information)
  businessCriticality: BusinessCriticality; // Criticidade de negócio (0-5)
  finalPriority: PriorityLevel; // Prioridade final (Crítica, Muito Alta, Alta, Média, Baixa, Muito Baixa)
}

// Mapas para tradução e cores
const PRIORITY_COLORS: Record<PriorityLevel, string> = {
  "Crítica": "bg-red-100 text-red-800 border-red-300",
  "Muito Alta": "bg-orange-100 text-orange-800 border-orange-300",
  "Alta": "bg-amber-100 text-amber-800 border-amber-300",
  "Média": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "Baixa": "bg-green-100 text-green-800 border-green-300",
  "Muito Baixa": "bg-blue-100 text-blue-800 border-blue-300"
};

const TECHNICAL_LABELS: Record<TechnicalCriticality, string> = {
  "Information": "Informação",
  "Warning": "Alerta",
  "Average": "Média",
  "High": "Alta",
  "Disaster": "Desastre"
};

const BUSINESS_LABELS: Record<BusinessCriticality, string> = {
  0: "Crítico",
  1: "Muito Alto",
  2: "Alto",
  3: "Médio",
  4: "Baixo",
  5: "Muito Baixo"
};

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
  // Verificar se prazos foram violados
  const now = new Date();
  const firstResponseViolated = isAfter(now, new Date(firstResponseDeadline));
  const resolutionViolated = isAfter(now, new Date(resolutionDeadline));
  
  // Formatação de datas
  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    return `${format(date, "dd/MM/yyyy HH:mm", { locale: ptBR })} (${formatDistance(date, now, { locale: ptBR, addSuffix: true })})`;
  };
  
  // Status do SLA
  const getSlaStatus = () => {
    if (slaViolated) return { label: "SLA Violado", color: "bg-red-100 text-red-800 border-red-300" };
    if (slaPaused) return { label: "SLA Pausado", color: "bg-blue-100 text-blue-800 border-blue-300" };
    if (resolutionViolated) return { label: "Prazo Expirado", color: "bg-red-100 text-red-800 border-red-300" };
    return { label: "Dentro do SLA", color: "bg-green-100 text-green-800 border-green-300" };
  };
  
  const slaStatus = getSlaStatus();
  
  return (
    <Card className="border w-full">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">SLA Efetivo</h3>
            <p className="text-sm text-gray-500">
              Contrato: <span className="font-medium">{serviceLevel}</span>
            </p>
          </div>
          <Badge variant="outline" className={slaStatus.color}>
            {slaStatus.label}
          </Badge>
        </div>
        
        {/* Classificação e criticidade */}
        <div className="space-y-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Criticidade Técnica</div>
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-gray-700" />
                <div className="text-sm font-medium">
                  {technicalCriticality} 
                  <span className="ml-1 text-gray-500">
                    ({TECHNICAL_LABELS[technicalCriticality]})
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Criticidade de Negócio</div>
              <div className="flex items-center">
                <Gauge className="h-4 w-4 mr-2 text-gray-700" />
                <div className="text-sm font-medium">
                  {businessCriticality} 
                  <span className="ml-1 text-gray-500">
                    ({BUSINESS_LABELS[businessCriticality]})
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Prioridade Final</div>
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-2 text-gray-700" />
              <PriorityBadge priority={finalPriority} />
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Tempos de SLA */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm">Horário de Atendimento:</span>
            </div>
            <span className="text-sm font-medium">{serviceHours}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm">Ticket Aberto:</span>
            </div>
            <span className="text-sm font-medium">
              {format(new Date(ticketCreatedAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm">Primeiro Atendimento:</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">
                {firstResponseTime} minutos
              </div>
              <div className={`text-xs ${firstResponseViolated ? 'text-red-600' : 'text-gray-500'}`}>
                {formatDeadline(firstResponseDeadline)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm">Prazo para Resolução:</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">
                {resolutionTime} minutos
              </div>
              <div className={`text-xs ${resolutionViolated ? 'text-red-600' : 'text-gray-500'}`}>
                {formatDeadline(resolutionDeadline)}
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Ajuste de SLA */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Settings className="h-4 w-4 mr-2 text-gray-500" />
              <Label htmlFor="adjustment-enabled" className="text-sm">
                Ajuste por Criticidade de Negócio
              </Label>
            </div>
            <Switch 
              id="adjustment-enabled" 
              checked={isAdjustmentEnabled} 
              disabled
            />
          </div>
          
          {isAdjustmentEnabled && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm">Fator de Ajuste Aplicado:</span>
              </div>
              <span className="text-sm font-medium">
                {adjustmentFactor.toFixed(2)}x 
                {adjustmentFactor !== 1.0 && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({adjustmentFactor < 1.0 ? 'redução' : 'aumento'} de tempo)
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}