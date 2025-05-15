import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  AlertTriangle, 
  Clock,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// Tipos simplificados
type AlertSeverity = "critical" | "high" | "medium" | "low";

interface Alert {
  id: number;
  severity: AlertSeverity;
  client: string;
  asset: string;
  assetId: number;
  message: string;
  time: string;
  isAcknowledged: boolean;
  ticketId?: number;
}

export default function SimpleAlerts() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  // Estado para controlar quais alertas estão expandidos, reconhecidos ou com chamados
  const [expandedAlerts, setExpandedAlerts] = useState<number[]>([]);
  const [acknowledged, setAcknowledged] = useState<number[]>([]);
  
  // Função para expandir/recolher alertas
  const toggleExpandAlert = (alertId: number) => {
    try {
      setExpandedAlerts(prev => {
        // Se já estiver expandido, remover do array
        if (prev.includes(alertId)) {
          return prev.filter(id => id !== alertId);
        } 
        // Caso contrário, adicionar ao array
        return [...prev, alertId];
      });
    } catch (error) {
      console.error("Erro ao expandir/recolher alerta:", error);
      // Em caso de erro, garantir que o estado continue estável
      setExpandedAlerts(prev => [...prev]);
    }
  };
  
  // Função para reconhecer manualmente um alerta
  const handleAcknowledge = (alertId: number) => {
    // Adicionar à lista de alertas reconhecidos
    setAcknowledged(prev => [...prev, alertId]);
    
    toast({
      title: "Alerta reconhecido",
      description: `Alerta #${alertId} foi reconhecido com sucesso.`,
      variant: "default",
    });
  };

  // Dados de exemplo para alertas
  const alerts: Alert[] = [
    {
      id: 1,
      severity: "critical",
      client: "Banco Nacional",
      asset: "Servidor Web Produção",
      assetId: 101,
      message: "CPU load critical (95%)",
      time: "8m atrás",
      ticketId: 5001,
      isAcknowledged: false
    },
    {
      id: 2,
      severity: "high",
      client: "Seguros Confiança",
      asset: "Database Cluster",
      assetId: 202,
      message: "Replication lag > 30s",
      time: "15m atrás",
      ticketId: 5002,
      isAcknowledged: false
    },
    {
      id: 3,
      severity: "medium",
      client: "Educação Virtual",
      asset: "API Gateway",
      assetId: 303,
      message: "High response time (2.5s)",
      time: "24m atrás",
      ticketId: undefined,
      isAcknowledged: false
    },
    {
      id: 4,
      severity: "low",
      client: "Transportes Rápidos",
      asset: "Load Balancer",
      assetId: 404,
      message: "Certificate expiring in 2 weeks",
      time: "1h 5m atrás",
      ticketId: undefined,
      isAcknowledged: false
    }
  ];
  
  // Cores para os status de alertas
  const STATUS_COLORS = {
    critical: "bg-red-100 text-red-800 border-red-300",
    high: "bg-orange-100 text-orange-800 border-orange-300",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
    low: "bg-green-100 text-green-800 border-green-300"
  };
  
  // Filtrar alertas com base no termo de busca
  const filteredAlerts = alerts.filter(alert => 
    alert.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Alertas Ativos</h1>
        <div className="relative max-w-xs">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar alertas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm">
            Nenhum alerta encontrado.
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isExpanded = expandedAlerts.includes(alert.id);
            const isRecognized = acknowledged.includes(alert.id) || alert.isAcknowledged;
            const canAcknowledge = !alert.ticketId && !isRecognized;
            
            return (
              <Card key={alert.id} className="w-full">
                <CardContent className="p-6">
                  {/* Cabeçalho do alerta */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{alert.message}</h3>
                      <div className="flex flex-wrap gap-2 items-center">
                        <Badge variant="outline" className={STATUS_COLORS[alert.severity]}>
                          {alert.severity === "critical" ? "Crítico" : 
                           alert.severity === "high" ? "Alto" : 
                           alert.severity === "medium" ? "Médio" : "Baixo"}
                        </Badge>
                        
                        {alert.ticketId && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                            Chamado #{alert.ticketId}
                          </Badge>
                        )}
                        
                        {isRecognized ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                            Reconhecido
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                            <span className="flex items-center">
                              Pendente
                              <Clock className="h-3.5 w-3.5 ml-1" />
                            </span>
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {alert.time}
                    </div>
                  </div>
                  
                  {/* Informações básicas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600"><strong>Cliente:</strong> {alert.client}</p>
                      <p className="text-gray-600"><strong>Ativo:</strong> {alert.asset}</p>
                    </div>
                  </div>
                  
                  {/* Conteúdo expandido */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-3">Detalhes do Alerta</h4>
                        <div className="space-y-2">
                          <p className="text-sm"><strong>ID:</strong> {alert.id}</p>
                          <p className="text-sm"><strong>Severidade:</strong> {alert.severity}</p>
                          <p className="text-sm"><strong>Detectado:</strong> {alert.time}</p>
                          <p className="text-sm"><strong>ID do Ativo:</strong> {alert.assetId}</p>
                          {alert.ticketId && (
                            <p className="text-sm"><strong>Chamado:</strong> #{alert.ticketId}</p>
                          )}
                          <p className="text-sm"><strong>Status:</strong> {isRecognized ? "Reconhecido" : "Pendente"}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="px-6 pb-4 pt-0 flex justify-between">
                  <Button 
                    variant="ghost" 
                    onClick={() => toggleExpandAlert(alert.id)}
                    className="text-gray-500"
                  >
                    {isExpanded ? (
                      <><ChevronUp className="h-4 w-4 mr-2" /> Recolher</>
                    ) : (
                      <><ChevronDown className="h-4 w-4 mr-2" /> Expandir</>
                    )}
                  </Button>
                  
                  <div className="flex gap-2">
                    {canAcknowledge && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAcknowledge(alert.id)}
                      >
                        Reconhecer
                      </Button>
                    )}
                    {alert.ticketId && (
                      <Button 
                        variant="default" 
                        size="sm"
                      >
                        Ver Chamado
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}