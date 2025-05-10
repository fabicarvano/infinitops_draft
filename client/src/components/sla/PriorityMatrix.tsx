import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Tipos para as matrizes
type TechnicalCriticality = "Information" | "Warning" | "Average" | "High" | "Disaster";
type BusinessCriticality = 0 | 1 | 2 | 3 | 4 | 5;
type PriorityLevel = "Crítica" | "Muito Alta" | "Alta" | "Média" | "Baixa" | "Muito Baixa";

interface PriorityMatrixProps {
  highlightTechnical?: TechnicalCriticality;  // Criticidade técnica a destacar
  highlightBusiness?: BusinessCriticality;   // Criticidade de negócio a destacar
}

// Matriz de prioridades baseada na criticidade técnica e de negócio
const PRIORITY_MATRIX: Record<TechnicalCriticality, Record<BusinessCriticality, PriorityLevel>> = {
  // Criticidade técnica (linhas)
  "Information": {
    0: "Baixa",
    1: "Baixa",
    2: "Baixa",
    3: "Baixa",
    4: "Baixa",
    5: "Muito Baixa"
  },
  "Warning": {
    0: "Média",
    1: "Média",
    2: "Média",
    3: "Baixa",
    4: "Baixa",
    5: "Muito Baixa"
  },
  "Average": {
    0: "Alta",
    1: "Alta",
    2: "Média",
    3: "Média",
    4: "Baixa",
    5: "Muito Baixa"
  },
  "High": {
    0: "Muito Alta",
    1: "Alta",
    2: "Alta",
    3: "Média",
    4: "Média",
    5: "Baixa"
  },
  "Disaster": {
    0: "Crítica",
    1: "Muito Alta",
    2: "Muito Alta",
    3: "Alta",
    4: "Média",
    5: "Média"
  }
};

// Mapeamento de criticidade técnica para português
const TECHNICAL_LABELS: Record<TechnicalCriticality, string> = {
  "Information": "Informação",
  "Warning": "Alerta",
  "Average": "Média",
  "High": "Alta",
  "Disaster": "Desastre"
};

// Mapeamento de criticidade de negócio para texto descritivo
const BUSINESS_LABELS: Record<BusinessCriticality, string> = {
  0: "Crítico",
  1: "Muito Alto",
  2: "Alto",
  3: "Médio",
  4: "Baixo",
  5: "Muito Baixo"
};

// Cores para cada nível de prioridade
const PRIORITY_COLORS: Record<PriorityLevel, string> = {
  "Crítica": "bg-red-100 text-red-800",
  "Muito Alta": "bg-orange-100 text-orange-800",
  "Alta": "bg-amber-100 text-amber-800",
  "Média": "bg-yellow-100 text-yellow-800",
  "Baixa": "bg-green-100 text-green-800",
  "Muito Baixa": "bg-blue-100 text-blue-800"
};

export default function PriorityMatrix({ 
  highlightTechnical, 
  highlightBusiness 
}: PriorityMatrixProps) {
  // Prioridade destacada baseada nas criticidades fornecidas
  const highlightedPriority = highlightTechnical && typeof highlightBusiness === 'number' 
    ? PRIORITY_MATRIX[highlightTechnical][highlightBusiness as BusinessCriticality] 
    : undefined;
  
  return (
    <div className="w-full overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50">
            <th className="p-2 text-left font-medium text-gray-500">
              <div className="flex items-center">
                <span>Criticidade Técnica / Negócio</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="ml-1 opacity-70">
                        <HelpCircle className="h-3.5 w-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="w-60 text-xs">
                        A matriz de prioridades determina a classificação final baseada nas criticidades técnica e de negócio.
                        As criticidades técnicas variam de Informação (baixa) a Desastre (alta), enquanto as criticidades de negócio
                        variam de 0 (crítico) a 5 (muito baixo).
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </th>
            {/* Cabeçalho das colunas (criticidade de negócio) */}
            {[0, 1, 2, 3, 4, 5].map((business) => (
              <th 
                key={business} 
                className={`p-2 text-center font-medium ${highlightBusiness === business ? 'bg-blue-50' : ''}`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold">{business}</span>
                  <span className="text-xs text-gray-500">{BUSINESS_LABELS[business as BusinessCriticality]}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Linhas da matriz (criticidade técnica) */}
          {Object.keys(PRIORITY_MATRIX).map((technical) => (
            <tr 
              key={technical} 
              className={`${highlightTechnical === technical ? 'bg-blue-50' : ''}`}
            >
              <td className="p-2 text-left font-medium border-t">
                <div className="flex flex-col">
                  <span className="text-sm font-bold">{technical}</span>
                  <span className="text-xs text-gray-500">
                    {TECHNICAL_LABELS[technical as TechnicalCriticality]}
                  </span>
                </div>
              </td>
              {/* Células da matriz com as prioridades */}
              {[0, 1, 2, 3, 4, 5].map((business) => {
                const priority = PRIORITY_MATRIX[technical as TechnicalCriticality][business as BusinessCriticality];
                const isHighlighted = highlightTechnical === technical && highlightBusiness === business;
                
                return (
                  <td
                    key={`${technical}-${business}`}
                    className={`p-2 text-center border-t ${isHighlighted ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_COLORS[priority]}`}>
                      {priority}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Legenda */}
      <div className="p-3 border-t bg-slate-50">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium text-gray-500">Legenda:</span>
          {Object.entries(PRIORITY_COLORS).map(([priority, colorClass]) => (
            <span key={priority} className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
              {priority}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}