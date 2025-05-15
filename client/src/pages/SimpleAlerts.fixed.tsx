import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  AlertTriangle, 
  Clock,
  ChevronDown,
  ChevronUp,
  AlertOctagon,
  AlertCircle,
  Info,
  FileText,
  CheckCircle,
  Cpu,
  MemoryStick,
  HardDrive,
  ArrowUpRight,
  BarChart3
} from "lucide-react";

// Tipos enriquecidos
type AlertSeverity = "critical" | "high" | "medium" | "low";

interface Metrics {
  cpu: number;
  memory: number;
  disk: number;
}

interface SlaInfo {
  contractType: string;
  responseTime: string;
  resolutionTime: string;
  coverage: string;
  elapsedTime: string;
  withinResponseSLA: boolean;
  resolutionPercentUsed: number;
  remainingTime: string;
}

interface EscalationLevel {
  level: number;
  name: string;
  assignee: string;
  status: "completed" | "inProgress" | "pending";
  time?: string;
}

interface Observer {
  name: string;
  status: "active" | "inactive" | "away";
}

interface Monitoring {
  source: string;
  sourceId: string;
  metrics: Metrics;
  lastCheck: string;
  occurrences: number;
}

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
  
  // Dados enriquecidos
  monitoring?: Monitoring;
  sla?: SlaInfo;
  escalation?: {
    currentLevel: number;
    levels: EscalationLevel[];
    observers: Observer[];
  };
}

