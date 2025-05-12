import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { SLATicketTimer } from "@/components/sla/SLATicketTimer";
import { 
  PauseCircle, 
  PlayCircle, 
  AlertTriangle, 
  Clock, 
  CalendarClock,
  FileText,
  CheckCircle2,
  PlusCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface TicketSLAPanelProps {
  ticketId: number;
  ticketCreatedAt: string;
  firstResponseAt?: string;
  resolvedAt?: string;
  firstResponseDeadline: string;
  resolutionDeadline: string;
  isPaused?: boolean;
  pausedAt?: string;
  totalPausedTime?: number;
  slaMatrixName?: string;
  contractLevel?: string;
  onPause?: (ticketId: number, reason: string) => void;
  onResume?: (ticketId: number) => void;
  className?: string;
}

export function TicketSLAPanel({
  ticketId,
  ticketCreatedAt,
  firstResponseAt,
  resolvedAt,
  firstResponseDeadline,
  resolutionDeadline,
  isPaused = false,
  pausedAt,
  totalPausedTime = 0,
  slaMatrixName = "Standard SLA",
  contractLevel = "standard",
  onPause,
  onResume,
  className = ""
}: TicketSLAPanelProps) {
  const { toast } = useToast();
  const [isPauseDialogOpen, setIsPauseDialogOpen] = useState(false);
  const [pauseReason, setPauseReason] = useState("");
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  
  // Handler para pausar o SLA
  const handlePauseSLA = () => {
    if (!pauseReason.trim()) {
      toast({
        title: "Erro",
        description: "É necessário fornecer um motivo para pausar o SLA.",
        variant: "destructive",
      });
      return;
    }
    
    if (onPause) {
      onPause(ticketId, pauseReason);
    }
    
    toast({
      title: "SLA Pausado",
      description: `O SLA do chamado #${ticketId} foi pausado com sucesso.`,
    });
    
    setIsPauseDialogOpen(false);
    setPauseReason("");
  };
  
  // Handler para retomar o SLA
  const handleResumeSLA = () => {
    if (onResume) {
      onResume(ticketId);
    }
    
    toast({
      title: "SLA Retomado",
      description: `O SLA do chamado #${ticketId} foi retomado com sucesso.`,
    });
  };
  
  // Obter cor baseada no nível de contrato
  const getContractLevelColor = (level: string): string => {
    switch (level.toLowerCase()) {
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
  
  return (
    <>
      <Card className={className}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Informações de SLA
            </CardTitle>
            <Badge variant="outline" className={getContractLevelColor(contractLevel)}>
              {contractLevel.charAt(0).toUpperCase() + contractLevel.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <SLATicketTimer
            createdAt={ticketCreatedAt}
            firstResponseAt={firstResponseAt}
            resolvedAt={resolvedAt}
            firstResponseDeadline={firstResponseDeadline}
            resolutionDeadline={resolutionDeadline}
            isPaused={isPaused}
            pausedAt={pausedAt}
            totalPausedTime={totalPausedTime}
          />
          
          {/* Ações de SLA */}
          {!resolvedAt && (
            <div className="mt-4 flex gap-2 justify-end">
              {!isPaused ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsPauseDialogOpen(true)}
                  className="border-orange-200 text-orange-700 hover:bg-orange-50"
                >
                  <PauseCircle className="h-4 w-4 mr-2" />
                  Pausar SLA
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleResumeSLA}
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Retomar SLA
                </Button>
              )}
            </div>
          )}
          
          {/* Detalhes expandidos */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
              className="w-full flex justify-between items-center text-slate-500"
            >
              <span>Detalhes do Acordo de SLA</span>
              {isDetailsExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            
            {isDetailsExpanded && (
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <h4 className="font-medium flex items-center gap-1.5 mb-2">
                    <FileText className="h-4 w-4 text-slate-500" />
                    Matriz de SLA Aplicada
                  </h4>
                  <p className="text-slate-600">{slaMatrixName}</p>
                </div>
                
                <div>
                  <h4 className="font-medium flex items-center gap-1.5 mb-2">
                    <CalendarClock className="h-4 w-4 text-slate-500" />
                    Cronograma de SLA
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-slate-500">Abertura:</div>
                    <div>{new Date(ticketCreatedAt).toLocaleString('pt-BR')}</div>
                    
                    <div className="text-slate-500">Primeira Resposta:</div>
                    <div>
                      {firstResponseAt ? (
                        <span className="text-green-600">{new Date(firstResponseAt).toLocaleString('pt-BR')}</span>
                      ) : (
                        <span>Até {new Date(firstResponseDeadline).toLocaleString('pt-BR')}</span>
                      )}
                    </div>
                    
                    <div className="text-slate-500">Resolução:</div>
                    <div>
                      {resolvedAt ? (
                        <span className="text-green-600">{new Date(resolvedAt).toLocaleString('pt-BR')}</span>
                      ) : (
                        <span>Até {new Date(resolutionDeadline).toLocaleString('pt-BR')}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {isPaused && (
                  <div>
                    <h4 className="font-medium flex items-center gap-1.5 mb-2">
                      <PauseCircle className="h-4 w-4 text-orange-500" />
                      Informações de Pausa
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-slate-500">Pausado em:</div>
                      <div>{pausedAt ? new Date(pausedAt).toLocaleString('pt-BR') : 'N/A'}</div>
                      
                      <div className="text-slate-500">Tempo Total Pausado:</div>
                      <div>{`${Math.floor(totalPausedTime / 60)}h ${totalPausedTime % 60}min`}</div>
                    </div>
                  </div>
                )}
                
                {resolvedAt && (
                  <div>
                    <h4 className="font-medium flex items-center gap-1.5 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Resultado do SLA
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-slate-500">Status Final:</div>
                      <div>
                        {new Date(resolvedAt) <= new Date(resolutionDeadline) ? (
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                            Cumprido
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                            Violado
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-slate-500">Tempo Real de Resolução:</div>
                      <div>
                        {(() => {
                          const created = new Date(ticketCreatedAt).getTime();
                          const resolved = new Date(resolvedAt).getTime();
                          const diffMinutes = Math.floor((resolved - created) / (1000 * 60));
                          const hours = Math.floor(diffMinutes / 60);
                          const minutes = diffMinutes % 60;
                          return `${hours}h ${minutes}min`;
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Modal de Pausa de SLA */}
      <Dialog open={isPauseDialogOpen} onOpenChange={setIsPauseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pausar SLA do Chamado</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-orange-50 border border-orange-200 rounded-md p-3 flex gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-orange-700">
                <p className="font-medium">Atenção</p>
                <p className="mt-1">
                  Pausar o SLA interrompe a contagem do tempo de resolução. 
                  Essa ação deve ser usada apenas quando o atendimento está impedido 
                  por fatores externos, como aguardando retorno do cliente.
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pause-reason">Motivo da Pausa <span className="text-red-500">*</span></Label>
              <Textarea
                id="pause-reason"
                placeholder="Descreva o motivo pelo qual o SLA está sendo pausado..."
                value={pauseReason}
                onChange={(e) => setPauseReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPauseDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handlePauseSLA}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <PauseCircle className="h-4 w-4 mr-2" />
              Pausar SLA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}