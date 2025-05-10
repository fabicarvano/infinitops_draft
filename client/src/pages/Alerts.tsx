import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  Bell, 
  TicketPlus, 
  ArrowUpRight, 
  AlertCircle, 
  CheckCircle, 
  AlertOctagon,
  FileText,
  Info
} from "lucide-react";

// Tipos para a API de alertas
type ApiSeverity = "0" | "1" | "2" | "3" | "4" | "5";
type AlertSeverity = "not_classified" | "information" | "warning" | "average" | "high" | "disaster";
type SystemSeverity = "nao_classificado" | "informativo" | "aviso" | "medio" | "alto" | "critico";
type AlertStatus = "open" | "acknowledged" | "resolved";

interface Alert {
  id: number;
  severity: SystemSeverity; // Severidade já mapeada para o sistema
  apiSeverity: ApiSeverity; // Código original da API
  client: string;
  asset: string;
  assetId: number;
  message: string;
  time: string;
  status: AlertStatus;
  ticketId?: number;
  isAcknowledged: boolean;
}

export default function Alerts() {
  const [searchTerm, setSearchTerm] = useState("");

  // Função para mapear códigos de severidade da API para valores do sistema
  const mapApiSeverityToSystem = (apiSeverity: ApiSeverity): SystemSeverity => {
    switch (apiSeverity) {
      case "0": return "nao_classificado";
      case "1": return "informativo";
      case "2": return "aviso";
      case "3": return "medio";
      case "4": return "alto";
      case "5": return "critico";
      default: return "nao_classificado";
    }
  };

  // Dados de exemplo para alertas
  const alerts: Alert[] = [
    {
      id: 1,
      apiSeverity: "5",
      severity: "critico",
      client: "Empresa XYZ",
      asset: "SRV-DB01",
      assetId: 1,
      message: "Disco crítico (98%)",
      time: "12m atrás",
      ticketId: 1001,
      status: "open",
      isAcknowledged: false
    },
    {
      id: 2,
      apiSeverity: "3",
      severity: "medio",
      client: "Empresa ABC",
      asset: "RTR-EDGE-03",
      assetId: 2,
      message: "Tráfego acima do normal",
      time: "27m atrás",
      ticketId: undefined,
      status: "open",
      isAcknowledged: false
    },
    {
      id: 3,
      apiSeverity: "5",
      severity: "critico",
      client: "Tech Solutions",
      asset: "SRV-WEB02",
      assetId: 3,
      message: "Serviço Apache indisponível",
      time: "43m atrás",
      ticketId: 1003,
      status: "open",
      isAcknowledged: false
    },
    {
      id: 4,
      apiSeverity: "3",
      severity: "medio",
      client: "Empresa XYZ",
      asset: "NAS-BACKUP",
      assetId: 4,
      message: "Falha no backup noturno",
      time: "1h 12m atrás",
      ticketId: 1004,
      status: "open",
      isAcknowledged: false
    },
    {
      id: 5,
      apiSeverity: "2",
      severity: "aviso",
      client: "Empresa DEF",
      asset: "RTR-CORE-01",
      assetId: 5,
      message: "Latência elevada",
      time: "1h 38m atrás",
      ticketId: undefined,
      status: "open",
      isAcknowledged: false
    },
    {
      id: 6,
      apiSeverity: "1",
      severity: "informativo",
      client: "Tech Solutions",
      asset: "SRV-WEB01",
      assetId: 6,
      message: "Reinício programado em 30 minutos",
      time: "2h atrás",
      ticketId: undefined,
      status: "open",
      isAcknowledged: true
    },
    {
      id: 7,
      apiSeverity: "4",
      severity: "alto",
      client: "Empresa ABC",
      asset: "FW-MAIN",
      assetId: 7,
      message: "Alto uso de CPU",
      time: "45m atrás",
      ticketId: 1007,
      status: "open",
      isAcknowledged: false
    },
    {
      id: 8,
      apiSeverity: "2",
      severity: "aviso",
      client: "Empresa XYZ",
      asset: "SW-DIST-02",
      assetId: 8,
      message: "Tráfego elevado na porta 24",
      time: "1h 5m atrás",
      ticketId: undefined,
      status: "open",
      isAcknowledged: false
    },
    {
      id: 9,
      apiSeverity: "0",
      severity: "nao_classificado",
      client: "Tech Solutions",
      asset: "SRV-LOG",
      assetId: 9,
      message: "Alerta não classificado",
      time: "3h atrás",
      ticketId: undefined,
      status: "open",
      isAcknowledged: false
    },
  ];

  // Função para verificar se o alerta é de alta severidade (Alto ou Crítico)
  const isHighSeverity = (severity: SystemSeverity): boolean => {
    return severity === "alto" || severity === "critico";
  };

  // Verificamos se o alerta precisa estar no card "Alertas sem Chamados"
  // Alertas no card: Não reconhecidos OU sem chamados abertos (exceto Alta/Crítica que já têm chamados automáticos)
  const pendingAlerts = alerts.filter(alert => 
    !isHighSeverity(alert.severity) && // Não é de alta severidade
    (!alert.isAcknowledged || !alert.ticketId) // Não reconhecido OU sem chamado
  );

  // Contagem de alertas por severidade
  const criticalAlerts = alerts.filter(alert => alert.severity === "critico");
  const mediumAlerts = alerts.filter(alert => 
    ["medio", "aviso", "informativo", "nao_classificado"].includes(alert.severity)
  );

  // Mapeia a severidade do sistema para um badge visual
  const getSeverityBadge = (severity: SystemSeverity) => {
    switch (severity) {
      case "critico":
        return <Badge className="bg-red-100 text-red-700">Crítico</Badge>;
      case "alto":
        return <Badge className="bg-orange-100 text-orange-700">Alto</Badge>;
      case "medio":
        return <Badge className="bg-yellow-100 text-yellow-700">Médio</Badge>;
      case "aviso":
        return <Badge className="bg-blue-100 text-blue-700">Aviso</Badge>;
      case "informativo":
        return <Badge className="bg-green-100 text-green-700">Informativo</Badge>;
      case "nao_classificado":
      default:
        return <Badge className="bg-slate-100 text-slate-700">Não classificado</Badge>;
    }
  };

  // Obtem ícone baseado na severidade
  const getSeverityIcon = (severity: SystemSeverity) => {
    switch (severity) {
      case "critico":
        return <AlertOctagon className="h-4 w-4 mr-1 text-red-600" />;
      case "alto":
        return <AlertTriangle className="h-4 w-4 mr-1 text-orange-600" />;
      case "medio":
        return <AlertTriangle className="h-4 w-4 mr-1 text-yellow-600" />;
      case "aviso":
        return <AlertCircle className="h-4 w-4 mr-1 text-blue-600" />;
      case "informativo":
        return <Info className="h-4 w-4 mr-1 text-green-600" />;
      case "nao_classificado":
      default:
        return <AlertCircle className="h-4 w-4 mr-1 text-slate-600" />;
    }
  };

  const getStatusBadge = (alert: Alert) => {
    // Alerta crítico/alto: sempre mostra chamado automático
    if (isHighSeverity(alert.severity)) {
      if (alert.ticketId) {
        return <Badge className="bg-purple-100 text-purple-700">Chamado Automático #{alert.ticketId}</Badge>;
      } else {
        // Aguardando criação automática
        return <Badge className="bg-purple-100 text-purple-700">Aguardando chamado automático</Badge>;
      }
    }
    
    // Casos para alertas de severidade média, baixa, etc.
    if (alert.isAcknowledged) {
      return <Badge className="bg-green-100 text-green-700">Reconhecido</Badge>;
    } else if (alert.ticketId) {
      return <Badge className="bg-blue-100 text-blue-700">Chamado #{alert.ticketId}</Badge>;
    } else {
      return <Badge className="bg-yellow-100 text-yellow-700">Pendente</Badge>;
    }
  };

  // Funções para gerenciar ações nos alertas
  const handleGoToTicket = (ticketId?: number) => {
    if (ticketId) {
      alert(`Redirecionando para o chamado #${ticketId}`);
    } else {
      alert("Criando um novo chamado para este alerta");
    }
  };

  const handleAcknowledge = (alertId: number) => {
    alert(`Reconhecendo alerta #${alertId}`);
    // Na implementação real, chamaríamos uma API para reconhecer o alerta
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar alertas..."
            className="w-full pl-9 border-slate-200"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          className="w-full sm:w-auto border-green-700 text-green-700 hover:bg-green-50"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Card de Alertas Críticos */}
        <div className="card overflow-hidden border-l-4 border-l-red-500">
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="bg-red-50 p-2 rounded-lg mr-3">
                  <AlertOctagon className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <Badge className="bg-red-100 text-red-700 mb-1">Crítico</Badge>
                  <h3 className="font-medium">{criticalAlerts.length} alertas críticos</h3>
                </div>
              </div>
            </div>
            <p className="text-slate-500 text-sm mb-4">
              Alertas que precisam de atenção imediata
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full border-red-200 text-red-700 hover:bg-red-50"
            >
              Ver alertas críticos
            </Button>
          </div>
        </div>
        
        {/* Card de Alertas de Atenção */}
        <div className="card overflow-hidden border-l-4 border-l-yellow-500">
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="bg-yellow-50 p-2 rounded-lg mr-3">
                  <Bell className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <Badge className="bg-yellow-100 text-yellow-700 mb-1">Médio</Badge>
                  <h3 className="font-medium">{mediumAlerts.length} alertas de atenção</h3>
                </div>
              </div>
            </div>
            <p className="text-slate-500 text-sm mb-4">
              Alertas que precisam ser monitorados
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full border-yellow-200 text-yellow-700 hover:bg-yellow-50"
            >
              Ver alertas de atenção
            </Button>
          </div>
        </div>

        {/* Card de Alertas sem Chamados */}
        <div className="card overflow-hidden border-l-4 border-l-blue-500">
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="bg-blue-50 p-2 rounded-lg mr-3">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <Badge className="bg-blue-100 text-blue-700 mb-1">Pendentes</Badge>
                  <h3 className="font-medium">{pendingAlerts.length} alertas sem chamados</h3>
                </div>
              </div>
            </div>
            <p className="text-slate-500 text-sm mb-4">
              Alertas que precisam ser reconhecidos ou terem chamados abertos
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              Ver alertas pendentes
            </Button>
          </div>
        </div>
      </div>
      
      {/* Tabela de Alertas Ativos */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-red-50 p-2 rounded-lg mr-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="title text-lg">Alertas Ativos</h3>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800"
          >
            Atualizar
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-200">
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Severidade</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Cliente</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Ativo</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Mensagem</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Status</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium">Tempo</TableHead>
                <TableHead className="text-xs text-slate-500 uppercase font-medium text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => {
                // Determina se o alerta é de alta severidade (alto ou crítico)
                const highSeverityAlert = isHighSeverity(alert.severity);
                
                return (
                  <TableRow key={alert.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <TableCell>
                      <div className="flex items-center">
                        {getSeverityIcon(alert.severity)}
                        {getSeverityBadge(alert.severity)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{alert.client}</TableCell>
                    <TableCell>{alert.asset}</TableCell>
                    <TableCell>{alert.message}</TableCell>
                    <TableCell>{getStatusBadge(alert)}</TableCell>
                    <TableCell>{alert.time}</TableCell>
                    <TableCell className="text-right">
                      {/* Ações diferentes dependendo do tipo de alerta */}
                      {highSeverityAlert ? (
                        /* Alertas alto/crítico: apenas ver chamado */
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-800"
                          onClick={() => handleGoToTicket(alert.ticketId)}
                        >
                          <FileText className="mr-1 h-4 w-4" />
                          {alert.ticketId ? `Chamado #${alert.ticketId}` : "Aguardando chamado"}
                        </Button>
                      ) : (
                        /* Alertas de menor severidade: reconhecer ou criar chamado */
                        <div className="flex space-x-2 justify-end">
                          {!alert.isAcknowledged && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800"
                              onClick={() => handleAcknowledge(alert.id)}
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Reconhecer
                            </Button>
                          )}
                          
                          {!alert.ticketId && (
                            <Button 
                              size="sm" 
                              variant="default"
                              className="bg-blue-700 hover:bg-blue-800"
                              onClick={() => handleGoToTicket(alert.ticketId)}
                            >
                              <TicketPlus className="mr-1 h-4 w-4" />
                              Criar Chamado
                            </Button>
                          )}
                          
                          {alert.ticketId && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-800"
                              onClick={() => handleGoToTicket(alert.ticketId)}
                            >
                              <ArrowUpRight className="mr-1 h-4 w-4" />
                              Chamado #{alert.ticketId}
                            </Button>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
