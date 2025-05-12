import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  TicketIcon, 
  Clock, 
  AlertTriangle, 
  User, 
  Server, 
  MessageSquare, 
  FileText, 
  History, 
  Building, 
  ArrowRight, 
  CheckCircle, 
  PhoneCall,
  RefreshCw,
  Bell
} from "lucide-react";

import { AssignmentSelector } from "./AssignmentSelector";
import { CommentSection } from "./CommentSection";
import { TicketSLAPanel } from "./TicketSLAPanel";
import { TicketEscalationPanel } from "./TicketEscalationPanel";

// Utilizamos a interface existente
export interface TicketDetails {
  id: number;
  title: string;
  description: string;
  status: "open" | "waiting_client" | "waiting_schedule" | "in_progress" | "resolved" | "closed";
  priority: "critical" | "high" | "medium" | "low";
  asset: {
    id: number;
    name: string;
    type: string;
  };
  client: {
    id: number;
    name: string;
  };
  assignee?: {
    id: number;
    name: string;
    avatar?: string;
  };
  created_by: {
    id: number;
    name: string;
    avatar?: string;
  };
  created_at: string;
  updated_at: string;
  
  // SLA info
  sla_priority?: string;
  first_response_deadline?: string;
  resolution_deadline?: string;
  sla_paused?: boolean;
  sla_violated?: boolean;
  
  // Relacionamentos
  alert_id?: number;
  
  // Histórico de interações (simplificado para esta fase)
  interactions?: {
    id: number;
    type: "comment" | "status_change" | "assignment" | "system";
    content: string;
    user?: {
      id: number;
      name: string;
      avatar?: string;
    };
    is_public: boolean;
    created_at: string;
  }[];
}

interface EnhancedTicketPanelProps {
  ticket: TicketDetails;
  onStatusChange?: (ticketId: number, newStatus: string) => void;
  onAddComment?: (ticketId: number, comment: string, isPublic: boolean) => void;
  onAssignUser?: (ticketId: number, userId: number) => void;
  onEscalate?: (ticketId: number, toLevel: string, reason: string) => void;
  onPauseSLA?: (ticketId: number, reason: string) => void;
  onResumeSLA?: (ticketId: number) => void;
  onClose?: () => void;
  className?: string;
}

