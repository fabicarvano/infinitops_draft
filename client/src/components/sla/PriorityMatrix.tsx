import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PriorityMatrixProps {
  highlightTechnical?: string;  // Criticidade técnica a destacar
  highlightBusiness?: number;   // Criticidade de negócio a destacar
}

// Matriz de prioridades baseada na criticidade técnica e de negócio
const PRIORITY_MATRIX = {
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
const TECHNICAL_LABELS = {
  "Information": "Informação",
  "Warning": "Alerta",
  "Average": "Média",
  "High": "Alta",
  "Disaster": "Desastre"
};

// Mapeamento de criticidade de negócio para texto descritivo
const BUSINESS_LABELS = {
  0: "Crítico",
  1: "Muito Alto",
  2: "Alto",
  3: "Médio",
  4: "Baixo",
  5: "Muito Baixo"
};

// Cores para cada nível de prioridade
const PRIORITY_COLORS = {
  "Crítica": "bg-red-100 text-red-800",
  "Muito Alta": "bg-orange-100 text-orange-800",
  "Alta": "bg-yellow-100 text-yellow-800",
  "Média": "bg-green-100 text-green-800",
  "Baixa": "bg-blue-100 text-blue-800",
  "Muito Baixa": "bg-gray-100 text-gray-800"
};

export default function PriorityMatrix({ 
  highlightTechnical, 
  highlightBusiness 
}: PriorityMatrixProps) {
  // Lista de criticidades técnicas e de negócio para exibir na matriz
  const technicalCriticalities = Object.keys(PRIORITY_MATRIX);
  const businessCriticalities = [0, 1, 2, 3, 4, 5];
  
  // Verifica se uma célula deve ser destacada
  const isHighlighted = (tech: string, business: number) => {
    return tech === highlightTechnical && business === highlightBusiness;
  };
  
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Matriz de Prioridade</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Esta matriz mostra a prioridade final do chamado com base na combinação de:</p>
              <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                <li>Criticidade Técnica (severidade do alerta)</li>
                <li>Criticidade de Negócio (importância do ativo)</li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Tabela da matriz de prioridade */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border bg-gray-50 text-left text-sm font-medium text-gray-600">
                Criticidade Técnica \ Negócio
              </th>
              {businessCriticalities.map(business => (
                <th 
                  key={business} 
                  className={`p-2 border text-center text-sm font-medium ${
                    business === highlightBusiness ? 'bg-blue-50' : 'bg-gray-50'
                  }`}
                >
                  <div>{business}</div>
                  <div className="text-xs text-gray-500">{BUSINESS_LABELS[business]}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {technicalCriticalities.map(tech => (
              <tr key={tech}>
                <td className={`p-2 border font-medium text-sm ${
                  tech === highlightTechnical ? 'bg-blue-50' : ''
                }`}>
                  <div>{TECHNICAL_LABELS[tech]}</div>
                  <div className="text-xs text-gray-500">{tech}</div>
                </td>
                {businessCriticalities.map(business => {
                  const priority = PRIORITY_MATRIX[tech][business];
                  const colorClass = PRIORITY_COLORS[priority];
                  const cellHighlighted = isHighlighted(tech, business);
                  
                  return (
                    <td 
                      key={`${tech}-${business}`} 
                      className={`p-2 border text-center ${
                        cellHighlighted 
                          ? 'ring-2 ring-blue-500 bg-blue-50' 
                          : ''
                      }`}
                    >
                      <span className={`px-2 py-1 rounded text-xs font-medium ${colorClass}`}>
                        {priority}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Legenda */}
      <div className="mt-4 flex flex-wrap gap-2">
        {Object.entries(PRIORITY_COLORS).map(([priority, colorClass]) => (
          <span 
            key={priority} 
            className={`px-2 py-1 rounded text-xs font-medium ${colorClass}`}
          >
            {priority}
          </span>
        ))}
      </div>
    </div>
  );
}