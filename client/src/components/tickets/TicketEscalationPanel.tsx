import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowUpCircle, 
  Clock, 
  UserCog, 
  AlertTriangle, 
  History,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// Define tipos para o componente
type SupportLevel = "N1" | "N2" | "N3" | "Especialista" | "Gerente" | "Diretor";
type EscalationType = "internal" | "customer";

interface EscalationEvent {
  id: number;
  timestamp: string;
  fromLevel?: SupportLevel;
  toLevel?: SupportLevel;
  type: EscalationType;
  reason: string;
  automatic: boolean;
}

interface TicketEscalationPanelProps {
  ticketId: number;
  currentLevel: SupportLevel;
  initialLevel: SupportLevel;
  escalationHistory: EscalationEvent[];
  nextEscalationTime?: string;
  awaitingCustomer?: boolean;
  customerWaitingSince?: string;
  customerEscalationDays?: number;
  nextCustomerAction?: string;
  onEscalate?: (ticketId: number, toLevel: SupportLevel, reason: string) => void;
  className?: string;
}

export function TicketEscalationPanel({
  ticketId,
  currentLevel,
  initialLevel,
  escalationHistory,
  nextEscalationTime,
  awaitingCustomer = false,
  customerWaitingSince,
  customerEscalationDays,
  nextCustomerAction,
  onEscalate,
  className = ""
}: TicketEscalationPanelProps) {
  const { toast } = useToast();
  const [isManualEscalationOpen, setIsManualEscalationOpen] = useState(false);
  const [escalateToLevel, setEscalateToLevel] = useState<SupportLevel>("N2");
  const [escalationReason, setEscalationReason] = useState("");
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  
  // Função para lidar com o escalonamento manual
  const handleManualEscalation = () => {
    if (!escalationReason.trim()) {
      toast({
        title: "Erro",
        description: "É necessário fornecer um motivo para o escalonamento.",
        variant: "destructive",
      });
      return;
    }
    
    if (onEscalate) {
      onEscalate(ticketId, escalateToLevel, escalationReason);
    }
    
    toast({
      title: "Chamado Escalado",
      description: `O chamado #${ticketId} foi escalado para ${escalateToLevel} com sucesso.`,
    });
    
    setIsManualEscalationOpen(false);
    setEscalationReason("");
  };
  
  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };
  
  // Obter cor do nível de suporte
  const getSupportLevelColor = (level: SupportLevel): string => {
    switch (level) {
      case "N1":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "N2":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "N3":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "Especialista":
        return "bg-green-100 text-green-700 border-green-200";
      case "Gerente":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Diretor":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };
  
  return (
    <>
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCog className="h-5 w-5 text-blue-600" />
            Informações de Escalonamento
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          {/* Status atual de escalonamento */}
          <div className="mb-4 bg-slate-50 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-500">Nível Atual:</span>
              <Badge variant="outline" className={getSupportLevelColor(currentLevel)}>
                {currentLevel}
              </Badge>
            </div>
            
            {!awaitingCustomer && nextEscalationTime && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Próximo Escalonamento:</span>
                <span className="text-sm font-medium">
                  {formatDate(nextEscalationTime)}
                </span>
              </div>
            )}
            
            {awaitingCustomer && (
              <div className="mt-2 pt-2 border-t border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-slate-500">Aguardando Cliente:</span>
                  <span className="text-sm font-medium">
                    {customerWaitingSince ? formatDate(customerWaitingSince) : 'N/A'}
                  </span>
                </div>
                
                {customerEscalationDays !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Dias aguardando:</span>
                    <span className="text-sm font-medium">
                      {customerEscalationDays} {customerEscalationDays === 1 ? 'dia' : 'dias'}
                    </span>
                  </div>
                )}
                
                {nextCustomerAction && (
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-slate-500">Próxima ação:</span>
                    <span className="text-sm font-medium">
                      {nextCustomerAction}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Ações de escalonamento */}
          {!awaitingCustomer && (
            <div className="mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsManualEscalationOpen(true)}
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <ArrowUpCircle className="h-4 w-4 mr-2" />
                Escalonar Manualmente
              </Button>
            </div>
          )}
          
          {/* Histórico de escalonamento */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
              className="w-full flex justify-between items-center text-slate-500"
            >
              <span>Histórico de Escalonamento</span>
              {isHistoryExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            
            {isHistoryExpanded && (
              <div className="mt-4 space-y-3">
                {escalationHistory.length === 0 ? (
                  <div className="text-center p-4 border border-dashed rounded-md">
                    <p className="text-slate-500 text-sm">
                      Nenhum escalonamento registrado
                    </p>
                  </div>
                ) : (
                  escalationHistory.map(event => (
                    <div key={event.id} className="bg-slate-50 p-3 rounded-md">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          {event.type === "internal" ? (
                            <ArrowUpCircle className="h-4 w-4 text-blue-500 mr-2" />
                          ) : (
                            <Clock className="h-4 w-4 text-orange-500 mr-2" />
                          )}
                          <div>
                            <p className="text-sm font-medium">
                              {event.type === "internal" 
                                ? `${event.fromLevel} → ${event.toLevel}`
                                : "Aguardando Cliente"
                              }
                            </p>
                            <p className="text-xs text-slate-500">
                              {event.automatic ? "Automático" : "Manual"} • {formatDate(event.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                      {event.reason && (
                        <p className="text-sm mt-2 text-slate-600 pl-6">
                          {event.reason}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Modal de Escalonamento Manual */}
      <Dialog open={isManualEscalationOpen} onOpenChange={setIsManualEscalationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escalonar Chamado</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex gap-2">
              <AlertTriangle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium">Importante</p>
                <p className="mt-1">
                  O escalonamento manual move o chamado para um nível de suporte superior.
                  Apenas utilize quando a complexidade do caso exigir conhecimento especializado.
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Escalonar para:</label>
              <Select value={escalateToLevel} onValueChange={(value: any) => setEscalateToLevel(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o nível" />
                </SelectTrigger>
                <SelectContent>
                  {currentLevel !== "N2" && <SelectItem value="N2">N2 - Suporte Técnico</SelectItem>}
                  {currentLevel !== "N3" && <SelectItem value="N3">N3 - Especialista</SelectItem>}
                  {currentLevel !== "Especialista" && <SelectItem value="Especialista">Especialista</SelectItem>}
                  {currentLevel !== "Gerente" && <SelectItem value="Gerente">Gerente</SelectItem>}
                  {currentLevel !== "Diretor" && <SelectItem value="Diretor">Diretor</SelectItem>}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Motivo do Escalonamento:</label>
              <Textarea
                value={escalationReason}
                onChange={(e) => setEscalationReason(e.target.value)}
                placeholder="Descreva o motivo para o escalonamento..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManualEscalationOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleManualEscalation}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ArrowUpCircle className="h-4 w-4 mr-2" />
              Escalonar Chamado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}