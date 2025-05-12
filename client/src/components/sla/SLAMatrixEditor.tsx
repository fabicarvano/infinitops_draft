import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Clock,
  Info,
  Save,
  Edit,
  Trash2,
  Plus,
  AlertTriangle,
  Users,
  Calendar,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Tipos para a matriz de SLA
type PriorityLevel = "critical" | "high" | "medium" | "low";
type ServiceHours = "24x7" | "12x7" | "8x5";
type ContractLevel = "platinum" | "premium" | "standard" | "custom";

interface SLARule {
  priorityLevel: PriorityLevel;
  responseTime: number; // em minutos
  resolutionTime: number; // em minutos
  serviceHours: ServiceHours;
  escalationLevels: {
    level: number;
    timeBeforeEscalation: number; // em minutos
    notifyRoles: string[];
  }[];
}

interface SLAMatrix {
  id?: number;
  name: string;
  description: string;
  contractLevel: ContractLevel;
  rules: Record<PriorityLevel, SLARule>;
  isDefault?: boolean;
  isPaused?: boolean;
}

const defaultSLAMatrices: SLAMatrix[] = [
  {
    id: 1,
    name: "Platinum SLA",
    description: "Nosso nível mais alto de serviço, com tempos de resposta e resolução extremamente rápidos",
    contractLevel: "platinum",
    isDefault: true,
    isPaused: false,
    rules: {
      critical: {
        priorityLevel: "critical",
        responseTime: 15, // 15 minutos
        resolutionTime: 120, // 2 horas
        serviceHours: "24x7",
        escalationLevels: [
          {
            level: 1,
            timeBeforeEscalation: 30, // 30 minutos
            notifyRoles: ["support_l1", "support_l2"]
          },
          {
            level: 2,
            timeBeforeEscalation: 60, // 1 hora
            notifyRoles: ["support_l2", "manager"]
          },
          {
            level: 3,
            timeBeforeEscalation: 90, // 1.5 horas
            notifyRoles: ["manager", "director"]
          }
        ]
      },
      high: {
        priorityLevel: "high",
        responseTime: 30, // 30 minutos
        resolutionTime: 240, // 4 horas
        serviceHours: "24x7",
        escalationLevels: [
          {
            level: 1,
            timeBeforeEscalation: 60, // 1 hora
            notifyRoles: ["support_l1"]
          },
          {
            level: 2,
            timeBeforeEscalation: 120, // 2 horas
            notifyRoles: ["support_l1", "support_l2"]
          },
          {
            level: 3,
            timeBeforeEscalation: 180, // 3 horas
            notifyRoles: ["support_l2", "manager"]
          }
        ]
      },
      medium: {
        priorityLevel: "medium",
        responseTime: 60, // 1 hora
        resolutionTime: 480, // 8 horas
        serviceHours: "24x7",
        escalationLevels: [
          {
            level: 1,
            timeBeforeEscalation: 120, // 2 horas
            notifyRoles: ["support_l1"]
          },
          {
            level: 2,
            timeBeforeEscalation: 240, // 4 horas
            notifyRoles: ["support_l1", "support_l2"]
          }
        ]
      },
      low: {
        priorityLevel: "low",
        responseTime: 120, // 2 horas
        resolutionTime: 960, // 16 horas
        serviceHours: "12x7",
        escalationLevels: [
          {
            level: 1,
            timeBeforeEscalation: 240, // 4 horas
            notifyRoles: ["support_l1"]
          }
        ]
      }
    }
  },
  {
    id: 2,
    name: "Premium SLA",
    description: "Suporte de alta qualidade com tempos de resposta rápidos",
    contractLevel: "premium",
    isDefault: false,
    isPaused: false,
    rules: {
      critical: {
        priorityLevel: "critical",
        responseTime: 30, // 30 minutos
        resolutionTime: 240, // 4 horas
        serviceHours: "24x7",
        escalationLevels: [
          {
            level: 1,
            timeBeforeEscalation: 60, // 1 hora
            notifyRoles: ["support_l1"]
          },
          {
            level: 2,
            timeBeforeEscalation: 120, // 2 horas
            notifyRoles: ["support_l1", "support_l2"]
          }
        ]
      },
      high: {
        priorityLevel: "high",
        responseTime: 60, // 1 hora
        resolutionTime: 480, // 8 horas
        serviceHours: "24x7",
        escalationLevels: [
          {
            level: 1,
            timeBeforeEscalation: 120, // 2 horas
            notifyRoles: ["support_l1"]
          },
          {
            level: 2,
            timeBeforeEscalation: 240, // 4 horas
            notifyRoles: ["support_l1", "support_l2"]
          }
        ]
      },
      medium: {
        priorityLevel: "medium",
        responseTime: 120, // 2 horas
        resolutionTime: 960, // 16 horas
        serviceHours: "12x7",
        escalationLevels: [
          {
            level: 1,
            timeBeforeEscalation: 240, // 4 horas
            notifyRoles: ["support_l1"]
          }
        ]
      },
      low: {
        priorityLevel: "low",
        responseTime: 240, // 4 horas
        resolutionTime: 1920, // 32 horas (aproximadamente 4 dias úteis)
        serviceHours: "8x5",
        escalationLevels: [
          {
            level: 1,
            timeBeforeEscalation: 480, // 8 horas
            notifyRoles: ["support_l1"]
          }
        ]
      }
    }
  },
  {
    id: 3,
    name: "Standard SLA",
    description: "Suporte padrão para a maioria dos clientes",
    contractLevel: "standard",
    isDefault: false,
    isPaused: false,
    rules: {
      critical: {
        priorityLevel: "critical",
        responseTime: 60, // 1 hora
        resolutionTime: 480, // 8 horas
        serviceHours: "12x7",
        escalationLevels: [
          {
            level: 1,
            timeBeforeEscalation: 120, // 2 horas
            notifyRoles: ["support_l1"]
          }
        ]
      },
      high: {
        priorityLevel: "high",
        responseTime: 120, // 2 horas
        resolutionTime: 960, // 16 horas
        serviceHours: "12x7",
        escalationLevels: [
          {
            level: 1,
            timeBeforeEscalation: 240, // 4 horas
            notifyRoles: ["support_l1"]
          }
        ]
      },
      medium: {
        priorityLevel: "medium",
        responseTime: 240, // 4 horas
        resolutionTime: 1920, // 32 horas
        serviceHours: "8x5",
        escalationLevels: []
      },
      low: {
        priorityLevel: "low",
        responseTime: 480, // 8 horas
        resolutionTime: 3840, // 64 horas (aproximadamente 8 dias úteis)
        serviceHours: "8x5",
        escalationLevels: []
      }
    }
  }
];

