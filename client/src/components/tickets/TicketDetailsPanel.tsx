import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  TicketIcon, 
  Clock, 
  AlertTriangle, 
  User, 
  Server, 
  MessageSquare, 
  FileText, 
  ClipboardList, 
  Users, 
  History, 
  Building, 
  ArrowRight, 
  FilePlus, 
  CheckCircle, 
  PhoneCall,
  RefreshCw,
  Bell
} from "lucide-react";

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

interface TicketDetailsPanelProps {
  ticket: TicketDetails;
  onStatusChange?: (ticketId: number, newStatus: string) => void;
  onAddComment?: (ticketId: number, comment: string, isPublic: boolean) => void;
  onClose?: () => void;
  className?: string;
}

export function TicketDetailsPanel({ 
  ticket, 
  onStatusChange, 
  onAddComment, 
  onClose,
  className = "" 
}: TicketDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [newComment, setNewComment] = useState("");
  const [isPublicComment, setIsPublicComment] = useState(true);
  
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
  
  const handleSubmitComment = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(ticket.id, newComment, isPublicComment);
      setNewComment("");
    }
  };
  
  const handleStatusChange = (newStatus: string) => {
    if (onStatusChange) {
      onStatusChange(ticket.id, newStatus);
    }
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
              <TabsTrigger value="interactions" className="flex-1 data-[state=active]:bg-white">
                <MessageSquare className="h-4 w-4 mr-2" />
                Interações
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1 data-[state=active]:bg-white">
                <History className="h-4 w-4 mr-2" />
                Histórico
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
                
                {/* Informações do Chamado */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                    Informações do Chamado
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3 mb-4">
                      <User className="h-5 w-5 text-slate-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">
                          {ticket.assignee ? ticket.assignee.name : "Não atribuído"}
                        </div>
                        <div className="text-xs text-slate-500">Responsável</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-slate-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">
                          {ticket.sla_priority || ticket.priority}
                        </div>
                        <div className="text-xs text-slate-500">Prioridade SLA</div>
                      </div>
                    </div>
                  </div>
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
          
          {/* Conteúdo da aba de Interações */}
          <TabsContent value="interactions" className="p-0 m-0">
            <div className="p-6">
              {/* Nova Interação */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  Nova Interação
                </h4>
                <div className="space-y-4">
                  <Textarea 
                    placeholder="Digite sua mensagem aqui..." 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={isPublicComment}
                        onChange={() => setIsPublicComment(!isPublicComment)}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <Label htmlFor="isPublic" className="text-sm font-medium cursor-pointer">
                        Comentário visível para o cliente
                      </Label>
                    </div>
                    <Button onClick={handleSubmitComment}>
                      Adicionar
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Lista de Interações */}
              <ScrollArea className="h-[400px] pr-4">
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                  Interações
                </h4>
                
                {ticket.interactions && ticket.interactions.length > 0 ? (
                  <div className="space-y-4">
                    {ticket.interactions.map((interaction) => (
                      <div 
                        key={interaction.id} 
                        className={`p-4 rounded-lg border ${
                          interaction.is_public 
                            ? "border-blue-100 bg-blue-50" 
                            : "border-gray-100 bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            {interaction.user ? (
                              <>
                                <Avatar className="h-8 w-8 mr-2">
                                  {interaction.user.avatar ? (
                                    <AvatarImage src={interaction.user.avatar} alt={interaction.user.name} />
                                  ) : (
                                    <AvatarFallback>{interaction.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                  )}
                                </Avatar>
                                <div>
                                  <div className="text-sm font-medium">{interaction.user.name}</div>
                                  <div className="text-xs text-slate-500">{formatDateTime(interaction.created_at)}</div>
                                </div>
                              </>
                            ) : (
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                  <Server className="h-4 w-4 text-gray-500" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium">Sistema</div>
                                  <div className="text-xs text-slate-500">{formatDateTime(interaction.created_at)}</div>
                                </div>
                              </div>
                            )}
                          </div>
                          {interaction.is_public ? (
                            <Badge className="bg-blue-100 text-blue-700">Público</Badge>
                          ) : (
                            <Badge className="bg-slate-100 text-slate-700">Interno</Badge>
                          )}
                        </div>
                        <div className="text-sm whitespace-pre-line pl-10">
                          {interaction.content}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    Nenhuma interação registrada.
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>
          
          {/* Conteúdo da aba de Histórico */}
          <TabsContent value="history" className="p-0 m-0">
            <div className="p-6">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                Histórico de Atividades
              </h4>
              
              <ScrollArea className="h-[500px] pr-4">
                {ticket.interactions ? (
                  <div className="relative pl-6 border-l border-slate-200 ml-2">
                    {ticket.interactions
                      .filter(i => i.type === "status_change" || i.type === "assignment" || i.type === "system")
                      .map((event, index) => (
                        <div key={index} className="mb-6 relative">
                          <div className="absolute -left-9 mt-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-white"></div>
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-500">{formatDateTime(event.created_at)}</span>
                            <span className="text-sm mt-1">{event.content}</span>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    Histórico não disponível.
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}