export function EnhancedTicketPanel({ 
  ticket, 
  onStatusChange, 
  onAddComment, 
  onAssignUser,
  onEscalate,
  onPauseSLA,
  onResumeSLA,
  onClose,
  className = "" 
}: EnhancedTicketPanelProps) {
  const [activeTab, setActiveTab] = useState("details");
  
  // Funções auxiliares para formatação
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-100 text-blue-700">Aberto</Badge>;
      case "waiting_client":
        return <Badge className="bg-purple-100 text-purple-700">Aguardando Cliente</Badge>;
      case "waiting_schedule":
        return <Badge className="bg-indigo-100 text-indigo-700">Aguardando Janela</Badge>;
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-700">Em Andamento</Badge>;
      case "resolved":
        return <Badge className="bg-green-100 text-green-700">Resolvido</Badge>;
      case "closed":
        return <Badge className="bg-slate-100 text-slate-700">Fechado</Badge>;
      default:
        return <Badge className="bg-slate-100">Indefinido</Badge>;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge className="bg-red-100 text-red-700">Crítico</Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-700">Alto</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-700">Médio</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-700">Baixo</Badge>;
      default:
        return <Badge className="bg-slate-100">Indefinido</Badge>;
    }
  };
  
  const getSLAStatus = () => {
    if (ticket.sla_violated) {
      return (
        <div className="flex items-center text-red-600">
          <AlertTriangle className="h-4 w-4 mr-1.5" />
          <span>SLA Violado</span>
        </div>
      );
    } else if (ticket.sla_paused) {
      return (
        <div className="flex items-center text-slate-600">
          <Clock className="h-4 w-4 mr-1.5" />
          <span>SLA Pausado</span>
        </div>
      );
    } else if (ticket.resolution_deadline) {
      const deadline = new Date(ticket.resolution_deadline);
      const now = new Date();
      const timeRemaining = deadline.getTime() - now.getTime();
      
      if (timeRemaining < 0) {
        return (
          <div className="flex items-center text-red-600">
            <AlertTriangle className="h-4 w-4 mr-1.5" />
            <span>SLA Expirado</span>
          </div>
        );
      } else if (timeRemaining < 3600000) { // Menos de 1 hora
        return (
          <div className="flex items-center text-red-600">
            <Clock className="h-4 w-4 mr-1.5" />
            <span>SLA: &lt; 1h restante</span>
          </div>
        );
      } else if (timeRemaining < 14400000) { // Menos de 4 horas
        return (
          <div className="flex items-center text-orange-600">
            <Clock className="h-4 w-4 mr-1.5" />
            <span>SLA: {Math.floor(timeRemaining / 3600000)}h restantes</span>
          </div>
        );
      } else {
        return (
          <div className="flex items-center text-green-600">
            <Clock className="h-4 w-4 mr-1.5" />
            <span>SLA: {Math.floor(timeRemaining / 3600000)}h restantes</span>
          </div>
        );
      }
    }
    
    return null;
  };
  
  const handleStatusChange = (newStatus: string) => {
    if (onStatusChange) {
      onStatusChange(ticket.id, newStatus);
    }
  };
  
  // Converter interações para o formato de comentários
  const getCommentsFromInteractions = () => {
    if (!ticket.interactions) return [];
    
    return ticket.interactions
      .filter(interaction => interaction.type === "comment")
      .map(interaction => ({
        id: interaction.id,
        ticketId: ticket.id,
        userId: interaction.user?.id || 0,
        userName: interaction.user?.name || "Sistema",
        userRole: "technician", // Por padrão, podemos melhorar isso posteriormente
        userAvatar: interaction.user?.avatar,
        content: interaction.content,
        type: interaction.is_public ? "external" : "internal",
        createdAt: interaction.created_at
      }));
  };
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-4 border-b border-slate-100">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TicketIcon className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-xl">Chamado #{ticket.id}</CardTitle>
              {getStatusBadge(ticket.status)}
              {getPriorityBadge(ticket.priority)}
            </div>
            <div className="text-sm text-slate-500">
              Aberto em {formatDateTime(ticket.created_at)}
            </div>
          </div>
          <div>
            {getSLAStatus()}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-slate-100">
            <TabsList className="h-12 w-full bg-slate-50 rounded-none">
              <TabsTrigger value="details" className="flex-1 data-[state=active]:bg-white">
                <FileText className="h-4 w-4 mr-2" />
                Detalhes
              </TabsTrigger>
              <TabsTrigger value="sla" className="flex-1 data-[state=active]:bg-white">
                <Clock className="h-4 w-4 mr-2" />
                SLA
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex-1 data-[state=active]:bg-white">
                <MessageSquare className="h-4 w-4 mr-2" />
                Comentários
              </TabsTrigger>
              <TabsTrigger value="escalation" className="flex-1 data-[state=active]:bg-white">
                <ArrowRight className="h-4 w-4 mr-2" />
                Escalonamento
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Conteúdo da aba de Detalhes */}
          <TabsContent value="details" className="p-0 m-0">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">{ticket.title}</h3>
              <div className="mb-6 text-slate-700 whitespace-pre-line">
                {ticket.description}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Informações do Cliente */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                    Informações do Cliente
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3 mb-4">
                      <Building className="h-5 w-5 text-slate-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">{ticket.client.name}</div>
                        <div className="text-xs text-slate-500">Cliente</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Server className="h-5 w-5 text-slate-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">{ticket.asset.name}</div>
                        <div className="text-xs text-slate-500">{ticket.asset.type}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Atribuição do Chamado */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                    Atribuição
                  </h4>
                  <AssignmentSelector
                    ticketId={ticket.id}
                    currentAssignee={ticket.assignee ? {
                      id: ticket.assignee.id,
                      name: ticket.assignee.name,
                      email: `${ticket.assignee.name.toLowerCase().replace(/\s+/g, '.')}@exemplo.com`,
                      role: "technician",
                      avatar: ticket.assignee.avatar
                    } : undefined}
                    onAssign={onAssignUser}
                  />
                </div>
              </div>
              
              {/* Botões de Ação */}
              <div className="flex flex-wrap gap-2 justify-end mt-4">
                {ticket.status === "open" && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStatusChange("in_progress")}
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Iniciar Atendimento
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStatusChange("waiting_client")}
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Aguardando Cliente
                    </Button>
                  </>
                )}
                
                {ticket.status === "in_progress" && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStatusChange("waiting_client")}
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Aguardando Cliente
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStatusChange("waiting_schedule")}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Aguardando Janela
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStatusChange("resolved")}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Resolver
                    </Button>
                  </>
                )}
                
                {(ticket.status === "waiting_client" || ticket.status === "waiting_schedule") && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleStatusChange("in_progress")}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retomar Atendimento
                  </Button>
                )}
                
                {ticket.status === "resolved" && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleStatusChange("closed")}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Fechar Chamado
                  </Button>
                )}
                
                <Button variant="outline" size="sm">
                  <PhoneCall className="h-4 w-4 mr-2" />
                  Ligar para Cliente
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Conteúdo da aba de SLA */}
          <TabsContent value="sla" className="p-0 m-0">
            <div className="p-6">
              {ticket.resolution_deadline && ticket.first_response_deadline ? (
                <TicketSLAPanel
                  ticketId={ticket.id}
                  ticketCreatedAt={ticket.created_at}
                  firstResponseAt={undefined} // Seria atualizado conforme a lógica real
                  resolvedAt={ticket.status === "resolved" || ticket.status === "closed" ? ticket.updated_at : undefined}
                  firstResponseDeadline={ticket.first_response_deadline}
                  resolutionDeadline={ticket.resolution_deadline}
                  isPaused={ticket.sla_paused}
                  pausedAt={ticket.sla_paused ? new Date().toISOString() : undefined} // Simplificação
                  totalPausedTime={0} // Simplificação
                  slaMatrixName={`${ticket.sla_priority || ticket.priority} SLA`}
                  contractLevel={ticket.sla_priority || ticket.priority}
                  onPause={onPauseSLA}
                  onResume={onResumeSLA}
                />
              ) : (
                <div className="text-center p-8 border border-dashed rounded-lg">
                  <Clock className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                  <h3 className="font-medium text-slate-600">SLA não configurado</h3>
                  <p className="text-slate-500 mt-1">
                    Este chamado não possui configurações de SLA definidas.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Conteúdo da aba de Comentários */}
          <TabsContent value="comments" className="p-0 m-0">
            <div className="p-6">
              <CommentSection
                ticketId={ticket.id}
                comments={getCommentsFromInteractions()}
                currentUserId={1} // Simplificação - em um sistema real viria do contexto de autenticação
                currentUserName="Técnico Atual"
                currentUserRole="technician"
                onAddComment={(ticketId, content, type) => {
                  if (onAddComment) {
                    onAddComment(ticketId, content, type === "external");
                  }
                }}
              />
            </div>
          </TabsContent>
          
          {/* Conteúdo da aba de Escalonamento */}
          <TabsContent value="escalation" className="p-0 m-0">
            <div className="p-6">
              <TicketEscalationPanel
                ticketId={ticket.id}
                currentLevel="N1"
                initialLevel="N1"
                escalationHistory={[]}
                nextEscalationTime={ticket.resolution_deadline ? 
                  new Date(new Date(ticket.resolution_deadline).getTime() - 3600000).toISOString() : 
                  undefined
                }
                awaitingCustomer={ticket.status === "waiting_client"}
                customerWaitingSince={ticket.status === "waiting_client" ? ticket.updated_at : undefined}
                customerEscalationDays={ticket.status === "waiting_client" ? 
                  Math.floor((new Date().getTime() - new Date(ticket.updated_at).getTime()) / (1000 * 60 * 60 * 24)) : 
                  undefined
                }
                nextCustomerAction={ticket.status === "waiting_client" ? "Email automático em 2 dias" : undefined}
                onEscalate={onEscalate}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}