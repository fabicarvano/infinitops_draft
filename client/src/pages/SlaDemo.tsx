import { useState } from "react";
import { useEnhancedAlerts } from "@/hooks/use-enhanced-alerts";
import EnhancedAlertCard from "@/components/alerts/EnhancedAlertCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function SlaDemo() {
  const { data: alerts, isLoading } = useEnhancedAlerts();
  const { toast } = useToast();
  const [acknowledged, setAcknowledged] = useState<number[]>([]);
  const [createdTickets, setCreatedTickets] = useState<number[]>([]);
  
  // Handler para reconhecer alertas
  const handleAcknowledge = (alertId: number) => {
    setAcknowledged(prev => [...prev, alertId]);
    toast({
      title: "Alerta reconhecido",
      description: `Alerta #${alertId} foi reconhecido com sucesso.`,
      variant: "default",
    });
  };
  
  // Handler para criar chamados
  const handleCreateTicket = (alertId: number) => {
    setCreatedTickets(prev => [...prev, alertId]);
    toast({
      title: "Chamado criado",
      description: `Chamado para o alerta #${alertId} foi criado com sucesso.`,
      variant: "default",
    });
  };
  
  // Handler para visualizar chamados
  const handleViewTicket = (ticketId: number) => {
    toast({
      title: "Visualização de chamado",
      description: `Abrindo detalhes do chamado #${ticketId}...`,
      variant: "default",
    });
  };
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Demonstração do Sistema de SLA</h1>
        <p className="text-gray-600">
          Esta página demonstra o novo sistema de SLA integrado com monitoramento.
          Todos os alertas exibem as informações de SLA efetivo, status de monitoramento, e
          classificação final em português.
        </p>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Carregando alertas...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {alerts?.map(alert => {
            const isAcknowledged = acknowledged.includes(alert.id);
            const hasTicket = alert.ticketId || createdTickets.includes(alert.id);
            
            // Modificar o alerta se estiver reconhecido ou tiver chamado criado
            const modifiedAlert = {
              ...alert,
              monitoringStatus: isAcknowledged ? "reconhecido" : alert.monitoringStatus,
              ticketId: hasTicket ? alert.ticketId || 1000 + alert.id : undefined,
              ticketCreatedAt: hasTicket ? alert.ticketCreatedAt || new Date().toISOString() : undefined,
            };
            
            return (
              <EnhancedAlertCard 
                key={alert.id}
                alert={modifiedAlert}
                onAcknowledge={handleAcknowledge}
                onCreateTicket={handleCreateTicket}
                onViewTicket={handleViewTicket}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}