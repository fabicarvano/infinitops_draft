import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PriorityLevel = "Crítica" | "Muito Alta" | "Alta" | "Média" | "Baixa" | "Muito Baixa";

// Cores para cada nível de prioridade
const PRIORITY_COLORS: Record<PriorityLevel, string> = {
  "Crítica": "bg-red-100 text-red-800 border-red-300 hover:bg-red-200",
  "Muito Alta": "bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200",
  "Alta": "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200",
  "Média": "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200",
  "Baixa": "bg-green-100 text-green-800 border-green-300 hover:bg-green-200",
  "Muito Baixa": "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200"
};

// Descrições informativas para cada nível de prioridade
const PRIORITY_DESCRIPTIONS: Record<PriorityLevel, string> = {
  "Crítica": "Incidente com impacto severo para o negócio. Requer resolução imediata, independente do horário.",
  "Muito Alta": "Incidente com alto impacto para o negócio. Requer resolução prioritária com equipe dedicada.",
  "Alta": "Incidente com impacto significativo para o negócio. Deve ser tratado com prioridade no horário comercial.",
  "Média": "Incidente com impacto moderado. Deve ser resolvido durante o horário comercial normal.",
  "Baixa": "Incidente com impacto reduzido. Pode ser programado para atendimento em data futura dentro do SLA.",
  "Muito Baixa": "Incidente com impacto mínimo. Atendimento pode ser agendado conforme disponibilidade da equipe."
};

// Exemplos específicos para cada nível, para melhor compreensão
const PRIORITY_EXAMPLES: Record<PriorityLevel, string> = {
  "Crítica": "Ex: Servidores de produção indisponíveis em cliente crítico.",
  "Muito Alta": "Ex: Lentidão severa afetando múltiplos sistemas em cliente importante.",
  "Alta": "Ex: Falha em funcionalidade crítica que afeta um departamento inteiro.",
  "Média": "Ex: Problema em funcionalidade não-crítica que afeta múltiplos usuários.",
  "Baixa": "Ex: Funcionalidade secundária indisponível sem impacto imediato no negócio.",
  "Muito Baixa": "Ex: Pequenos ajustes ou melhorias não urgentes em sistemas de suporte."
};

interface PriorityBadgeProps {
  priority: PriorityLevel;
  className?: string;
  // Se deve exibir como botão (no demo SLA) ou como badge (na matriz)
  asButton?: boolean;
}

export default function PriorityBadge({ 
  priority, 
  className = "", 
  asButton = false 
}: PriorityBadgeProps) {
  const colorClass = PRIORITY_COLORS[priority];
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {asButton ? (
            <Button variant="outline" size="sm" className={`${colorClass} ${className}`}>
              {priority}
            </Button>
          ) : (
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${colorClass} ${className}`}>
              {priority}
            </span>
          )}
        </TooltipTrigger>
        <TooltipContent className="w-64 p-3">
          <div className="space-y-2">
            <p className="font-medium text-sm">{priority}</p>
            <p className="text-xs text-gray-600">{PRIORITY_DESCRIPTIONS[priority]}</p>
            <p className="text-xs text-gray-500 italic">{PRIORITY_EXAMPLES[priority]}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}