export default function SimpleAlertsFixed() {
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

  // Dados de exemplo para alertas com informações enriquecidas
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
      isAcknowledged: false,
      monitoring: {
        source: "Zabbix",
        sourceId: "ZBX-10045",
        metrics: {
          cpu: 95,
          memory: 72,
          disk: 88
        },
        lastCheck: "3 minutos atrás",
        occurrences: 3
      },
      sla: {
        contractType: "Premium",
        responseTime: "15 minutos",
        resolutionTime: "4 horas",
        coverage: "24x7",
        elapsedTime: "12 minutos",
        withinResponseSLA: true,
        resolutionPercentUsed: 25,
        remainingTime: "3h 48min"
      },
      escalation: {
        currentLevel: 2,
        levels: [
          {
            level: 1,
            name: "Suporte Técnico",
            assignee: "João Silva",
            status: "completed",
            time: "12 min atrás"
          },
          {
            level: 2,
            name: "Especialista",
            assignee: "Ana Martins",
            status: "inProgress"
          },
          {
            level: 3,
            name: "Especialista Sênior",
            assignee: "Marcos Pereira",
            status: "pending"
          }
        ],
        observers: [
          {
            name: "Roberto Gomes",
            status: "active"
          },
          {
            name: "Carlos Mendes",
            status: "away"
          }
        ]
      }
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
      isAcknowledged: false,
      monitoring: {
        source: "Prometheus",
        sourceId: "PROM-823",
        metrics: {
          cpu: 65,
          memory: 82,
          disk: 55
        },
        lastCheck: "5 minutos atrás",
        occurrences: 2
      },
      sla: {
        contractType: "Standard",
        responseTime: "30 minutos",
        resolutionTime: "8 horas",
        coverage: "8x5",
        elapsedTime: "15 minutos",
        withinResponseSLA: true,
        resolutionPercentUsed: 10,
        remainingTime: "7h 15min"
      },
      escalation: {
        currentLevel: 1,
        levels: [
          {
            level: 1,
            name: "Suporte Técnico",
            assignee: "Carla Souza",
            status: "inProgress"
          },
          {
            level: 2,
            name: "Especialista",
            assignee: "Rafael Costa",
            status: "pending"
          }
        ],
        observers: [
          {
            name: "Fernando Alves",
            status: "active"
          }
        ]
      }
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
      isAcknowledged: false,
      monitoring: {
        source: "Grafana Cloud",
        sourceId: "GFC-9076",
        metrics: {
          cpu: 48,
          memory: 32,
          disk: 65
        },
        lastCheck: "8 minutos atrás",
        occurrences: 5
      },
      sla: {
        contractType: "Standard",
        responseTime: "1 hora",
        resolutionTime: "12 horas",
        coverage: "8x5",
        elapsedTime: "24 minutos",
        withinResponseSLA: true,
        resolutionPercentUsed: 5,
        remainingTime: "11h 36min"
      }
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
      isAcknowledged: false,
      monitoring: {
        source: "Check_MK",
        sourceId: "CMK-436",
        metrics: {
          cpu: 22,
          memory: 45,
          disk: 36
        },
        lastCheck: "12 minutos atrás",
        occurrences: 1
      },
      sla: {
        contractType: "Basic",
        responseTime: "4 horas",
        resolutionTime: "48 horas",
        coverage: "8x5",
        elapsedTime: "1h 5m",
        withinResponseSLA: true,
        resolutionPercentUsed: 3,
        remainingTime: "46h 55min"
      }
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

  // Obter ícone com base na severidade
  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case "critical":
        return <AlertOctagon className="h-5 w-5 text-red-600" />;
      case "high":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case "medium":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  // Obter nome traduzido da severidade
  const getSeverityName = (severity: AlertSeverity): string => {
    switch (severity) {
      case "critical": return "Crítico";
      case "high": return "Alto";
      case "medium": return "Médio";
      case "low": return "Baixo";
      default: return "Desconhecido";
    }
  };

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
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getSeverityIcon(alert.severity)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{alert.message}</h3>
                        <div className="flex flex-wrap gap-2 items-center">
                          <Badge variant="outline" className={STATUS_COLORS[alert.severity]}>
                            {getSeverityName(alert.severity)}
                          </Badge>
                          
                          <Badge variant="outline" className="bg-slate-100 border-slate-200">
                            {alert.client}
                          </Badge>
                          
                          <Badge variant="outline" className="bg-slate-100 border-slate-200">
                            {alert.asset}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        {alert.time}
                      </div>
                      
                      {alert.ticketId ? (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                          <FileText className="h-3.5 w-3.5 mr-1" />
                          Chamado #{alert.ticketId}
                        </Badge>
                      ) : isRecognized ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          Reconhecido
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                          <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                          Pendente
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Conteúdo expandido */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="space-y-4">
                        {/* Seção 1: Detalhes do Alerta */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-3">Detalhes do Alerta</h4>
                          <div className="space-y-2">
                            <p className="text-sm"><strong>ID:</strong> {alert.id}</p>
                            <p className="text-sm"><strong>Severidade:</strong> {getSeverityName(alert.severity)}</p>
                            <p className="text-sm"><strong>Detectado:</strong> {alert.time}</p>
                            <p className="text-sm"><strong>Cliente:</strong> {alert.client}</p>
                            <p className="text-sm"><strong>Ativo:</strong> {alert.asset}</p>
                            <p className="text-sm"><strong>ID do Ativo:</strong> {alert.assetId}</p>
                            {alert.ticketId && (
                              <p className="text-sm"><strong>Chamado:</strong> #{alert.ticketId}</p>
                            )}
                            <p className="text-sm"><strong>Status:</strong> {isRecognized ? "Reconhecido" : "Pendente"}</p>
                          </div>
                        </div>
                        
                        {/* Seção 2: Dados de Monitoramento */}
                        {alert.monitoring && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-3">Dados de Monitoramento</h4>
                            <div className="grid grid-cols-3 gap-3 mb-3">
                              <div className="p-2 bg-white rounded shadow-sm">
                                <div className="flex items-center">
                                  <Cpu className="h-4 w-4 mr-2 text-slate-600" />
                                  <span className="text-xs font-medium">CPU</span>
                                </div>
                                <div className="mt-1">
                                  <Progress value={alert.monitoring.metrics.cpu} className="h-2 w-full" />
                                  <span className="text-xs mt-1 text-gray-600">{alert.monitoring.metrics.cpu}%</span>
                                </div>
                              </div>
                              
                              <div className="p-2 bg-white rounded shadow-sm">
                                <div className="flex items-center">
                                  <MemoryStick className="h-4 w-4 mr-2 text-slate-600" />
                                  <span className="text-xs font-medium">Memória</span>
                                </div>
                                <div className="mt-1">
                                  <Progress value={alert.monitoring.metrics.memory} className="h-2 w-full" />
                                  <span className="text-xs mt-1 text-gray-600">{alert.monitoring.metrics.memory}%</span>
                                </div>
                              </div>
                              
                              <div className="p-2 bg-white rounded shadow-sm">
                                <div className="flex items-center">
                                  <HardDrive className="h-4 w-4 mr-2 text-slate-600" />
                                  <span className="text-xs font-medium">Disco</span>
                                </div>
                                <div className="mt-1">
                                  <Progress value={alert.monitoring.metrics.disk} className="h-2 w-full" />
                                  <span className="text-xs mt-1 text-gray-600">{alert.monitoring.metrics.disk}%</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-xs space-y-1">
                              <p><strong>Origem:</strong> {alert.monitoring.source}</p>
                              <p><strong>ID na Origem:</strong> {alert.monitoring.sourceId}</p>
                              <p><strong>Último Check:</strong> {alert.monitoring.lastCheck}</p>
                              <p><strong>Histórico:</strong> {alert.monitoring.occurrences} ocorrências recentes</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Seção 3: Informações de SLA */}
                        {alert.sla && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-3">Dados de SLA</h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <div className="text-xs space-y-1">
                                  <p><strong>Contrato:</strong> {alert.sla.contractType}</p>
                                  <p><strong>SLA Resposta:</strong> {alert.sla.responseTime}</p>
                                  <p><strong>SLA Resolução:</strong> {alert.sla.resolutionTime}</p>
                                  <p><strong>Horário Cobertura:</strong> {alert.sla.coverage}</p>
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-xs space-y-1">
                                  <p><strong>Tempo Decorrido:</strong> {alert.sla.elapsedTime}</p>
                                  {alert.sla.withinResponseSLA ? (
                                    <p className="text-green-600 font-medium">✓ Dentro do SLA de resposta</p>
                                  ) : (
                                    <p className="text-red-600 font-medium">❌ Fora do SLA de resposta</p>
                                  )}
                                  <p className={alert.sla.resolutionPercentUsed > 70 ? "text-red-600 font-medium" : 
                                      alert.sla.resolutionPercentUsed > 30 ? "text-yellow-600 font-medium" : 
                                      "text-green-600 font-medium"}>
                                    {alert.sla.resolutionPercentUsed > 70 ? "⚠️" : 
                                     alert.sla.resolutionPercentUsed > 30 ? "⚠️" : "✓"} 
                                     {alert.sla.resolutionPercentUsed}% do tempo de resolução consumido
                                  </p>
                                </div>
                                
                                <div className="mt-2">
                                  <span className="text-xs text-gray-600">Tempo Restante para Resolução:</span>
                                  <Progress value={100 - alert.sla.resolutionPercentUsed} className="h-2 w-full mt-1" />
                                  <span className="text-xs">{alert.sla.remainingTime} restantes</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Seção 4: Escalonamento */}
                        {alert.escalation && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-3">Escalonamento</h4>
                            <ol className="relative border-l border-gray-300 ml-3">
                              {alert.escalation.levels.map((level) => (
                                <li className="mb-4 ml-6" key={level.level}>
                                  <span className={`absolute flex items-center justify-center w-6 h-6 ${
                                    level.status === "completed" ? "bg-green-100" :
                                    level.status === "inProgress" ? "bg-blue-100" :
                                    "bg-gray-100"
                                  } rounded-full -left-3 ring-4 ring-white`}>
                                    {level.status === "completed" ? (
                                      <CheckCircle className="w-3 h-3 text-green-600" />
                                    ) : level.status === "inProgress" ? (
                                      <AlertCircle className="w-3 h-3 text-blue-600" />
                                    ) : (
                                      <AlertOctagon className="w-3 h-3 text-gray-400" />
                                    )}
                                  </span>
                                  <div className="ml-2">
                                    <h3 className={`text-sm font-semibold ${
                                      level.status === "pending" ? "text-gray-400" : ""
                                    }`}>Nível {level.level} - {level.name}</h3>
                                    <p className="text-xs">
                                      {level.status === "completed" ? "Concluído: " :
                                       level.status === "inProgress" ? "Em análise: " :
                                       "Não escalonado: "}{level.assignee}
                                    </p>
                                    {level.time && <p className="text-xs">({level.time})</p>}
                                    <p className={`text-xs ${
                                      level.status === "completed" ? "text-green-600" :
                                      level.status === "inProgress" ? "text-blue-600" :
                                      "text-gray-400"
                                    }`}>
                                      {level.status === "completed" ? "✓ Respondido" :
                                       level.status === "inProgress" ? "⏳ Em andamento" :
                                       "Pendente"}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ol>
                            
                            {alert.escalation.observers.length > 0 && (
                              <div className="mt-3 border-t border-gray-200 pt-3">
                                <h5 className="text-sm font-medium mb-2">Observadores do Cliente</h5>
                                <div className="flex flex-wrap gap-2">
                                  {alert.escalation.observers.map((observer, index) => (
                                    <Badge key={index} variant="outline" className="bg-slate-100 flex items-center gap-1">
                                      <span className={`w-2 h-2 ${
                                        observer.status === "active" ? "bg-green-500" :
                                        observer.status === "away" ? "bg-yellow-500" :
                                        "bg-red-500"
                                      } rounded-full`}></span>
                                      {observer.name}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
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
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Reconhecer
                      </Button>
                    )}
                    {alert.ticketId && (
                      <Button 
                        variant="default" 
                        size="sm"
                      >
                        <FileText className="h-4 w-4 mr-2" />
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