// Helper para formatar minutos em um formato mais legível
const formatMinutes = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  } else if (minutes < 1440) { // menos de 24 horas
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  } else { // dias
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  }
};

// Helper para obter cor baseada na prioridade
const getPriorityColor = (priority: PriorityLevel): string => {
  switch (priority) {
    case "critical":
      return "bg-red-100 text-red-700 border-red-200";
    case "high":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "medium":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "low":
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

// Helper para obter cor baseada no nível de contrato
const getContractLevelColor = (level: ContractLevel): string => {
  switch (level) {
    case "platinum":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "premium":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "standard":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "custom":
      return "bg-pink-100 text-pink-700 border-pink-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

interface SLAMatrixEditorProps {
  initialMatrices?: SLAMatrix[];
  onSave?: (matrices: SLAMatrix[]) => void;
  readOnly?: boolean;
}

export function SLAMatrixEditor({
  initialMatrices = defaultSLAMatrices,
  onSave,
  readOnly = false
}: SLAMatrixEditorProps) {
  const [matrices, setMatrices] = useState<SLAMatrix[]>(initialMatrices);
  const [selectedMatrixId, setSelectedMatrixId] = useState<number | undefined>(initialMatrices[0]?.id);
  const [activeTab, setActiveTab] = useState<string>("matrix-overview");
  const [editingRule, setEditingRule] = useState<{
    matrixId: number;
    priority: PriorityLevel;
  } | null>(null);
  
  // Encontrar a matriz selecionada
  const selectedMatrix = matrices.find(m => m.id === selectedMatrixId);
  
  // Função para selecionar uma matriz
  const handleSelectMatrix = (id: number) => {
    setSelectedMatrixId(id);
    setEditingRule(null); // Resetar o modo de edição
  };
  
  // Função para atualizar uma regra de SLA
  const handleUpdateRule = (priority: PriorityLevel, field: keyof SLARule, value: any) => {
    if (!selectedMatrix) return;
    
    const updatedMatrices = matrices.map(matrix => {
      if (matrix.id === selectedMatrix.id) {
        return {
          ...matrix,
          rules: {
            ...matrix.rules,
            [priority]: {
              ...matrix.rules[priority],
              [field]: value
            }
          }
        };
      }
      return matrix;
    });
    
    setMatrices(updatedMatrices);
  };
  
  // Função para salvar as alterações
  const handleSave = () => {
    if (onSave) {
      onSave(matrices);
    }
  };
  
  // Renderização do editor de regras de SLA
  const renderRuleEditor = (priority: PriorityLevel) => {
    if (!selectedMatrix) return null;
    
    const rule = selectedMatrix.rules[priority];
    
    return (
      <Card className={`border-l-4 ${getPriorityColor(priority)}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Badge className={getPriorityColor(priority)}>
              {priority === "critical" ? "Crítico" : 
               priority === "high" ? "Alto" : 
               priority === "medium" ? "Médio" : "Baixo"}
            </Badge>
            Configurações de SLA
          </CardTitle>
          <CardDescription>
            Defina os tempos de resposta e resolução para a prioridade {" "}
            {priority === "critical" ? "Crítica" : 
             priority === "high" ? "Alta" : 
             priority === "medium" ? "Média" : "Baixa"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`response-time-${priority}`}>Tempo de Resposta</Label>
              <div className="flex gap-2">
                <Input
                  id={`response-time-${priority}`}
                  type="number"
                  min="1"
                  value={rule.responseTime}
                  onChange={(e) => handleUpdateRule(priority, "responseTime", parseInt(e.target.value) || 0)}
                  className="w-full"
                  disabled={readOnly}
                />
                <span className="flex items-center text-slate-500 min-w-[50px]">min</span>
              </div>
              <p className="text-xs text-slate-500">
                Tempo para iniciar o atendimento
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`resolution-time-${priority}`}>Tempo de Resolução</Label>
              <div className="flex gap-2">
                <Input
                  id={`resolution-time-${priority}`}
                  type="number"
                  min="1"
                  value={rule.resolutionTime}
                  onChange={(e) => handleUpdateRule(priority, "resolutionTime", parseInt(e.target.value) || 0)}
                  className="w-full"
                  disabled={readOnly}
                />
                <span className="flex items-center text-slate-500 min-w-[50px]">min</span>
              </div>
              <p className="text-xs text-slate-500">
                Tempo para resolver completamente
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`service-hours-${priority}`}>Horário de Atendimento</Label>
              <Select
                value={rule.serviceHours}
                onValueChange={(value) => handleUpdateRule(priority, "serviceHours", value as ServiceHours)}
                disabled={readOnly}
              >
                <SelectTrigger id={`service-hours-${priority}`}>
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24x7">24x7 (24h, todos os dias)</SelectItem>
                  <SelectItem value="12x7">12x7 (12h, todos os dias)</SelectItem>
                  <SelectItem value="8x5">8x5 (Horário comercial)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                Período em que o SLA é contabilizado
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold">Níveis de Escalonamento</h4>
              {!readOnly && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const updatedRules = { ...selectedMatrix.rules };
                    const newEscalationLevel = {
                      level: (updatedRules[priority].escalationLevels.length + 1),
                      timeBeforeEscalation: 60,
                      notifyRoles: ["support_l1"]
                    };
                    
                    updatedRules[priority] = {
                      ...updatedRules[priority],
                      escalationLevels: [...updatedRules[priority].escalationLevels, newEscalationLevel]
                    };
                    
                    const updatedMatrices = matrices.map(matrix => {
                      if (matrix.id === selectedMatrix.id) {
                        return {
                          ...matrix,
                          rules: updatedRules
                        };
                      }
                      return matrix;
                    });
                    
                    setMatrices(updatedMatrices);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" /> Adicionar Nível
                </Button>
              )}
            </div>
            
            {rule.escalationLevels.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Nível</TableHead>
                    <TableHead>Tempo</TableHead>
                    <TableHead>Notificar</TableHead>
                    {!readOnly && <TableHead className="w-[80px]">Ações</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rule.escalationLevels.map((level, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{level.level}</TableCell>
                      <TableCell>
                        {readOnly ? (
                          formatMinutes(level.timeBeforeEscalation)
                        ) : (
                          <div className="flex gap-2 items-center">
                            <Input
                              type="number"
                              min="1"
                              className="w-20"
                              value={level.timeBeforeEscalation}
                              onChange={(e) => {
                                const updatedRules = { ...selectedMatrix.rules };
                                updatedRules[priority].escalationLevels[index].timeBeforeEscalation = 
                                  parseInt(e.target.value) || 0;
                                
                                const updatedMatrices = matrices.map(matrix => {
                                  if (matrix.id === selectedMatrix.id) {
                                    return {
                                      ...matrix,
                                      rules: updatedRules
                                    };
                                  }
                                  return matrix;
                                });
                                
                                setMatrices(updatedMatrices);
                              }}
                            />
                            <span className="text-slate-500">min</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {level.notifyRoles.map(role => {
                          const roleName = role === "support_l1" ? "Suporte N1" :
                                          role === "support_l2" ? "Suporte N2" :
                                          role === "manager" ? "Gerente" :
                                          role === "director" ? "Diretor" : role;
                          
                          return (
                            <Badge key={role} variant="outline" className="mr-1">
                              {roleName}
                            </Badge>
                          );
                        })}
                      </TableCell>
                      {!readOnly && (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const updatedRules = { ...selectedMatrix.rules };
                              updatedRules[priority].escalationLevels = 
                                updatedRules[priority].escalationLevels.filter((_, i) => i !== index);
                              
                              // Reajustar os níveis
                              updatedRules[priority].escalationLevels = 
                                updatedRules[priority].escalationLevels.map((l, i) => ({
                                  ...l,
                                  level: i + 1
                                }));
                              
                              const updatedMatrices = matrices.map(matrix => {
                                if (matrix.id === selectedMatrix.id) {
                                  return {
                                    ...matrix,
                                    rules: updatedRules
                                  };
                                }
                                return matrix;
                              });
                              
                              setMatrices(updatedMatrices);
                            }}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="bg-slate-50 p-4 rounded-md text-center text-slate-500">
                Não há níveis de escalonamento definidos para esta prioridade.
                {!readOnly && (
                  <p className="text-sm mt-1">
                    Clique em "Adicionar Nível" para configurar o escalonamento.
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Matrizes de SLA</h2>
          <p className="text-slate-500 mt-1">
            Configure os tempos de resposta, resolução e escalonamento para cada nível de contrato.
          </p>
        </div>
        
        {!readOnly && (
          <Button onClick={handleSave} className="bg-green-700 hover:bg-green-800">
            <Save className="h-4 w-4 mr-2" /> Salvar Configurações
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Painel lateral com lista de matrizes */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Matrizes Disponíveis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {matrices.map(matrix => (
                <div
                  key={matrix.id}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    selectedMatrixId === matrix.id
                      ? "bg-green-50 border-l-4 border-green-500"
                      : "hover:bg-slate-50 border-l-4 border-transparent"
                  }`}
                  onClick={() => handleSelectMatrix(matrix.id!)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-slate-900">{matrix.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{matrix.description}</p>
                    </div>
                    <Badge className={getContractLevelColor(matrix.contractLevel)}>
                      {matrix.contractLevel === "platinum" ? "Platinum" :
                       matrix.contractLevel === "premium" ? "Premium" :
                       matrix.contractLevel === "standard" ? "Standard" : "Custom"}
                    </Badge>
                  </div>
                  
                  {matrix.isDefault && (
                    <div className="flex items-center mt-2">
                      <Badge variant="outline" className="text-xs">
                        Padrão
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
            {!readOnly && (
              <CardFooter className="border-t pt-4 flex justify-center">
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" /> Nova Matriz
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
        
        {/* Conteúdo principal */}
        <div className="lg:col-span-9 space-y-6">
          {selectedMatrix ? (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedMatrix.name}</CardTitle>
                      <CardDescription>{selectedMatrix.description}</CardDescription>
                    </div>
                    <Badge className={getContractLevelColor(selectedMatrix.contractLevel)}>
                      {selectedMatrix.contractLevel === "platinum" ? "Platinum" :
                       selectedMatrix.contractLevel === "premium" ? "Premium" :
                       selectedMatrix.contractLevel === "standard" ? "Standard" : "Custom"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="matrix-overview" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="matrix-overview">
                        <Users className="h-4 w-4 mr-2" /> Visão Geral
                      </TabsTrigger>
                      <TabsTrigger value="escalation-rules">
                        <AlertTriangle className="h-4 w-4 mr-2" /> Escalonamento
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="matrix-overview" className="space-y-4 pt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[120px]">Prioridade</TableHead>
                            <TableHead className="text-center">Resposta</TableHead>
                            <TableHead className="text-center">Resolução</TableHead>
                            <TableHead className="text-center">Atendimento</TableHead>
                            <TableHead className="text-center">Escalonamento</TableHead>
                            {!readOnly && <TableHead className="w-[80px] text-right">Ações</TableHead>}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(Object.keys(selectedMatrix.rules) as PriorityLevel[]).map(priority => (
                            <TableRow key={priority}>
                              <TableCell>
                                <Badge className={getPriorityColor(priority)}>
                                  {priority === "critical" ? "Crítico" : 
                                   priority === "high" ? "Alto" : 
                                   priority === "medium" ? "Médio" : "Baixo"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex flex-col items-center">
                                  <span className="font-bold">
                                    {formatMinutes(selectedMatrix.rules[priority].responseTime)}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    após abertura
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex flex-col items-center">
                                  <span className="font-bold">
                                    {formatMinutes(selectedMatrix.rules[priority].resolutionTime)}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    até resolução
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Badge variant="outline">
                                        {selectedMatrix.rules[priority].serviceHours}
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        {selectedMatrix.rules[priority].serviceHours === "24x7" 
                                          ? "24 horas, 7 dias por semana" 
                                          : selectedMatrix.rules[priority].serviceHours === "12x7"
                                          ? "12 horas por dia, 7 dias por semana"
                                          : "8 horas por dia, 5 dias por semana (dias úteis)"}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge variant="outline">
                                  {selectedMatrix.rules[priority].escalationLevels.length} níveis
                                </Badge>
                              </TableCell>
                              {!readOnly && (
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setEditingRule({ 
                                      matrixId: selectedMatrix.id!, 
                                      priority 
                                    })}
                                    className="h-8 w-8"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      
                      {editingRule && editingRule.matrixId === selectedMatrix.id && (
                        <div className="mt-6">
                          <h3 className="text-lg font-medium mb-4">Editar Regra de SLA</h3>
                          {renderRuleEditor(editingRule.priority)}
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="escalation-rules" className="space-y-6 pt-4">
                      {(Object.keys(selectedMatrix.rules) as PriorityLevel[]).map(priority => (
                        <div key={priority} className="space-y-1">
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Badge className={getPriorityColor(priority)}>
                              {priority === "critical" ? "Crítico" : 
                               priority === "high" ? "Alto" : 
                               priority === "medium" ? "Médio" : "Baixo"}
                            </Badge>
                            Regra de Escalonamento
                          </h3>
                          
                          {selectedMatrix.rules[priority].escalationLevels.length > 0 ? (
                            <div className="relative pl-8 pb-6 pt-6 border-l-2 border-slate-200 ml-2 space-y-8">
                              {selectedMatrix.rules[priority].escalationLevels.map((level, index) => (
                                <div key={index} className="relative">
                                  <div className="absolute -left-10 mt-1 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                                    {level.level}
                                  </div>
                                  <div className="bg-white border rounded-lg p-4 shadow-sm">
                                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                                      <h4 className="font-medium">Nível {level.level} de Escalonamento</h4>
                                      <Badge variant="outline">
                                        {formatMinutes(level.timeBeforeEscalation)} após abertura
                                      </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      <div className="text-slate-600 text-sm mr-2">Notificar:</div>
                                      {level.notifyRoles.map(role => {
                                        const roleName = role === "support_l1" ? "Suporte N1" :
                                                        role === "support_l2" ? "Suporte N2" :
                                                        role === "manager" ? "Gerente" :
                                                        role === "director" ? "Diretor" : role;
                                        
                                        return (
                                          <Badge key={role} variant="outline" className="flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            {roleName}
                                          </Badge>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center text-slate-500 mt-2">
                              Não há níveis de escalonamento definidos para esta prioridade.
                            </div>
                          )}
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium">Nenhuma matriz de SLA selecionada</h3>
                <p className="text-slate-500 mt-1">
                  Selecione uma matriz na lista lateral para visualizar e editar suas configurações.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}