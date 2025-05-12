import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TicketDetails } from "./TicketDetailsPanel";
import { EnhancedTicketPanel } from "./EnhancedTicketPanel";

interface TicketModalProps {
  ticketId?: number;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (ticketId: number, newStatus: string) => void;
  onAddComment?: (ticketId: number, comment: string, isPublic: boolean) => void;
}

export function TicketModal({ 
  ticketId, 
  isOpen, 
  onClose, 
  onStatusChange, 
  onAddComment 
}: TicketModalProps) {
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState<TicketDetails | null>(null);
  
  // Mock para exemplificar - em uma implementação real, isso buscaria do backend
  useEffect(() => {
    if (ticketId && isOpen) {
      setLoading(true);
      
      // Simula uma chamada à API
      setTimeout(() => {
        const mockTicket: TicketDetails = {
          id: ticketId,
          title: `Servidor com alta utilização de CPU #${ticketId}`,
          description: "O servidor está apresentando alta utilização de CPU, acima de 90% por mais de 30 minutos consecutivos. Verificar processos em execução e possíveis causas do consumo elevado.",
          status: "open",
          priority: "high",
          asset: {
            id: 1,
            name: "SRV-WEB-01",
            type: "Servidor"
          },
          client: {
            id: 1,
            name: "Empresa ABC"
          },
          assignee: {
            id: 2,
            name: "Técnico 1"
          },
          created_by: {
            id: 1,
            name: "Sistema de Monitoramento"
          },
          created_at: "2025-05-10T14:30:00.000Z",
          updated_at: "2025-05-10T15:45:00.000Z",
          sla_priority: "Alta",
          first_response_deadline: "2025-05-10T16:30:00.000Z",
          resolution_deadline: "2025-05-10T20:30:00.000Z",
          alert_id: 103,
          interactions: [
            {
              id: 1,
              type: "system",
              content: "Chamado aberto automaticamente pelo sistema de monitoramento",
              is_public: false,
              created_at: "2025-05-10T14:30:00.000Z"
            },
            {
              id: 2,
              type: "assignment",
              content: "Chamado atribuído para Técnico 1",
              is_public: false,
              created_at: "2025-05-10T14:35:00.000Z"
            },
            {
              id: 3,
              type: "comment",
              content: "Iniciando análise do servidor. Logs indicam possível problema com o serviço de banco de dados.",
              user: {
                id: 2,
                name: "Técnico 1"
              },
              is_public: false,
              created_at: "2025-05-10T15:00:00.000Z"
            },
            {
              id: 4,
              type: "comment",
              content: "Prezado cliente, estamos investigando a alta utilização de CPU no servidor. Já identificamos possíveis processos causadores e estamos tomando as medidas necessárias.",
              user: {
                id: 2,
                name: "Técnico 1"
              },
              is_public: true,
              created_at: "2025-05-10T15:30:00.000Z"
            }
          ]
        };
        
        setTicket(mockTicket);
        setLoading(false);
      }, 500);
    }
  }, [ticketId, isOpen]);
  
  const handleStatusChange = (ticketId: number, newStatus: string) => {
    // Atualiza localmente para a UI responder imediatamente
    if (ticket) {
      setTicket({
        ...ticket,
        status: newStatus as any,
        interactions: [
          ...(ticket.interactions || []),
          {
            id: Date.now(),
            type: "status_change",
            content: `Status alterado para: ${newStatus}`,
            user: {
              id: 2,
              name: "Técnico 1"
            },
            is_public: false,
            created_at: new Date().toISOString()
          }
        ]
      });
    }
    
    // Chama a função de callback se existir
    if (onStatusChange) {
      onStatusChange(ticketId, newStatus);
    }
  };
  
  const handleAddComment = (ticketId: number, comment: string, isPublic: boolean) => {
    // Atualiza localmente para a UI responder imediatamente
    if (ticket) {
      setTicket({
        ...ticket,
        interactions: [
          ...(ticket.interactions || []),
          {
            id: Date.now(),
            type: "comment",
            content: comment,
            user: {
              id: 2,
              name: "Técnico 1"
            },
            is_public: isPublic,
            created_at: new Date().toISOString()
          }
        ]
      });
    }
    
    // Chama a função de callback se existir
    if (onAddComment) {
      onAddComment(ticketId, comment, isPublic);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] md:max-w-[80vw] lg:max-w-[1100px] max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="sr-only">Detalhes do Chamado #{ticketId}</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center items-center py-12 px-6 flex-grow">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : ticket ? (
          <div className="flex-grow overflow-auto p-0">
            <EnhancedTicketPanel 
              ticket={ticket} 
              onStatusChange={handleStatusChange}
              onAddComment={handleAddComment}
              onAssignUser={(ticketId, userId) => {
                // Em uma aplicação real, isso chamaria o backend
                console.log(`Atribuindo chamado ${ticketId} para usuário ${userId}`);
                
                // Atualiza localmente para teste
                if (ticket) {
                  setTicket({
                    ...ticket,
                    assignee: {
                      id: userId,
                      name: `Técnico ${userId}`,
                    }
                  });
                }
              }}
              onEscalate={(ticketId, toLevel, reason) => {
                // Em uma aplicação real, isso chamaria o backend
                console.log(`Escalonando chamado ${ticketId} para ${toLevel}: ${reason}`);
                
                // Atualiza interações localmente para teste
                if (ticket) {
                  setTicket({
                    ...ticket,
                    interactions: [
                      ...(ticket.interactions || []),
                      {
                        id: Date.now(),
                        type: "system",
                        content: `Chamado escalonado para nível ${toLevel}: ${reason}`,
                        is_public: false,
                        created_at: new Date().toISOString()
                      }
                    ]
                  });
                }
              }}
              onPauseSLA={(ticketId, reason) => {
                // Em uma aplicação real, isso chamaria o backend
                console.log(`Pausando SLA do chamado ${ticketId}: ${reason}`);
                
                // Atualiza localmente para teste
                if (ticket) {
                  setTicket({
                    ...ticket,
                    sla_paused: true,
                    interactions: [
                      ...(ticket.interactions || []),
                      {
                        id: Date.now(),
                        type: "system",
                        content: `SLA pausado: ${reason}`,
                        is_public: false,
                        created_at: new Date().toISOString()
                      }
                    ]
                  });
                }
              }}
              onResumeSLA={(ticketId) => {
                // Em uma aplicação real, isso chamaria o backend
                console.log(`Retomando SLA do chamado ${ticketId}`);
                
                // Atualiza localmente para teste
                if (ticket) {
                  setTicket({
                    ...ticket,
                    sla_paused: false,
                    interactions: [
                      ...(ticket.interactions || []),
                      {
                        id: Date.now(),
                        type: "system",
                        content: "SLA retomado",
                        is_public: false,
                        created_at: new Date().toISOString()
                      }
                    ]
                  });
                }
              }}
              onClose={onClose}
            />
          </div>
        ) : (
          <div className="flex justify-center items-center py-12 px-6 flex-grow">
            <p className="text-slate-500">Chamado não encontrado.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}